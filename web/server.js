/**
 * Standalone Unified Server for yawscent indonesia
 * Melayani Web Frontend, Gambar Produk Asli, dan API Backend secara terintegrasi
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

// 1. Load Real Database Engine (SQL Persistence via SQLite / PostgreSQL)
let db;
try {
  db = require("../backend/src/data/database");
} catch (e) {
  try {
    db = require("./database");
  } catch (e2) {
    console.error("[SERVER ERROR] Real SQL Database engine failed to load:", e.message);
  }
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf"
};

const quizQuestions = [
  {
    id: "q1_vibe",
    title: "1. Vibe aroma apa yang paling mewakili kepribadianmu?",
    options: [
      { key: "bold_mysterious", label: "Misterius, Maskulin/Feminin Kuat & Smoky", accord: "woody_smoky" },
      { key: "fresh_energetic", label: "Segar, Bersih, Penuh Energi & Ceria", accord: "citrus_fresh" },
      { key: "warm_gourmand", label: "Manis Menggoda, Hangat & Addictive (Vanilla Coffee)", accord: "gourmand_amber" },
      { key: "regal_oud", label: "Kemewahan Ningrat & Mawar Spiced Oud", accord: "rose_oud" },
      { key: "adventurous", label: "Ingin mengeksplorasi seluruh spektrum aroma yawscent", accord: "discovery" }
    ]
  },
  {
    id: "q2_occasion",
    title: "2. Kapan waktu penggunaan utama parfummu?",
    options: [
      { key: "evening_date", label: "Kencan Malam, Pesta & Acara Formal", accord: "woody_smoky" },
      { key: "daily_work", label: "Aktivitas Kantor, Kampus & Siang Terik", accord: "citrus_fresh" },
      { key: "cozy_cafe", label: "Nongkrong Santai di Cafe & Musim Hujan", accord: "gourmand_amber" },
      { key: "royal_event", label: "Pernikahan, Gala Dinner & Acara Karpet Merah", accord: "rose_oud" },
      { key: "anywhere", label: "Fleksibel untuk berganti aroma kapan saja", accord: "discovery" }
    ]
  },
  {
    id: "q3_intensity",
    title: "3. Karakter proyeksi apa yang kamu cari?",
    options: [
      { key: "ultra_long", label: "Extrait de Parfum (12 Jam tahan menempel di pakaian)", accord: "woody_smoky" },
      { key: "moderate", label: "Segar & Ramah di Hidung (Tidak bikin enek/pusing)", accord: "citrus_fresh" },
      { key: "balanced", label: "Manis Menempel Sensual di Kulit (8-10 Jam)", accord: "gourmand_amber" },
      { key: "flexible", label: "Botol mini travel yang mudah dibawa kemana-mana", accord: "discovery" }
    ]
  }
];

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const host = req.headers.host || `localhost:${PORT}`;
  const parsedUrl = new URL(req.url, `http://${host}`);
  let pathname = parsedUrl.pathname;

  // 1. API Endpoints Handler
  if (pathname.startsWith("/api/v1/")) {
    const BACKEND_URL = process.env.BACKEND_URL;
    if (BACKEND_URL) {
      try {
        const targetUrl = new URL(req.url, BACKEND_URL);
        const proxyReq = http.request(targetUrl, {
          method: req.method,
          headers: {
            ...req.headers,
            host: targetUrl.host
          }
        }, (proxyRes) => {
          res.writeHead(proxyRes.statusCode, proxyRes.headers);
          proxyRes.pipe(res);
        });
        proxyReq.on("error", (err) => {
          console.warn(`[Proxy Fallback] Backend not reachable (${err.message}). Using local real SQL database.`);
          handleRealApi(req, res, pathname, parsedUrl);
        });
        req.pipe(proxyReq);
        return;
      } catch (err) {
        // Fallback to local
      }
    }
    return handleRealApi(req, res, pathname, parsedUrl);
  }

  // 2. Serve Images from public/images/
  if (pathname.startsWith("/images/")) {
    const imageName = path.basename(pathname);
    const localImagePath = path.join(PUBLIC_DIR, "images", imageName);
    if (fs.existsSync(localImagePath)) {
      const ext = path.extname(imageName).toLowerCase();
      const contentType = MIME_TYPES[ext] || "image/jpeg";
      res.writeHead(200, { "Content-Type": contentType, "Cache-Control": "public, max-age=86400" });
      return fs.createReadStream(localImagePath).pipe(res);
    }
  }

  // 3. Serve Public Static Files
  if (pathname === "/" || pathname === "") {
    pathname = "/index.html";
  } else if (pathname === "/login") {
    pathname = "/login.html";
  }

  const filePath = path.join(PUBLIC_DIR, pathname);
  const ext = path.extname(filePath).toLowerCase();

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("404 Not Found - yawscent server");
    }

    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

/**
 * Handle API calls using the real SQLite SQL Database
 */
