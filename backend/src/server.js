/**
 * yawscent indonesia - Main Backend API Server
 * Mendukung Express.js dan fallback native HTTP module
 */

const http = require("http");
let express;
try {
  express = require("express");
} catch (e) {
  express = null;
}

const PORT = process.env.PORT || 5000;

if (express) {
  const cors = require("cors");
  const app = express();
  const apiRouter = require("./routes/api");

  app.use(cors());
  app.use(express.json());

  // Static images if served from backend
  app.use("/images", express.static("../web/public/images"));

  // API Routes
  app.use("/api/v1", apiRouter);

  app.get("/", (req, res) => {
    res.json({
      brand: "yawscent indonesia",
      message: "Omnichannel Perfume API Engine is running smoothly.",
      docs: "/api/v1/health"
    });
  });

  app.listen(PORT, () => {
    console.log(`[YAWSCENT BACKEND] Server running on http://localhost:${PORT}`);
  });
} else {
  // Built-in HTTP router fallback in case node_modules aren't installed yet
  const db = require("./data/database");
  const scentFinderController = require("./controllers/scentFinderController");
  const adminController = require("./controllers/adminController");
  const orderController = require("./controllers/orderController");
  const loyaltyController = require("./controllers/loyaltyController");

  const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      return res.end();
    }

    const url = req.url;

    if (url === "/api/v1/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ status: "ok", service: "yawscent-backend", version: "1.0.0" }));
    }

    if (url === "/api/v1/products" && req.method === "GET") {
      const prods = db.getProducts();
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ status: "success", count: prods.length, data: prods }));
    }

    if (url.startsWith("/api/v1/products/") && req.method === "GET") {
      const slug = url.split("/").pop();
      const p = db.getProductBySlug(slug);
      if (p) {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ status: "success", data: p }));
      }
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ status: "error", message: "Not found" }));
    }

    if (url === "/api/v1/testimonials" && req.method === "GET") {
      const testimonials = db.getTestimonials().map(t => ({
        name: t.name,
        city: t.city,
        rating: t.rating,
        quote: t.quote,
        variant: t.product
      }));
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ status: "success", data: testimonials }));
    }

    if (url === "/api/v1/scent-finder/questions" && req.method === "GET") {
      let mockRes = { json: (data) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      }};
      return scentFinderController.getQuestions(req, mockRes);
    }

    if (url === "/api/v1/admin/stats" && req.method === "GET") {
      let mockRes = { json: (data) => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      }};
      return adminController.getDashboardStats(req, mockRes);
    }

    if (url.startsWith("/api/v1/loyalty/profile") && req.method === "GET") {
      let mockRes = {
        status: (code) => ({
          json: (data) => {
            res.writeHead(code, { "Content-Type": "application/json" });
            res.end(JSON.stringify(data));
          }
        }),
        json: (data) => {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(data));
        }
      };
      return loyaltyController.getLoyaltyProfile(req, mockRes);
    }

    // Default fallback
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      brand: "yawscent indonesia",
      message: "Omnichannel Perfume API is live with real SQL database.",
      endpoints: ["/api/v1/health", "/api/v1/products", "/api/v1/testimonials", "/api/v1/scent-finder/questions", "/api/v1/admin/stats", "/api/v1/loyalty/profile"]
    }));
  });

  server.listen(PORT, () => {
    console.log(`[YAWSCENT BACKEND] Native HTTP server running on http://localhost:${PORT}`);
  });
}
