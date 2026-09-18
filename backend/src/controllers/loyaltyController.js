const db = require("../data/database");

exports.getLoyaltyProfile = (req, res) => {
  try {
    const userId = req.query.userId || "user-001";
    const profile = db.getLoyaltyProfile(userId);

    if (!profile) {
      return res.status(404).json({ status: "error", message: "Profil loyalty tidak ditemukan" });
    }

    res.json({
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
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.redeemReward = (req, res) => {
  try {
    const { rewardId, cost: inputCost, title, userId = "user-001" } = req.body;

    const rewardCosts = {
      "rew-1": 250,
      "rew-2": 500,
      "rew-3": 1200
    };

    const cost = inputCost || rewardCosts[rewardId] || 250;
    const desc = title ? `Penukaran Reward: ${title}` : "Penukaran Reward VIP Poin";

    const result = db.redeemPoints(userId, cost, desc);

    res.json({
      status: "success",
      message: "Reward berhasil ditukarkan & poin terpotong permanen di database SQL!",
      remainingPoints: result.remainingPoints,
      voucherCode: result.voucherCode
    });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};
