const db = require("../data/database");

const quizQuestions = [
  {
    id: "q1_vibe",
    question: "Aroma seperti apa yang paling mendeskripsikan kepribadianmu?",
    options: [
      { key: "bold_mysterious", label: "Misterius, Elegan, Berkarakter Kuat", accord: "woody_smoky" },
      { key: "fresh_energetic", label: "Segar, Bersih, Penuh Energi & Ceria", accord: "citrus_fresh" },
      { key: "cozy_warm", label: "Hangat, Manis Lembut, Intim & Memikat (Vanilla & Coffee)", accord: "gourmand_amber" },
      { key: "regal_oud", label: "Kemewahan Ningrat & Mawar Spiced Oud", accord: "rose_oud" },
      { key: "adventurous", label: "Ingin mencoba seluruh spektrum aroma yawscent", accord: "discovery" }
    ]
  },
  {
    id: "q2_occasion",
    question: "Kapan waktu penggunaan parfum utama kamu?",
    options: [
      { key: "evening_date", label: "Kencan Malam Hari, Gala & Acara Formal", accord: "woody_smoky" },
      { key: "daily_work", label: "Aktivitas Kantor, Kuliah & Outdoor Siang Hari", accord: "citrus_fresh" },
      { key: "casual_cafe", label: "Nongkrong Santai di Coffee Shop / Cozy Indoor", accord: "gourmand_amber" },
      { key: "royal_event", label: "Pernikahan, Jamuan Formal & Resepsi Mewah", accord: "rose_oud" },
      { key: "anywhere", label: "Berpindah-pindah fleksibel sesuai mood", accord: "discovery" }
    ]
  },
  {
    id: "q3_intensity",
    question: "Berapa lama ketahanan aroma yang kamu harapkan?",
    options: [
      { key: "ultra_long", label: "10-14 Jam (Extrait de Parfum / Proyeksi Tebal)", accord: "woody_smoky" },
      { key: "moderate", label: "6-8 Jam (Aroma Segar & Bersih Tidak Bikin Pusing)", accord: "citrus_fresh" },
      { key: "balanced", label: "8-10 Jam (Manis Menempel Sensual di Kulit & Pakaian)", accord: "gourmand_amber" },
      { key: "flexible", label: "Membawa botol praktis untuk re-spray kapan saja", accord: "discovery" }
    ]
  }
];

exports.getQuestions = (req, res) => {
  res.json({
    status: "success",
    data: quizQuestions
  });
};

exports.recommend = (req, res) => {
  const { answers } = req.body;

  if (!answers) {
    return res.status(400).json({ status: "error", message: "Jawaban kuis dibutuhkan" });
  }

  // Hitung kecocokan accord
  let scores = {
    noir: 0,
    santara: 0,
    discovery: 0,
    velvet: 0,
    bali: 0
  };

  Object.values(answers).forEach(ans => {
    if (ans === "bold_mysterious" || ans === "evening_date" || ans === "ultra_long") {
      scores.noir += 3;
    } else if (ans === "fresh_energetic" || ans === "daily_work" || ans === "moderate") {
      scores.santara += 3;
    } else if (ans === "cozy_warm" || ans === "casual_cafe" || ans === "balanced") {
      scores.bali += 3;
    } else if (ans === "regal_oud" || ans === "royal_event") {
      scores.velvet += 3;
    } else if (ans === "adventurous" || ans === "anywhere" || ans === "flexible") {
      scores.discovery += 4;
    } else {
      scores.noir += 1;
      scores.santara += 1;
    }
  });

  // Tentukan produk pemenang
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

  const matchedProduct = db.getProductBySlug(recommendedSlug) || db.getProducts()[0];

  res.json({
    status: "success",
    recommendedProduct: matchedProduct,
    matchReason: matchReason,
    matchPercentage: 98,
    scores
  });
};
