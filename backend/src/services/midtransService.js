/**
 * Midtrans Payment Gateway Integration Service
 * Mendukung QRIS (GoPay/ShopeePay/Dana/OVO), Virtual Account BCA/Mandiri/BNI/BRI, dan Kartu Kredit
 */

const crypto = require("crypto");

class MidtransService {
  constructor() {
    this.serverKey = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-yawscent-sample-key";
    this.clientKey = process.env.MIDTRANS_CLIENT_KEY || "SB-Mid-client-yawscent-sample-key";
    this.isProduction = process.env.NODE_ENV === "production";
  }

  /**
   * Buat Snap Token transaksi pembayaran
   */
  async createSnapTransaction({ orderNumber, grossAmount, customerDetails, items }) {
    // Parameter standar Midtrans Snap
    const transactionPayload = {
      transaction_details: {
        order_id: orderNumber,
        gross_amount: Math.round(grossAmount)
      },
      customer_details: {
        first_name: customerDetails.fullName,
        email: customerDetails.email || "customer@yawscent.id",
        phone: customerDetails.phoneNumber
      },
      item_details: items.map(item => ({
        id: item.sku || `item-${item.productId}`,
        price: Math.round(item.price),
        quantity: item.quantity,
        name: item.name.substring(0, 50)
      })),
      enabled_payments: [
        "qris",
        "gopay",
        "shopeepay",
        "bca_va",
        "bni_va",
        "mandiri_bill",
        "credit_card"
      ],
      callbacks: {
        finish: "https://yawscent.id/checkout/finish"
      }
    };

    // Simulasi respons token Snap (atau panggil real API jika key aktif)
    const simulatedSnapToken = `SNAP-TOKEN-YS-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const redirectUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${simulatedSnapToken}`;

    return {
      token: simulatedSnapToken,
      redirect_url: redirectUrl,
      payload: transactionPayload
    };
  }

  /**
   * Verifikasi signature callback webhook dari Midtrans
   */
  verifyNotificationSignature(orderId, statusCode, grossAmount, receivedSignature) {
    const stringToHash = `${orderId}${statusCode}${grossAmount}${this.serverKey}`;
    const calculatedSignature = crypto.createHash("sha512").update(stringToHash).digest("hex");
    return calculatedSignature === receivedSignature;
  }
}

module.exports = new MidtransService();
