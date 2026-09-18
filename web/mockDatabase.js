/**
 * [DEPRECATED] Dialihkan ke Real Database Engine (SQL Persistence via SQLite yawscent.db)
 * Seluruh data menggunakan data riil di backend/data/yawscent.db
 */

const db = require("../backend/src/data/database");

module.exports = {
  get products() { return db.getProducts(); },
  get orders() { return db.getOrders(); },
  get vouchers() { return db.getVouchers(); },
  get loyaltyUsers() { return [db.getLoyaltyProfile("user-001")]; }
};

const products = [
  {
    id: "prod-noir-001",
    slug: "noir-extrait",
    name: "YAWSCENT Noir",
    tagline: "The Enigmatic Midnight Mystery",
    description: "Kombinasi intens dari Indonesian Vetiver, Haitian Amyris, dan Smokey Leather. Dirancang untuk mereka yang berkarakter kuat, elegan, dan memikat di malam hari.",
    gender: "UNISEX",
    concentration: "Extrait De Parfum (35% Oil)",
    longevityHours: 12,
    sillageRating: "Strong & Enveloping",
    character: "Smoky, Woody, Dark Amber",
    rating: 4.95,
    reviewCount: 384,
    imageUrl: "/images/noir.jpg",
    badge: "Best Seller",
    notes: {
      top: ["Calabrian Bergamot", "Pink Peppercorn", "Smoked Cardamom"],
      heart: ["Java Vetiver Bloom", "Iris Root", "Dark Cacao Pod"],
      base: ["Indonesian Agarwood (Oud)", "Smokey Leather", "Ambergris", "Bourbon Vanilla"]
    },
    variants: [
      { id: "var-noir-50", sizeMl: 50, sku: "YS-NOIR-50", price: 349000, discountPrice: 299000, stockOnline: 48, stockStore: 22 },
      { id: "var-noir-30", sizeMl: 30, sku: "YS-NOIR-30", price: 239000, discountPrice: null, stockOnline: 60, stockStore: 35 }
    ]
  },
  {
    id: "prod-santara-002",
    slug: "santara-bloom",
    name: "YAWSCENT Santara",
    tagline: "Sun-drenched Mediterranean Citrus & Tropical Petals",
    description: "Kesegaran pagi yang membangkitkan semangat. Perpaduan harmonis antara Bergamot Italia, Kaffir Lime Indonesia, dan hembusan melati putih yang bersih dan menyegarkan.",
    gender: "UNISEX",
    concentration: "Eau De Parfum (22% Oil)",
    longevityHours: 8,
    sillageRating: "Moderate & Fresh",
    character: "Citrus, Aromatic, White Floral",
    rating: 4.90,
    reviewCount: 290,
    imageUrl: "/images/santara.jpg",
    badge: "Editor's Choice",
    notes: {
      top: ["Mandarin Orange", "Sparkling Bergamot", "Kaffir Lime Leaf"],
      heart: ["Jasmine Sambac", "Neroli", "Sea Salt Accord"],
      base: ["White Musk", "Cedarwood", "Clean Amber"]
    },
    variants: [
      { id: "var-santara-50", sizeMl: 50, sku: "YS-SAN-50", price: 319000, discountPrice: 279000, stockOnline: 75, stockStore: 30 },
      { id: "var-santara-30", sizeMl: 30, sku: "YS-SAN-30", price: 219000, discountPrice: null, stockOnline: 80, stockStore: 40 }
    ]
  },
  {
    id: "prod-velvet-004",
    slug: "velvet-oud",
    name: "YAWSCENT Velvet Oud",
    tagline: "Royal Indonesian Oud Wrapped in Silk & Saffron",
    description: "Kemewahan oriental yang menghipnotis. Indonesian Agarwood berpadu dengan Saffron Kashmir dan Rose Damascena, menciptakan aura aristokrat yang tak terlupakan.",
    gender: "UNISEX",
    concentration: "Extrait De Parfum (30% Oil)",
    longevityHours: 10,
    sillageRating: "Strong & Opulent",
    character: "Oriental, Oud, Royal Spice",
    rating: 4.92,
    reviewCount: 196,
    imageUrl: "/images/velvet_oud.jpg",
    badge: "Limited Edition",
    notes: {
      top: ["Kashmir Saffron", "Pink Pepper", "Elemi Resin"],
      heart: ["Rose Damascena", "Indonesian Oud", "Orris Butter"],
      base: ["Sumatran Benzoin", "Cashmeran", "Labdanum Absolute"]
    },
    variants: [
      { id: "var-velvet-50", sizeMl: 50, sku: "YS-VLV-50", price: 389000, discountPrice: 339000, stockOnline: 30, stockStore: 12 },
      { id: "var-velvet-30", sizeMl: 30, sku: "YS-VLV-30", price: 269000, discountPrice: null, stockOnline: 45, stockStore: 20 }
    ]
  },
  {
    id: "prod-bali-005",
    slug: "bali-gourmand",
    name: "YAWSCENT Bali Gourmand",
    tagline: "Tropical Sweetness — Vanilla, Sandalwood & Coconut Bliss",
    description: "Aroma hangat tropis yang memanjakan. Vanilla Bali yang creamy dipadu Sandalwood dan Coconut Nectar, menghadirkan kenyamanan surga tropis di setiap semprotan.",
    gender: "UNISEX",
    concentration: "Eau De Parfum (25% Oil)",
    longevityHours: 9,
    sillageRating: "Moderate & Cozy",
    character: "Gourmand, Tropical, Sweet Warm",
    rating: 4.88,
    reviewCount: 224,
    imageUrl: "/images/bali_gourmand.jpg",
    badge: "Crowd Favorite",
    notes: {
      top: ["Torched Coconut", "Sicilian Lemon Zest", "Sea Breeze Accord"],
      heart: ["Bali Vanilla Orchid", "Frangipani", "Toasted Almond"],
      base: ["Mysore Sandalwood", "Tonka Bean", "Caramelized Sugar"]
    },
    variants: [
      { id: "var-bali-50", sizeMl: 50, sku: "YS-BALI-50", price: 329000, discountPrice: 289000, stockOnline: 55, stockStore: 25 },
      { id: "var-bali-30", sizeMl: 30, sku: "YS-BALI-30", price: 229000, discountPrice: null, stockOnline: 70, stockStore: 30 }
    ]
  },
  {
    id: "prod-discovery-003",
    slug: "discovery-set",
    name: "YAWSCENT Discovery Collection",
    tagline: "5 Signature Scents in 5ml Luxury Sprayers",
    description: "Solusi tepat mengatasi blind-buying. Berisi 5 botol mini travel sprayer (Noir, Santara, Velvet Oud, Bali Gourmand, & Kyoto Rain). Termasuk voucher cashback Rp 50.000 untuk pembelian full bottle.",
    gender: "UNISEX",
    concentration: "Extrait & EDP Discovery Box",
    longevityHours: 10,
    sillageRating: "Curated Variety",
    character: "Complete Olfactory Journey",
    rating: 4.98,
    reviewCount: 812,
    imageUrl: "/images/discovery.jpg",
    badge: "Must Have for Newcomers",
    notes: {
      top: ["Citrus & Fresh Aromatics"],
      heart: ["Floral Petals & Exotic Spices"],
      base: ["Rich Ouds, Ambers & Warm Woods"]
    },
    variants: [
      { id: "var-disc-5x5", sizeMl: 25, sku: "YS-DISC-5X5", price: 179000, discountPrice: 149000, stockOnline: 120, stockStore: 50 }
    ]
  }
];

