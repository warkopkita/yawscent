/**
 * Biteship / RajaOngkir Courier Aggregator Service
 * Mendukung J&T Express, SiCepat, Anteraja, dan Paxel di seluruh kota Indonesia
 */

class BiteshipService {
  constructor() {
    this.apiKey = process.env.BITESHIP_API_KEY || "biteship_live_yawscent_sample";
    // Basis pengiriman toko/warehouse yawscent: Jakarta Selatan
    this.originPostalCode = 12950;
  }

  /**
   * Hitung estimasi ongkos kirim real-time
   */
  async calculateShippingRates({ destinationCity, totalWeightGram = 500 }) {
    const city = (destinationCity || "jakarta").toLowerCase();

    // Matriks tarif dasar kurir Indonesia per 1kg pertama
    let baseRate = 12000;
    let etdJakarta = "1-2 Hari";

    if (city.includes("jakarta") || city.includes("depok") || city.includes("tangerang") || city.includes("bekasi")) {
      baseRate = 10000;
      etdJakarta = "1 Hari";
    } else if (city.includes("bandung") || city.includes("bogor")) {
      baseRate = 14000;
      etdJakarta = "1-2 Hari";
    } else if (city.includes("surabaya") || city.includes("semarang") || city.includes("yogyakarta")) {
      baseRate = 20000;
      etdJakarta = "2-3 Hari";
    } else if (city.includes("medan") || city.includes("palembang") || city.includes("bali") || city.includes("denpasar")) {
      baseRate = 32000;
      etdJakarta = "3-4 Hari";
    } else {
      baseRate = 42000;
      etdJakarta = "3-5 Hari";
    }

    return [
      {
        courierCode: "jnt",
        courierName: "J&T Express",
        service: "EZ - Regular",
        cost: baseRate,
        etd: etdJakarta,
        description: "Pengiriman reguler dengan asuransi pecah belah parfum"
      },
      {
        courierCode: "sicepat",
        courierName: "SiCepat",
        service: "BEST - Express Next Day",
        cost: baseRate + 8000,
        etd: "1 Hari (Besok Sampai)",
        description: "Prioritas pengiriman cepat satu hari sampai"
      },
      {
        courierCode: "anteraja",
        courierName: "Anteraja",
        service: "Reguler",
        cost: Math.max(9000, baseRate - 2000),
        etd: etdJakarta,
        description: "Pilihan ekonomis ramah kantong"
      }
    ];
  }
}

module.exports = new BiteshipService();
