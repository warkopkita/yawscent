const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const scentFinderController = require("../controllers/scentFinderController");
const orderController = require("../controllers/orderController");
const loyaltyController = require("../controllers/loyaltyController");
const adminController = require("../controllers/adminController");
const biteshipService = require("../services/biteshipService");

// Health check
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "yawscent-backend-api",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// Products
router.get("/products", productController.getProducts);
router.get("/products/:slug", productController.getProductBySlug);

const db = require("../data/database");

// Testimonials
router.get("/testimonials", (req, res) => {
  try {
    const data = db.getTestimonials();
    const formatted = data.map(t => ({
      name: t.name,
      city: t.city,
      rating: t.rating,
      quote: t.quote,
      variant: t.product
    }));
    res.json({
      status: "success",
      data: formatted
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Vouchers
router.get("/vouchers", (req, res) => {
  try {
    const vouchers = db.getVouchers();
    res.json({ status: "success", data: vouchers });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Scent Finder
router.get("/scent-finder/questions", scentFinderController.getQuestions);
router.post("/scent-finder/recommend", scentFinderController.recommend);

// Shipping & Logistics (Biteship)
router.post("/shipping/rates", async (req, res) => {
  try {
    const { city, weight } = req.body;
    const rates = await biteshipService.calculateShippingRates({ destinationCity: city, totalWeightGram: weight });
    res.json({ status: "success", data: rates });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Orders & Checkout
router.post("/orders/checkout", orderController.checkout);
router.get("/orders", orderController.getOrders);

// Loyalty & VIP Club
router.get("/loyalty/profile", loyaltyController.getLoyaltyProfile);
router.post("/loyalty/redeem", loyaltyController.redeemReward);

// Admin & Omnichannel POS
router.get("/admin/stats", adminController.getDashboardStats);
router.post("/admin/stock", adminController.updateStock);
router.patch("/admin/orders/:id/status", adminController.updateOrderStatus);

// Auth & Roles
router.post("/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ status: "error", message: "Email dan kata sandi wajib diisi" });
    }
    const user = db.loginUser(email.trim(), password.trim());
    res.json({
      status: "success",
      message: `Selamat datang kembali, ${user.fullName}!`,
      data: user
    });
  } catch (err) {
    res.status(401).json({ status: "error", message: err.message });
  }
});

router.get("/auth/me", (req, res) => {
  try {
    const userId = req.query.userId || "user-owner-001";
    const user = db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ status: "error", message: "Pengguna tidak ditemukan" });
    }
    res.json({ status: "success", data: user });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
