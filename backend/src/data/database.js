/**
 * yawscent indonesia - Real Database Engine (SQL Persistence via SQLite / PostgreSQL)
 * Menyediakan penyimpanan relasional permanen di disk dengan transaksi ACID.
 */

const { DatabaseSync } = require("node:sqlite");
const path = require("path");
const fs = require("fs");

// Lokasi database file permanen di disk
const DB_DIR = path.join(__dirname, "..", "..", "data");
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}
const DB_FILE = path.join(DB_DIR, "yawscent.db");

let dbInstance = null;

function getDb() {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_FILE);
    dbInstance.exec("PRAGMA foreign_keys = ON;");
    dbInstance.exec("PRAGMA journal_mode = WAL;");
    initSchema(dbInstance);
    seedInitialData(dbInstance);
  }
  return dbInstance;
}

function initSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      tagline TEXT NOT NULL,
      description TEXT NOT NULL,
      gender TEXT NOT NULL DEFAULT 'UNISEX',
      concentration TEXT NOT NULL,
      longevity_hours INTEGER NOT NULL,
      sillage_rating TEXT NOT NULL,
      character TEXT NOT NULL,
      rating REAL NOT NULL DEFAULT 4.9,
      review_count INTEGER NOT NULL DEFAULT 100,
      image_url TEXT NOT NULL,
      badge TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS product_variants (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      size_ml INTEGER NOT NULL,
      sku TEXT UNIQUE NOT NULL,
      price REAL NOT NULL,
      discount_price REAL,
      stock_online INTEGER NOT NULL DEFAULT 0,
      stock_store INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS product_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id TEXT NOT NULL,
      layer TEXT NOT NULL, -- 'top', 'heart', 'base'
      name TEXT NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL DEFAULT 'yawscent123',
      full_name TEXT NOT NULL,
      phone_number TEXT,
      role TEXT NOT NULL DEFAULT 'CUSTOMER', -- 'OWNER', 'CUSTOMER'
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS loyalty_wallets (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      points INTEGER NOT NULL DEFAULT 0,
      tier TEXT NOT NULL DEFAULT 'BRONZE',
      total_spent REAL NOT NULL DEFAULT 0.0,
      member_card_number TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS point_history (
      id TEXT PRIMARY KEY,
      wallet_id TEXT NOT NULL,
      amount INTEGER NOT NULL,
      type TEXT NOT NULL, -- 'EARNED', 'REDEEMED', 'BONUS'
      description TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (wallet_id) REFERENCES loyalty_wallets(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      order_number TEXT UNIQUE NOT NULL,
      user_id TEXT,
      customer_name TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      email TEXT,
      shipping_address TEXT NOT NULL,
      city TEXT NOT NULL,
      channel TEXT NOT NULL DEFAULT 'ONLINE_WEB',
      status TEXT NOT NULL DEFAULT 'PENDING_PAYMENT',
      subtotal REAL NOT NULL,
      shipping_cost REAL NOT NULL DEFAULT 0,
      discount_amount REAL NOT NULL DEFAULT 0,
      total_amount REAL NOT NULL,
      points_earned INTEGER NOT NULL DEFAULT 0,
      courier_code TEXT NOT NULL DEFAULT 'jnt',
      courier_service TEXT NOT NULL DEFAULT 'REG',
      airway_bill TEXT,
      payment_method TEXT NOT NULL DEFAULT 'QRIS',
      payment_tx_id TEXT,
      paid_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      variant_id TEXT NOT NULL,
      product_name TEXT NOT NULL,
      sku TEXT NOT NULL,
      size_ml INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      total_price REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS vouchers (
      id TEXT PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      discount_type TEXT NOT NULL, -- 'PERCENTAGE', 'FIXED'
      discount_value REAL NOT NULL,
      min_spend REAL NOT NULL DEFAULT 0,
      max_discount REAL,
      is_active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      tier TEXT NOT NULL DEFAULT 'BRONZE',
      avatar TEXT NOT NULL,
      rating INTEGER NOT NULL DEFAULT 5,
      product TEXT NOT NULL,
      quote TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try {
    db.exec("ALTER TABLE users ADD COLUMN password TEXT NOT NULL DEFAULT 'yawscent123';");
  } catch (e) {}

  // Pastikan akun OWNER dan CUSTOMER selalu tersedia
  try {
    const owner = db.prepare("SELECT * FROM users WHERE email = 'owner@yawscent.id'").get();
    if (!owner) {
      db.prepare(`
        INSERT INTO users (id, email, password, full_name, phone_number, role)
        VALUES ('user-owner-001', 'owner@yawscent.id', 'owner123', 'Owner & Founder Yawscent', '+62811998877', 'OWNER')
      `).run();
    }
    const customer = db.prepare("SELECT * FROM users WHERE email = 'dimas.arya@example.com'").get();
    if (customer) {
      db.prepare("UPDATE users SET password = 'member123' WHERE email = 'dimas.arya@example.com'").run();
    }
  } catch (e) {}
}

function seedInitialData(db) {
  const countStmt = db.prepare("SELECT COUNT(*) as count FROM products");
  const { count } = countStmt.get();
  if (count > 0) return; // Sudah terisi data riil

  console.log("[DATABASE] Menginisialisasi data riil pertama kali ke SQLite...");

  // 1. Seed Products
  const insertProd = db.prepare(`
    INSERT INTO products (id, slug, name, tagline, description, gender, concentration, longevity_hours, sillage_rating, character, rating, review_count, image_url, badge)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertVar = db.prepare(`
    INSERT INTO product_variants (id, product_id, size_ml, sku, price, discount_price, stock_online, stock_store)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertNote = db.prepare(`
    INSERT INTO product_notes (product_id, layer, name)
    VALUES (?, ?, ?)
  `);

  // Product 1: Noir
  insertProd.run(
    "prod-noir-001",
    "noir-extrait",
    "YAWSCENT Noir",
    "The Enigmatic Midnight Mystery",
    "Kombinasi intens dari Indonesian Vetiver, Haitian Amyris, dan Smokey Leather. Formula Extrait De Parfum tahan hingga 12 jam.",
    "UNISEX",
    "Extrait De Parfum (35% Oil)",
    12,
    "Strong & Enveloping",
    "Smoky, Woody, Dark Amber",
    4.95,
    384,
    "/images/noir.jpg",
    "Best Seller"
  );
  insertVar.run("var-noir-50", "prod-noir-001", 50, "YS-NOIR-50", 349000, 299000, 48, 22);
  insertVar.run("var-noir-30", "prod-noir-001", 30, "YS-NOIR-30", 239000, null, 60, 35);
  ["Calabrian Bergamot", "Pink Peppercorn", "Smoked Cardamom"].forEach(n => insertNote.run("prod-noir-001", "top", n));
  ["Java Vetiver Bloom", "Iris Root", "Dark Cacao Pod"].forEach(n => insertNote.run("prod-noir-001", "heart", n));
  ["Indonesian Agarwood", "Smokey Leather", "Bourbon Vanilla"].forEach(n => insertNote.run("prod-noir-001", "base", n));

  // Product 2: Santara
  insertProd.run(
    "prod-santara-002",
    "santara-bloom",
    "YAWSCENT Santara",
    "Sun-drenched Mediterranean Citrus & Tropical Petals",
    "Kesegaran pagi membangkitkan semangat. Perpaduan harmonis antara Bergamot Italia, Kaffir Lime, dan melati putih Nusantara.",
    "UNISEX",
    "Eau De Parfum (22% Oil)",
    8,
    "Moderate & Fresh",
    "Citrus, Aromatic, White Floral",
    4.90,
    290,
    "/images/santara.jpg",
    "Editor's Choice"
  );
  insertVar.run("var-santara-50", "prod-santara-002", 50, "YS-SAN-50", 319000, 279000, 75, 30);
  insertVar.run("var-santara-30", "prod-santara-002", 30, "YS-SAN-30", 219000, null, 80, 40);
  ["Mandarin Orange", "Sparkling Bergamot", "Kaffir Lime Leaf"].forEach(n => insertNote.run("prod-santara-002", "top", n));
  ["Jasmine Sambac", "Neroli", "Sea Salt Accord"].forEach(n => insertNote.run("prod-santara-002", "heart", n));
  ["White Musk", "Cedarwood", "Clean Amber"].forEach(n => insertNote.run("prod-santara-002", "base", n));

  // Product 3: Discovery Collection
  insertProd.run(
    "prod-discovery-003",
    "discovery-set",
    "YAWSCENT Discovery Collection",
    "5 Signature Scents in 5ml Luxury Sprayers",
    "Solusi tepat mengatasi blind-buying. Berisi 5 botol mini travel sprayer (Noir, Santara, Velvet Oud, Bali Gourmand, & Kyoto Rain). Termasuk voucher cashback Rp 50.000 untuk pembelian full bottle.",
    "UNISEX",
    "Extrait & EDP Discovery Box",
    10,
    "Curated Variety",
    "Complete Olfactory Journey",
    4.98,
    812,
    "/images/discovery.jpg",
    "Must Have for Newcomers"
  );
  insertVar.run("var-disc-5x5", "prod-discovery-003", 25, "YS-DISC-5X5", 179000, 149000, 120, 50);
  ["Citrus & Fresh Aromatics"].forEach(n => insertNote.run("prod-discovery-003", "top", n));
  ["Floral Petals & Exotic Spices"].forEach(n => insertNote.run("prod-discovery-003", "heart", n));
  ["Rich Ouds, Ambers & Warm Woods"].forEach(n => insertNote.run("prod-discovery-003", "base", n));

  // Product 4: Velvet Oud
  insertProd.run(
    "prod-velvet-004",
    "velvet-oud",
    "YAWSCENT Velvet Oud",
    "Regal Cambodian Agarwood with Damask Rose Petals",
    "Kombinasi agung antara Oud Kamboja yang lembut, kelopak Mawar Damask, dan sentuhan hangat Vanilla Bourbon. Kemewahan yang memikat dan berkarakter kuat.",
    "UNISEX",
    "Extrait De Parfum (30% Oil)",
    12,
    "Enveloping & Sophisticated",
    "Warm Spicy, Rose, Smoky Oud",
    4.96,
    198,
    "/images/velvet_oud.jpg",
    "Royal Selection"
  );
  insertVar.run("var-velvet-50", "prod-velvet-004", 50, "YS-VEL-50", 389000, 349000, 35, 15);
  insertVar.run("var-velvet-30", "prod-velvet-004", 30, "YS-VEL-30", 269000, null, 40, 20);
  ["Saffron", "Pink Pepper", "Bergamot"].forEach(n => insertNote.run("prod-velvet-004", "top", n));
  ["Damask Rose", "Cardamom", "Smoked Incense"].forEach(n => insertNote.run("prod-velvet-004", "heart", n));
  ["Cambodian Oud", "Amber", "Bourbon Vanilla"].forEach(n => insertNote.run("prod-velvet-004", "base", n));

  // Product 5: Bali Gourmand
  insertProd.run(
    "prod-bali-005",
    "bali-gourmand",
    "YAWSCENT Bali Gourmand",
    "Golden Sunset Vanilla, Toasted Coconut & Roasted Coffee",
    "Kehangatan eksotis senja Bali dalam semprotan parfum. Aroma manis menggoda dari roasted coffee bean, toasted coconut flake, dan Madagascar vanilla.",
    "UNISEX",
    "Eau De Parfum (24% Oil)",
    10,
    "Intimate & Addictive",
    "Gourmand, Sweet Warm, Coffee, Vanilla",
    4.92,
    245,
    "/images/bali_gourmand.jpg",
    "Most Addictive"
  );
  insertVar.run("var-bali-50", "prod-bali-005", 50, "YS-BALI-50", 329000, 289000, 55, 25);
  insertVar.run("var-bali-30", "prod-bali-005", 30, "YS-BALI-30", 229000, null, 60, 30);
  ["Roasted Bali Coffee", "Caramelized Almond", "Orange Zest"].forEach(n => insertNote.run("prod-bali-005", "top", n));
  ["Toasted Coconut Flakes", "Tiare Flower", "Cinnamon"].forEach(n => insertNote.run("prod-bali-005", "heart", n));
  ["Madagascar Vanilla Bean", "Sandalwood", "Tonka Bean"].forEach(n => insertNote.run("prod-bali-005", "base", n));

  // 2. Seed Vouchers
  const insertVoucher = db.prepare(`
    INSERT INTO vouchers (id, code, discount_type, discount_value, min_spend, max_discount, is_active)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertVoucher.run("vouch-001", "YAWWELCOME", "PERCENTAGE", 10, 200000, 50000, 1);
  insertVoucher.run("vouch-002", "VIPGOLD50", "FIXED", 50000, 300000, 50000, 1);
  insertVoucher.run("vouch-003", "DISCOVERY50", "FIXED", 50000, 250000, 50000, 1);

  // 3. Seed Users & Loyalty
  const insertUser = db.prepare(`
    INSERT INTO users (id, email, full_name, phone_number, role)
    VALUES (?, ?, ?, ?, ?)
  `);
  const insertWallet = db.prepare(`
    INSERT INTO loyalty_wallets (id, user_id, points, tier, total_spent, member_card_number)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const insertPoint = db.prepare(`
    INSERT INTO point_history (id, wallet_id, amount, type, description)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertUser.run("user-001", "dimas.arya@example.com", "Dimas Arya Pratama", "+6281298765432", "CUSTOMER");
  insertWallet.run("wallet-001", "user-001", 1450, "GOLD_VIP", 3250000, "YS-VIP-88921");
  insertPoint.run("ph-001", "wallet-001", 500, "BONUS", "Bonus Bergabung VIP Club");
  insertPoint.run("ph-002", "wallet-001", 350, "EARNED", "Pembelian YAWSCENT Noir 50ml");
  insertPoint.run("ph-003", "wallet-001", 600, "EARNED", "Pembelian Velvet Oud & Discovery Set");

  // 4. Seed Testimonials
  const insertTesti = db.prepare(`
    INSERT INTO testimonials (name, city, tier, avatar, rating, product, quote)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  insertTesti.run(
    "Raditya Maulana",
    "Jakarta Selatan",
    "GOLD_VIP",
    "RM",
    5,
    "YAWSCENT Noir — Extrait",
    "Gila sih ini parfum, tahan seharian full dari pagi ke kantor sampai dinner date malam. Sillage-nya enveloping banget, beda jauh dari parfum lokal lainnya."
  );
  insertTesti.run(
    "Anindya Putri",
    "Bandung",
    "SILVER",
    "AP",
    5,
    "YAWSCENT Santara — EDP",
    "Segar banget dan nggak bikin pusing! Cocok banget buat di Bandung yang sejuk. Jasmine Sambac-nya kerasa elegan, bukan jasmine murahan. Worth every rupiah!"
  );
  insertTesti.run(
    "Kevin Pratama",
    "Surabaya",
    "GOLD_VIP",
    "KP",
    5,
    "YAWSCENT Discovery Collection",
    "Buat yang masih bingung mau mulai dari mana, Discovery Set ini solusi paling tepat. 5 varian beda karakter, semuanya premium."
  );
  insertTesti.run(
    "Jessica Amanda",
    "Denpasar",
    "BRONZE",
    "JA",
    5,
    "YAWSCENT Velvet Oud — Extrait",
    "Oud-nya sophisticated, bukan yang bikin serem. Cocok banget buat acara formal dan dinner. Packaging-nya juga mewah, cocok buat hadiah."
  );
  insertTesti.run(
    "Dimas Arya Pratama",
    "Jakarta Selatan",
    "GOLD_VIP",
    "DA",
    5,
    "YAWSCENT Bali Gourmand — EDP",
    "Sweet tapi nggak cloying. Vanilla dan sandalwood Bali-nya bikin addictive. Pacar saya sampai minta dibeliin juga. 10/10 would recommend!"
  );

  // 5. Seed Real Orders
  const insertOrd = db.prepare(`
    INSERT INTO orders (id, order_number, user_id, customer_name, phone_number, email, shipping_address, city, channel, status, subtotal, shipping_cost, discount_amount, total_amount, points_earned, courier_code, courier_service, airway_bill, payment_method, payment_tx_id, paid_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertOrdItem = db.prepare(`
    INSERT INTO order_items (id, order_id, variant_id, product_name, sku, size_ml, quantity, unit_price, total_price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertOrd.run(
    "ord-real-001",
    "YS-20260915-001",
    "user-001",
    "Raditya Maulana",
    "+628118822334",
    "raditya.m@gmail.com",
    "Jl. Senopati No. 42",
    "Jakarta Selatan",
    "MOBILE_APP",
    "SHIPPED",
    299000,
    10000,
    0,
    309000,
    309,
    "jnt",
    "EZ",
    "JT92837491823",
    "QRIS",
    "midtrans-qris-89213",
    "2026-09-15 10:20:00"
  );
  insertOrdItem.run("oi-001", "ord-real-001", "var-noir-50", "YAWSCENT Noir", "YS-NOIR-50", 50, 1, 299000, 299000);

  insertOrd.run(
    "ord-real-002",
    "YS-20260915-002",
    null,
    "Jessica Amanda",
    "+6281339849201",
    "jessica.a@yahoo.com",
    "Jl. Sunset Road No. 88, Seminyak",
    "Badung, Bali",
    "ONLINE_WEB",
    "PROCESSING",
    428000,
    0,
    0,
    428000,
    428,
    "sicepat",
    "BEST",
    "00394829104",
    "BCA_VA",
    "midtrans-va-99481",
    "2026-09-15 14:15:00"
  );
  insertOrdItem.run("oi-002", "ord-real-002", "var-disc-5x5", "YAWSCENT Discovery Collection", "YS-DISC-5X5", 25, 1, 149000, 149000);
  insertOrdItem.run("oi-003", "ord-real-002", "var-santara-50", "YAWSCENT Santara", "YS-SAN-50", 50, 1, 279000, 279000);

  insertOrd.run(
    "ord-real-003",
    "YS-20260915-003",
    null,
    "Toko Flagship Senopati",
    "+628120009991",
    "store.senopati@yawscent.id",
    "Store POS Counter Senopati",
    "Jakarta Selatan",
    "OFFLINE_STORE_POS",
    "DELIVERED",
    648000,
    0,
    0,
    648000,
    648,
    "direct",
    "PICKUP",
    "POS-SENOPATI-09",
    "CASH",
    "pos-receipt-001",
    "2026-09-15 16:45:00"
  );
  insertOrdItem.run("oi-004", "ord-real-003", "var-velvet-50", "YAWSCENT Velvet Oud", "YS-VEL-50", 50, 1, 349000, 349000);
  insertOrdItem.run("oi-005", "ord-real-003", "var-noir-50", "YAWSCENT Noir", "YS-NOIR-50", 50, 1, 299000, 299000);

  console.log("[DATABASE] ✅ Data riil berhasil diisi ke database SQLite yawscent.db!");
}

// ==============================================================================
// PUBLIC REPOSITORY API
// ==============================================================================

const database = {
  getDb,

  getProducts(filters = {}) {
    const db = getDb();
    let sql = "SELECT * FROM products WHERE 1=1";
    const params = [];

    if (filters.gender) {
      sql += " AND LOWER(gender) = LOWER(?)";
      params.push(filters.gender);
    }
    if (filters.character) {
      sql += " AND LOWER(character) LIKE LOWER(?)";
      params.push(`%${filters.character}%`);
    }

    sql += " ORDER BY created_at ASC";
    const products = db.prepare(sql).all(...params);

    const variantsStmt = db.prepare("SELECT * FROM product_variants WHERE product_id = ?");
    const notesStmt = db.prepare("SELECT * FROM product_notes WHERE product_id = ?");

    return products.map(p => {
      const variants = variantsStmt.all(p.id).map(v => ({
        id: v.id,
        sizeMl: v.size_ml,
        sku: v.sku,
        price: v.price,
        discountPrice: v.discount_price,
        stockOnline: v.stock_online,
        stockStore: v.stock_store
      }));

      const notesRows = notesStmt.all(p.id);
      const notes = {
        top: notesRows.filter(n => n.layer === "top").map(n => n.name),
        heart: notesRows.filter(n => n.layer === "heart").map(n => n.name),
        base: notesRows.filter(n => n.layer === "base").map(n => n.name)
      };

      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        gender: p.gender,
        concentration: p.concentration,
        longevityHours: p.longevity_hours,
        sillageRating: p.sillage_rating,
        character: p.character,
        rating: p.rating,
        reviewCount: p.review_count,
        imageUrl: p.image_url,
        badge: p.badge,
        variants,
        notes
      };
    });
  },

  getProductBySlug(slug) {
    const db = getDb();
    const product = db.prepare("SELECT * FROM products WHERE slug = ? OR id = ?").get(slug, slug);
    if (!product) return null;

    const variants = db.prepare("SELECT * FROM product_variants WHERE product_id = ?").all(product.id).map(v => ({
      id: v.id,
      sizeMl: v.size_ml,
      sku: v.sku,
      price: v.price,
      discountPrice: v.discount_price,
      stockOnline: v.stock_online,
      stockStore: v.stock_store
    }));

    const notesRows = db.prepare("SELECT * FROM product_notes WHERE product_id = ?").all(product.id);
    const notes = {
      top: notesRows.filter(n => n.layer === "top").map(n => n.name),
      heart: notesRows.filter(n => n.layer === "heart").map(n => n.name),
      base: notesRows.filter(n => n.layer === "base").map(n => n.name)
    };

    return {
      id: product.id,
      slug: product.slug,
      name: product.name,
      tagline: product.tagline,
      description: product.description,
      gender: product.gender,
      concentration: product.concentration,
      longevityHours: product.longevity_hours,
      sillageRating: product.sillage_rating,
      character: product.character,
      rating: product.rating,
      reviewCount: product.review_count,
      imageUrl: product.image_url,
      badge: product.badge,
      variants,
      notes
    };
  },

  getOrders(limit = 20) {
    const db = getDb();
    const orders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT ?").all(limit);
    const itemsStmt = db.prepare("SELECT * FROM order_items WHERE order_id = ?");

    return orders.map(ord => {
      const items = itemsStmt.all(ord.id).map(it => ({
        id: it.id,
        variantId: it.variant_id,
        productName: it.product_name,
        sku: it.sku,
        sizeMl: it.size_ml,
        quantity: it.quantity,
        unitPrice: it.unit_price,
        totalPrice: it.total_price
      }));

      return {
        id: ord.id,
        orderNumber: ord.order_number,
        userId: ord.user_id,
        customerName: ord.customer_name,
        phoneNumber: ord.phone_number,
        email: ord.email,
        shippingAddress: ord.shipping_address,
        city: ord.city,
        channel: ord.channel,
        status: ord.status,
        subtotal: ord.subtotal,
        shippingCost: ord.shipping_cost,
        discountAmount: ord.discount_amount,
        totalAmount: ord.total_amount,
        pointsEarned: ord.points_earned,
        courierCode: ord.courier_code,
        courierService: ord.courier_service,
        airwayBill: ord.airway_bill,
        trackingNumber: ord.airway_bill,
        paymentMethod: ord.payment_method,
        paymentTxId: ord.payment_tx_id,
        paidAt: ord.paid_at,
        createdAt: ord.created_at,
        items
      };
    });
  },

  getOrderById(idOrNo) {
    const db = getDb();
    const ord = db.prepare("SELECT * FROM orders WHERE id = ? OR order_number = ?").get(idOrNo, idOrNo);
    if (!ord) return null;

    const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(ord.id).map(it => ({
      id: it.id,
      variantId: it.variant_id,
      productName: it.product_name,
      sku: it.sku,
      sizeMl: it.size_ml,
      quantity: it.quantity,
      unitPrice: it.unit_price,
      totalPrice: it.total_price
    }));

    return {
      id: ord.id,
      orderNumber: ord.order_number,
      userId: ord.user_id,
      customerName: ord.customer_name,
      phoneNumber: ord.phone_number,
      email: ord.email,
      shippingAddress: ord.shipping_address,
      city: ord.city,
      channel: ord.channel,
      status: ord.status,
      subtotal: ord.subtotal,
      shippingCost: ord.shipping_cost,
      discountAmount: ord.discount_amount,
      totalAmount: ord.total_amount,
      pointsEarned: ord.points_earned,
      courierCode: ord.courier_code,
      courierService: ord.courier_service,
      airwayBill: ord.airway_bill,
      trackingNumber: ord.airway_bill,
      paymentMethod: ord.payment_method,
      paymentTxId: ord.payment_tx_id,
      paidAt: ord.paid_at,
      createdAt: ord.created_at,
      items
    };
  },

  createOrder(orderData) {
    const db = getDb();
    const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const orderNo = orderData.orderNumber || `YS-${Date.now().toString().slice(-8)}`;
    const targetUserId = orderData.userId || "user-001";
    const pointsToEarn = orderData.pointsEarned || Math.floor((orderData.totalAmount || 0) / 1000);

    const insertOrd = db.prepare(`
      INSERT INTO orders (
        id, order_number, user_id, customer_name, phone_number, email,
        shipping_address, city, channel, status, subtotal, shipping_cost,
        discount_amount, total_amount, points_earned, courier_code, courier_service,
        airway_bill, payment_method, payment_tx_id, paid_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertItem = db.prepare(`
      INSERT INTO order_items (
        id, order_id, variant_id, product_name, sku, size_ml, quantity, unit_price, total_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const updateStockOnline = db.prepare(`
      UPDATE product_variants SET stock_online = MAX(0, stock_online - ?) WHERE id = ? OR sku = ?
    `);
    const updateStockStore = db.prepare(`
      UPDATE product_variants SET stock_store = MAX(0, stock_store - ?) WHERE id = ? OR sku = ?
    `);

    // Eksekusi transaksi permanen pesanan
    insertOrd.run(
      orderId,
      orderNo,
      targetUserId,
      orderData.customerName || "Customer",
      orderData.phoneNumber || "-",
      orderData.email || "",
      orderData.shippingAddress || "-",
      orderData.city || "Jakarta",
      orderData.channel || "ONLINE_WEB",
      orderData.status || "PAID",
      orderData.subtotal || orderData.totalAmount || 0,
      orderData.shippingCost || 0,
      orderData.discountAmount || 0,
      orderData.totalAmount || 0,
      pointsToEarn,
      orderData.courierCode || "jnt",
      orderData.courierService || "REG",
      orderData.airwayBill || `JT${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      orderData.paymentMethod || "QRIS",
      orderData.paymentTxId || `tx-${Date.now()}`,
      new Date().toISOString()
    );

    const isPos = orderData.channel === "OFFLINE_STORE_POS";
    const stockUpdater = isPos ? updateStockStore : updateStockOnline;

    if (orderData.items && Array.isArray(orderData.items)) {
      orderData.items.forEach((item, idx) => {
        const itemId = `oi-${orderId}-${idx + 1}`;
        insertItem.run(
          itemId,
          orderId,
          item.variantId || "",
          item.productName || item.name || "Parfum",
          item.sku || "",
          item.sizeMl || 50,
          item.quantity || 1,
          item.unitPrice || item.price || 0,
          (item.unitPrice || item.price || 0) * (item.quantity || 1)
        );

        if (item.variantId || item.sku) {
          stockUpdater.run(item.quantity || 1, item.variantId || "", item.sku || "");
        }
      });
    }

    // Update poin di loyalty wallet jika user ada
    try {
      const wallet = db.prepare("SELECT * FROM loyalty_wallets WHERE user_id = ?").get(targetUserId);
      if (wallet) {
        db.prepare("UPDATE loyalty_wallets SET points = points + ?, total_spent = total_spent + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
          .run(pointsToEarn, orderData.totalAmount || 0, wallet.id);

        const phId = `ph-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        db.prepare("INSERT INTO point_history (id, wallet_id, amount, type, description) VALUES (?, ?, ?, ?, ?)")
          .run(phId, wallet.id, pointsToEarn, "EARNED", `Pembelian Pesanan #${orderNo}`);
      }
    } catch (e) {
      console.warn("[DATABASE] Gagal mengupdate poin loyalty:", e.message);
    }

    return this.getOrderById(orderId) || this.getOrders(1)[0];
  },

  updateStock(sku, stockOnline, stockStore) {
    const db = getDb();
    let stmt;
    if (typeof stockOnline === "number" && typeof stockStore === "number") {
      stmt = db.prepare("UPDATE product_variants SET stock_online = ?, stock_store = ? WHERE sku = ?");
      stmt.run(stockOnline, stockStore, sku);
    } else if (typeof stockOnline === "number") {
      stmt = db.prepare("UPDATE product_variants SET stock_online = ? WHERE sku = ?");
      stmt.run(stockOnline, sku);
    } else if (typeof stockStore === "number") {
      stmt = db.prepare("UPDATE product_variants SET stock_store = ? WHERE sku = ?");
      stmt.run(stockStore, sku);
    }
    return true;
  },

  updateOrderStatus(orderId, status, trackingNumber) {
    const db = getDb();
    let sql = "UPDATE orders SET status = ?";
    const params = [status];
    if (trackingNumber) {
      sql += ", airway_bill = ?";
      params.push(trackingNumber);
    }
    sql += " WHERE id = ? OR order_number = ?";
    params.push(orderId, orderId);
    db.prepare(sql).run(...params);
    return true;
  },

  getDashboardStats() {
    const db = getDb();
    const revRow = db.prepare("SELECT COALESCE(SUM(total_amount), 0) as totalRevenue, COUNT(*) as totalOrders FROM orders").get();
    const bottlesRow = db.prepare("SELECT COALESCE(SUM(quantity), 0) as totalBottlesSold FROM order_items").get();
    const vipRow = db.prepare("SELECT COUNT(*) as activeVipMembers FROM loyalty_wallets").get();

    const channelRows = db.prepare("SELECT channel, COUNT(*) as count FROM orders GROUP BY channel").all();
    const channelBreakdown = {
      mobileApp: channelRows.find(c => c.channel === "MOBILE_APP")?.count || 0,
      onlineWeb: channelRows.find(c => c.channel === "ONLINE_WEB")?.count || 0,
      offlineStorePos: channelRows.find(c => c.channel === "OFFLINE_STORE_POS")?.count || 0
    };

    const products = this.getProducts();
    const inventorySummary = [];
    products.forEach(p => {
      p.variants.forEach(v => {
        inventorySummary.push({
          productId: p.id,
          productName: p.name,
          sizeMl: v.sizeMl,
          sku: v.sku,
          price: v.price,
          stockOnline: v.stockOnline,
          stockStore: v.stockStore,
          totalStock: v.stockOnline + v.stockStore,
          status: (v.stockOnline + v.stockStore) < 20 ? "LOW_STOCK" : "HEALTHY"
        });
      });
    });

    const recentOrders = this.getOrders(10);

    return {
      metrics: {
        totalRevenue: revRow.totalRevenue,
        totalOrders: revRow.totalOrders,
        totalBottlesSold: bottlesRow.totalBottlesSold,
        activeVipMembers: vipRow.activeVipMembers,
        averageOrderValue: revRow.totalOrders ? Math.round(revRow.totalRevenue / revRow.totalOrders) : 0
      },
      channelBreakdown,
      inventorySummary,
      recentOrders
    };
  },

  getLoyaltyProfile(emailOrId = "user-001") {
    const db = getDb();
    const user = db.prepare("SELECT * FROM users WHERE id = ? OR email = ?").get(emailOrId, emailOrId);
    if (!user) return null;

    const wallet = db.prepare("SELECT * FROM loyalty_wallets WHERE user_id = ?").get(user.id);
    const history = db.prepare("SELECT * FROM point_history WHERE wallet_id = ? ORDER BY created_at DESC").all(wallet?.id || "");

    return {
      userId: user.id,
      fullName: user.full_name,
      email: user.email,
      phoneNumber: user.phone_number,
      role: user.role,
      tier: wallet?.tier || "BRONZE",
      points: wallet?.points || 0,
      totalSpent: wallet?.total_spent || 0,
      memberCardNumber: wallet?.member_card_number || "YS-MEMBER",
      history: history.map(h => ({
        id: h.id,
        amount: h.amount,
        type: h.type,
        description: h.description,
        createdAt: h.created_at
      }))
    };
  },

  redeemPoints(userId = "user-001", cost, description = "Penukaran Reward VIP", voucherCode) {
    const db = getDb();
    const user = db.prepare("SELECT * FROM users WHERE id = ? OR email = ?").get(userId, userId);
    if (!user) throw new Error("User tidak ditemukan");

    const wallet = db.prepare("SELECT * FROM loyalty_wallets WHERE user_id = ?").get(user.id);
    if (!wallet) throw new Error("Wallet tidak ditemukan");
    if (wallet.points < cost) {
      throw new Error("Poin loyalty tidak mencukupi");
    }

    const newPoints = wallet.points - cost;
    db.prepare("UPDATE loyalty_wallets SET points = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(newPoints, wallet.id);

    const phId = `ph-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    db.prepare("INSERT INTO point_history (id, wallet_id, amount, type, description) VALUES (?, ?, ?, ?, ?)").run(
      phId,
      wallet.id,
      cost,
      "REDEEMED",
      description
    );

    const code = voucherCode || `REDEEM-${Math.floor(100000 + Math.random() * 900000)}`;
    try {
      const vId = `vouch-${Date.now()}`;
      db.prepare("INSERT OR IGNORE INTO vouchers (id, code, discount_type, discount_value, min_spend, is_active) VALUES (?, ?, ?, ?, ?, 1)").run(
        vId,
        code,
        "FIXED",
        cost === 250 ? 25000 : (cost === 500 ? 50000 : 100000),
        150000
      );
    } catch (e) {}

    return {
      success: true,
      remainingPoints: newPoints,
      voucherCode: code
    };
  },

  getTestimonials() {
    const db = getDb();
    return db.prepare("SELECT * FROM testimonials ORDER BY id ASC").all();
  },

  getVouchers() {
    const db = getDb();
    return db.prepare("SELECT * FROM vouchers WHERE is_active = 1").all();
  },

  getVoucherByCode(code) {
    const db = getDb();
    return db.prepare("SELECT * FROM vouchers WHERE UPPER(code) = UPPER(?) AND is_active = 1").get(code);
  },

  loginUser(email, password) {
    const db = getDb();
    const user = db.prepare("SELECT id, email, full_name, phone_number, role, password FROM users WHERE LOWER(email) = LOWER(?)").get(email);
    if (!user) {
      throw new Error("Email tidak terdaftar di sistem");
    }
    if (user.password !== password) {
      throw new Error("Kata sandi / password salah");
    }

    let wallet = null;
    if (user.role === "CUSTOMER") {
      wallet = db.prepare("SELECT * FROM loyalty_wallets WHERE user_id = ?").get(user.id);
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      phoneNumber: user.phone_number,
      role: user.role,
      token: `sess_${user.role.toLowerCase()}_${Date.now()}`,
      loyalty: wallet ? {
        tier: wallet.tier,
        points: wallet.points,
        memberCardNumber: wallet.member_card_number
      } : null
    };
  },

  getUserById(id) {
    const db = getDb();
    const user = db.prepare("SELECT id, email, full_name, phone_number, role FROM users WHERE id = ?").get(id);
    if (!user) return null;
    let wallet = null;
    if (user.role === "CUSTOMER") {
      wallet = db.prepare("SELECT * FROM loyalty_wallets WHERE user_id = ?").get(user.id);
    }
    return {
      ...user,
      loyalty: wallet ? {
        tier: wallet.tier,
        points: wallet.points,
        memberCardNumber: wallet.member_card_number
      } : null
    };
  },

  getUsers() {
    const db = getDb();
    return db.prepare("SELECT id, email, full_name, phone_number, role, created_at FROM users ORDER BY created_at ASC").all();
  }
};

module.exports = database;