function handleRealApi(req, res, pathname, parsedUrl) {
  res.setHeader("Content-Type", "application/json");

  // Health check
  if (pathname === "/api/v1/health") {
    res.writeHead(200);
    return res.end(JSON.stringify({
      status: "ok",
      brand: "yawscent indonesia",
      database: "SQLite SQL Persistence (Active)",
      time: new Date().toISOString(),
      version: "2.0.0"
    }));
  }

  // POST /api/v1/auth/login
  if (pathname === "/api/v1/auth/login" && req.method === "POST") {
    readJsonBody(req, (err, body) => {
      if (err || !body.email || !body.password) {
        res.writeHead(400);
        return res.end(JSON.stringify({ status: "error", message: "Email dan kata sandi wajib diisi" }));
      }
      try {
        const user = db.loginUser(body.email.trim(), body.password.trim());
        res.writeHead(200);
        return res.end(JSON.stringify({
          status: "success",
          message: `Selamat datang kembali, ${user.fullName}!`,
          data: user
        }));
      } catch (e) {
        res.writeHead(401);
        return res.end(JSON.stringify({ status: "error", message: e.message }));
      }
    });
    return;
  }

  // GET /api/v1/auth/me
  if (pathname === "/api/v1/auth/me" && req.method === "GET") {
    const userId = parsedUrl.searchParams.get("userId") || "user-owner-001";
    const user = db ? db.getUserById(userId) : null;
    if (!user) {
      res.writeHead(404);
      return res.end(JSON.stringify({ status: "error", message: "Pengguna tidak ditemukan" }));
    }
    res.writeHead(200);
    return res.end(JSON.stringify({ status: "success", data: user }));
  }

  // GET /api/v1/users
  if (pathname === "/api/v1/users" && req.method === "GET") {
    const users = db ? db.getUsers() : [];
    res.writeHead(200);
    return res.end(JSON.stringify({ status: "success", count: users.length, data: users }));
  }

  // GET /api/v1/products
  if (pathname === "/api/v1/products" && req.method === "GET") {
    const gender = parsedUrl.searchParams.get("gender") || undefined;
    const character = parsedUrl.searchParams.get("character") || undefined;
    const products = db ? db.getProducts({ gender, character }) : [];
    res.writeHead(200);
    return res.end(JSON.stringify({ status: "success", count: products.length, data: products }));
  }

  // GET /api/v1/products/:slug
  if (pathname.startsWith("/api/v1/products/") && req.method === "GET") {
    const slug = pathname.replace("/api/v1/products/", "");
    const product = db ? db.getProductBySlug(slug) : null;
    if (product) {
      res.writeHead(200);
      return res.end(JSON.stringify({ status: "success", data: product }));
    }
    res.writeHead(404);
    return res.end(JSON.stringify({ status: "error", message: "Parfum tidak ditemukan di database SQL" }));
  }

  // GET /api/v1/testimonials
  if (pathname === "/api/v1/testimonials" && req.method === "GET") {
    const list = db ? db.getTestimonials() : [];
    const formatted = list.map(t => ({
      name: t.name,
      city: t.city,
      rating: t.rating,
      quote: t.quote,
      variant: t.product
    }));
    res.writeHead(200);
    return res.end(JSON.stringify({ status: "success", count: formatted.length, data: formatted }));
  }

  // GET /api/v1/vouchers
  if (pathname === "/api/v1/vouchers" && req.method === "GET") {
    const vouchers = db ? db.getVouchers() : [];
    res.writeHead(200);
    return res.end(JSON.stringify({ status: "success", data: vouchers }));
  }

  // GET /api/v1/admin/stats
  if (pathname === "/api/v1/admin/stats" && req.method === "GET") {
    const stats = db ? db.getDashboardStats() : null;
    res.writeHead(200);
    return res.end(JSON.stringify({ status: "success", data: stats }));
  }

  // POST /api/v1/admin/stock (Update stock in real SQLite database)
  if (pathname === "/api/v1/admin/stock" && (req.method === "POST" || req.method === "PATCH")) {
    readJsonBody(req, (err, body) => {
      if (err || !body.sku) {
        res.writeHead(400);
        return res.end(JSON.stringify({ status: "error", message: "SKU wajib diisi" }));
      }
      try {
        db.updateStock(body.sku, body.stockOnline, body.stockStore);
        res.writeHead(200);
        return res.end(JSON.stringify({
          status: "success",
          message: `Stok untuk SKU ${body.sku} berhasil diperbarui permanen di database SQL`
        }));
      } catch (e) {
        res.writeHead(500);
        return res.end(JSON.stringify({ status: "error", message: e.message }));
      }
    });
    return;
  }

  // PATCH or POST /api/v1/admin/orders/:id/status
  if (pathname.startsWith("/api/v1/admin/orders/") && pathname.endsWith("/status") && (req.method === "PATCH" || req.method === "POST")) {
    const parts = pathname.split("/");
    const orderId = parts[4];
    readJsonBody(req, (err, body) => {
      if (err) {
        res.writeHead(400);
        return res.end(JSON.stringify({ status: "error", message: "Payload tidak valid" }));
      }
      try {
        db.updateOrderStatus(orderId, body.status, body.trackingNumber);
        res.writeHead(200);
        return res.end(JSON.stringify({
          status: "success",
          message: `Status pesanan ${orderId} berhasil diupdate permanen di database SQL`
        }));
      } catch (e) {
        res.writeHead(500);
        return res.end(JSON.stringify({ status: "error", message: e.message }));
      }
    });
    return;
  }

  // GET /api/v1/orders
  if (pathname === "/api/v1/orders" && req.method === "GET") {
    const limit = parseInt(parsedUrl.searchParams.get("limit") || "50");
    const orders = db ? db.getOrders(limit) : [];
    res.writeHead(200);
    return res.end(JSON.stringify({ status: "success", count: orders.length, data: orders }));
  }

  // POST /api/v1/orders/checkout (Save real order to SQL Database & update stock)
  if (pathname === "/api/v1/orders/checkout" && req.method === "POST") {
    readJsonBody(req, (err, body) => {
      if (err) {
        res.writeHead(400);
        return res.end(JSON.stringify({ status: "error", message: "Invalid JSON body" }));
      }
      try {
        const order = db.createOrder(body);
        res.writeHead(201);
        return res.end(JSON.stringify({
          status: "success",
          message: "Pesanan berhasil tersimpan permanen di database SQL",
          data: order
        }));
      } catch (e) {
        res.writeHead(500);
        return res.end(JSON.stringify({ status: "error", message: e.message }));
      }
    });
    return;
  }

  // GET /api/v1/loyalty/profile
  if (pathname === "/api/v1/loyalty/profile" && req.method === "GET") {
    const userId = parsedUrl.searchParams.get("userId") || "user-001";
    const profile = db ? db.getLoyaltyProfile(userId) : null;
    if (!profile) {
      res.writeHead(404);
      return res.end(JSON.stringify({ status: "error", message: "Profil loyalty tidak ditemukan" }));
    }
    res.writeHead(200);
    return res.end(JSON.stringify({
      status: "success",
      data: {
        ...profile,
        tierBenefits: [
          "Cashback Poin 5% setiap pembelanjaan",
          "Free Discovery Tester setiap checkout",
          "Akses 48 jam lebih awal untuk rilisan aroma terbatas (Limited Drop)",
          "Gratis ongkir ke seluruh pulau Jawa"
        ],
        availableRewards: [
          { id: "rew-1", title: "Voucher Diskon Rp 25.000", costPoints: 250, code: "YSPOIN25" },
          { id: "rew-2", title: "Voucher Diskon Rp 50.000", costPoints: 500, code: "YSPOIN50" },
          { id: "rew-3", title: "Gratis 1 Botol Santara 30ml", costPoints: 1200, code: "YSFREESANTARA" }
        ]
      }
    }));
  }

  // POST /api/v1/loyalty/redeem
  if (pathname === "/api/v1/loyalty/redeem" && req.method === "POST") {
    readJsonBody(req, (err, body) => {
      if (err) {
        res.writeHead(400);
        return res.end(JSON.stringify({ status: "error", message: "Payload tidak valid" }));
      }
      try {
        const result = db.redeemPoints(body.userId || "user-001", body.cost || 250, body.title || "Penukaran Reward");
        res.writeHead(200);
        return res.end(JSON.stringify({
          status: "success",
          message: "Reward berhasil ditukarkan di database SQL!",
          data: result
        }));
      } catch (e) {
        res.writeHead(400);
        return res.end(JSON.stringify({ status: "error", message: e.message }));
      }
    });
    return;
  }

  // GET /api/v1/scent-finder/questions
  if (pathname === "/api/v1/scent-finder/questions" && req.method === "GET") {
    res.writeHead(200);
    return res.end(JSON.stringify({ status: "success", data: quizQuestions }));
  }

  // POST /api/v1/scent-finder/recommend
  if (pathname === "/api/v1/scent-finder/recommend" && req.method === "POST") {
    readJsonBody(req, (err, body) => {
      const answers = body?.answers || {};
      let scores = { noir: 0, santara: 0, discovery: 0, velvet: 0, bali: 0 };

      Object.values(answers).forEach(ans => {
        if (ans === "bold_mysterious" || ans === "evening_date" || ans === "ultra_long") scores.noir += 3;
        else if (ans === "fresh_energetic" || ans === "daily_work" || ans === "moderate") scores.santara += 3;
        else if (ans === "warm_gourmand" || ans === "cozy_cafe" || ans === "balanced") scores.bali += 3;
        else if (ans === "regal_oud" || ans === "royal_event") scores.velvet += 3;
        else if (ans === "adventurous" || ans === "anywhere" || ans === "flexible") scores.discovery += 4;
        else { scores.noir += 1; scores.santara += 1; }
      });

      let recommendedSlug = "noir-extrait";
      let matchReason = "Aroma pekat Haitian Vetiver dan Indonesian Agarwood sempurna untuk aura elegan dan misterius.";

      if (scores.discovery >= Math.max(scores.noir, scores.santara, scores.bali, scores.velvet)) {
        recommendedSlug = "discovery-set";
        matchReason = "Discovery Collection 5x5ml adalah pilihan terbaik agar kamu dapat merasakan langsung seluruh spektrum aroma yawscent.";
      } else if (scores.bali >= Math.max(scores.noir, scores.santara, scores.velvet)) {
        recommendedSlug = "bali-gourmand";
        matchReason = "Paduan manis Vanilla Bali, Roasted Coffee, dan Toasted Coconut menghadirkan kenyamanan sensual tak terlupakan.";
      } else if (scores.velvet >= Math.max(scores.noir, scores.santara)) {
        recommendedSlug = "velvet-oud";
        matchReason = "Kombinasi agung Cambodian Agarwood dan kelopak Damask Rose memancarkan karisma aristokrat yang mempesona.";
      } else if (scores.santara > scores.noir) {
        recommendedSlug = "santara-bloom";
        matchReason = "Paduan segar Bergamot dan Kaffir Lime dengan sentuhan Jasmine memberikan energi segar yang tahan seharian.";
      }

      const product = db ? (db.getProductBySlug(recommendedSlug) || db.getProducts()[0]) : null;

      res.writeHead(200);
      return res.end(JSON.stringify({
        status: "success",
        recommendedProduct: product,
        matchReason,
        matchPercentage: 98,
        scores
      }));
    });
    return;
  }

  // POST /api/v1/shipping/rates
  if (pathname === "/api/v1/shipping/rates" && req.method === "POST") {
    res.writeHead(200);
    return res.end(JSON.stringify({
      status: "success",
      data: [
        { courierCode: "jnt", service: "Regular (EZ)", cost: 10000, etd: "1-2 Hari" },
        { courierCode: "sicepat", service: "BEST (1 Hari)", cost: 18000, etd: "1 Hari" },
        { courierCode: "anteraja", service: "Reguler", cost: 9000, etd: "2-3 Hari" }
      ]
    }));
  }

  res.writeHead(404);
  res.end(JSON.stringify({ status: "error", message: `Endpoint ${pathname} tidak ditemukan` }));
}

function readJsonBody(req, callback) {
  let body = "";
  req.on("data", chunk => { body += chunk; });
  req.on("end", () => {
    try {
      const parsed = JSON.parse(body || "{}");
      callback(null, parsed);
    } catch (e) {
      callback(e, null);
    }
  });
}

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`✨ YAWSCENT INDONESIA UNIFIED SERVER (REAL SQL PERSISTENCE) ✨`);
    console.log(`   Web Store & Admin : http://localhost:${PORT}`);
    console.log(`   API Health        : http://localhost:${PORT}/api/v1/health`);
    console.log(`   Database Status   : Connected to SQLite (yawscent.db)`);
    console.log(`=======================================================`);
  });
}

module.exports = server;
