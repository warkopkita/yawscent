const db = require("../data/database");

exports.getDashboardStats = (req, res) => {
  try {
    const stats = db.getDashboardStats();
    res.json({
      status: "success",
      data: stats
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.updateStock = (req, res) => {
  try {
    const { sku, stockOnline, stockStore } = req.body;
    if (!sku) {
      return res.status(400).json({ status: "error", message: "SKU wajib diisi" });
    }

    db.updateStock(sku, stockOnline, stockStore);

    res.json({
      status: "success",
      message: `Stok untuk SKU ${sku} berhasil diperbarui permanen di database SQL`
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.updateOrderStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    db.updateOrderStatus(id, status, trackingNumber);

    res.json({
      status: "success",
      message: "Status pesanan berhasil diupdate permanen di database SQL"
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