const vouchers = [
  { code: "YAWWELCOME", type: "PERCENTAGE", value: 10, minSpend: 200000, maxDiscount: 40000, isActive: true },
  { code: "MEMBERVIP", type: "FIXED", value: 50000, minSpend: 300000, maxDiscount: 50000, isActive: true }
];

const loyaltyUsers = [
  {
    userId: "usr-demo-01",
    fullName: "Dimas Arya Pratama",
    email: "dimas@example.com",
    tier: "GOLD_VIP",
    points: 1450,
    totalSpent: 1850000,
    memberCardNumber: "YS-VIP-88921"
  }
];

const orders = [
  {
    id: "ord-883192",
    orderNumber: "YS-20260915-001",
    customerName: "Raditya Maulana",
    phoneNumber: "081298765432",
    channel: "MOBILE_APP",
    status: "PROCESSING",
    items: [
      { productName: "YAWSCENT Noir", sizeMl: 50, quantity: 1, price: 299000 }
    ],
    shippingCity: "Jakarta Selatan",
    courier: "J&T Express - Regular",
    trackingNumber: "JT92837491823",
    totalAmount: 317000,
    paymentMethod: "QRIS (GoPay)",
    paidAt: "2026-09-15T10:15:00.000Z"
  },
  {
    id: "ord-883193",
    orderNumber: "YS-20260915-002",
    customerName: "Jessica Amanda",
    phoneNumber: "085712345678",
    channel: "ONLINE_WEB",
    status: "SHIPPED",
    items: [
      { productName: "YAWSCENT Santara", sizeMl: 50, quantity: 1, price: 279000 },
      { productName: "YAWSCENT Discovery Collection", sizeMl: 25, quantity: 1, price: 149000 }
    ],
    shippingCity: "Surabaya",
    courier: "SiCepat - BEST (Next Day)",
    trackingNumber: "00394829104",
    totalAmount: 452000,
    paymentMethod: "BCA Virtual Account",
    paidAt: "2026-09-15T09:30:00.000Z"
  },
  {
    id: "ord-883194",
    orderNumber: "YS-20260914-003",
    customerName: "Kevin Pratama",
    phoneNumber: "087856781234",
    channel: "ONLINE_WEB",
    status: "DELIVERED",
    items: [
      { productName: "YAWSCENT Velvet Oud", sizeMl: 50, quantity: 1, price: 339000 },
      { productName: "YAWSCENT Noir", sizeMl: 30, quantity: 1, price: 239000 }
    ],
    shippingCity: "Surabaya",
    courier: "Anteraja - Reguler",
    trackingNumber: "ANT88271934102",
    totalAmount: 596000,
    paymentMethod: "QRIS (ShopeePay)",
    paidAt: "2026-09-14T14:22:00.000Z"
  },
  {
    id: "ord-883195",
    orderNumber: "YS-20260914-004",
    customerName: "Toko Flagship Senopati",
    phoneNumber: "02178901234",
    channel: "OFFLINE_STORE_POS",
    status: "DELIVERED",
    items: [
      { productName: "YAWSCENT Bali Gourmand", sizeMl: 50, quantity: 2, price: 289000 },
      { productName: "YAWSCENT Santara", sizeMl: 30, quantity: 3, price: 219000 }
    ],
    shippingCity: "Jakarta Selatan",
    courier: "Direct Pickup",
    trackingNumber: "POS-SENOPATI-14",
    totalAmount: 1235000,
    paymentMethod: "EDC (BCA Debit)",
    paidAt: "2026-09-14T11:45:00.000Z"
  },
  {
    id: "ord-883196",
    orderNumber: "YS-20260913-005",
    customerName: "Anindya Putri",
    phoneNumber: "081345678901",
    channel: "MOBILE_APP",
    status: "DELIVERED",
    items: [
      { productName: "YAWSCENT Discovery Collection", sizeMl: 25, quantity: 2, price: 149000 }
    ],
    shippingCity: "Bandung",
    courier: "SiCepat - BEST (Next Day)",
    trackingNumber: "00482719304",
    totalAmount: 320000,
    paymentMethod: "Mandiri Virtual Account",
    paidAt: "2026-09-13T16:30:00.000Z"
  }
];

module.exports = {
  products,
  vouchers,
  loyaltyUsers,
  orders
};
