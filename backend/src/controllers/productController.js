const db = require("../data/database");

exports.getProducts = (req, res) => {
  try {
    const { character, gender } = req.query;
    const products = db.getProducts({ character, gender });

    res.json({
      status: "success",
      count: products.length,
      data: products
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getProductBySlug = (req, res) => {
  try {
    const { slug } = req.params;
    const product = db.getProductBySlug(slug);

    if (!product) {
      return res.status(404).json({ status: "error", message: "Parfum tidak ditemukan" });
    }

    res.json({
      status: "success",
      data: product
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
