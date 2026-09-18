const db = require("../data/database");
const midtransService = require("../services/midtransService");
const biteshipService = require("../services/biteshipService");
const redisService = require("../services/redisService");

exports.checkout = async (req, res) => {
  try {
    const {
      channel = "ONLINE_WEB",
      customerName,
      phoneNumber,
      email,
      shippingAddress,
      city,
      items, // [{ variantId, quantity }]
      voucherCode,
      courierCode = "jnt",
      paymentMethod = "QRIS"
    } = req.body;

    if (!items || items.length === 0 || !customerName || !phoneNumber) {
      return res.status(400).json({ status: "error", message: "Data pesanan tidak lengkap" });
    }

    const allProducts = db.getProducts();

    // 1. Validasi & Kunci Stok per varian
    let calculatedItems = [];
    let subtotal = 0;

    for (const item of items) {
      let foundProduct = null;
      let foundVariant = null;

      for (const prod of allProducts) {
        const v = prod.variants.find(varItem => varItem.id === item.variantId || varItem.sku === item.sku);
        if (v) {
          foundProduct = prod;
          foundVariant = v;
          break;
        }
      }

      if (!foundVariant) {
        return res.status(400).json({ status: "error", message: `Varian ${item.variantId || item.sku} tidak ditemukan` });
      }

      const availableStock = channel === "OFFLINE_STORE_POS" ? foundVariant.stockStore : foundVariant.stockOnline;
      if (availableStock < item.quantity) {
        return res.status(400).json({
          status: "error",
          message: `Stok ${foundProduct.name} (${foundVariant.sizeMl}ml) tidak mencukupi. Sisa: ${availableStock}`
        });
      }

      await redisService.acquireStockLock(foundVariant.sku, item.quantity);

      const price = foundVariant.discountPrice || foundVariant.price;
      const totalItemPrice = price * item.quantity;
      subtotal += totalItemPrice;

      calculatedItems.push({
        productId: foundProduct.id,
        variantId: foundVariant.id,
        productName: foundProduct.name,
        name: `${foundProduct.name} ${foundVariant.sizeMl}ml`,
        sku: foundVariant.sku,
        sizeMl: foundVariant.sizeMl,
        quantity: item.quantity,
        price,
        unitPrice: price,
        totalPrice: totalItemPrice,
        totalItemPrice
      });
    }

    // 2. Hitung Diskon Voucher
    let discountAmount = 0;
    if (voucherCode) {
      const v = db.getVoucherByCode(voucherCode);
      if (v && subtotal >= v.min_spend) {
        if (v.discount_type === "PERCENTAGE") {
          discountAmount = Math.min((subtotal * v.discount_value) / 100, v.max_discount || 999999);
        } else {
          discountAmount = v.discount_value;
        }
      }
    }

    // 3. Hitung Ongkir via Biteship Service
    const shippingRates = await biteshipService.calculateShippingRates({ destinationCity: city });
    const selectedCourier = shippingRates.find(c => c.courierCode === courierCode) || shippingRates[0];
    const shippingCost = selectedCourier.cost;

    // 4. Hitung Total & Poin
    const totalAmount = Math.max(0, subtotal - discountAmount) + shippingCost;
    const pointsEarned = Math.floor(totalAmount / 1000);

    // 5. Release locks
    for (const calcItem of calculatedItems) {
      await redisService.releaseStockLock(calcItem.sku);
    }

    // 6. Generate Midtrans Snap
    const orderNumber = `YS-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(1000 + Math.random() * 9000)}`;
    const midtransRes = await midtransService.createSnapTransaction({
      orderNumber,
      grossAmount: totalAmount,
      customerDetails: { fullName: customerName, phoneNumber, email },
      items: calculatedItems
    });

    // 7. Simpan permanen ke SQL Database
    const newOrder = db.createOrder({
      orderNumber,
      customerName,
      phoneNumber,
      email,
      shippingAddress: shippingAddress || "Alamat demo pelanggan",
      city: city || "Jakarta Selatan",
      channel,
      status: "PAID",
      subtotal,
      shippingCost,
      discountAmount,
      totalAmount,
      pointsEarned,
      courierCode: selectedCourier.courierCode,
      courierService: selectedCourier.service,
      paymentMethod,
      paymentTxId: midtransRes.token || `tx-${Date.now()}`,
      items: calculatedItems
    });

    res.status(201).json({
      status: "success",
      message: "Pesanan berhasil dibuat & tersimpan permanen di database SQL",
      data: newOrder
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getOrders = (req, res) => {
  try {
    const orders = db.getOrders(50);
    res.json({
      status: "success",
      count: orders.length,
      data: orders
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
