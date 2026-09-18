# yawscent indonesia — Haute Parfumerie & Omnichannel Platform

Sistem platform digital terintegrasi untuk brand parfum lokal modern **yawscent indonesia**.

---

## 🌟 Fitur Utama Platform

1. **Frontend Web (Landing Page, Scent Finder & Admin Dashboard)**:
   - **Desain Luxury Haute Parfumerie**: Palet warna *Obsidian Black* (#0B0C0E) dengan aksen *Champagne Gold* (#D4AF37), tipografi serif klasik (*Cinzel*), dan tata letak responsif.
   - **Interactive Scent Finder Quiz**: Kuis interaktif 3-langkah untuk mencocokkan karakter aroma (*woody smoky, fresh citrus, atau discovery*) dengan algoritma scoring akurat anti *blind-buy*.
   - **Visualisasi Anatomi Aroma (Notes Pyramid)**: Top Notes, Heart Notes, dan Base Notes dengan indikator ketahanan (8–12 Jam) dan sillage.
   - **Cart & Quick Checkout Omnichannel**: Perhitungan ongkir real-time (Biteship simulation), metode pembayaran Midtrans (QRIS, VA BCA, Mandiri), dan kode voucher promo (`YAWWELCOME`).
   - **Admin Omnichannel Dashboard**: Kontrol stok real-time antara penjualan online (Web/App) dan toko fisik (POS), metrik omset penjualan, dan pelacakan resi pesanan.
   - **VIP Loyalty Club**: Digital wallet poin belanja, tier membership (Bronze, Silver, Gold VIP), serta katalog penukaran hadiah.

2. **Backend REST API Engine (`backend/`)**:
   - **Arsitektur**: Node.js & Express dengan fallback native HTTP.
   - **Database**: PostgreSQL Prisma Schema (`backend/prisma/schema.prisma`) mencakup relasi `Product`, `ProductVariant`, `ProductNote`, `Order`, `OrderItem`, `User`, `LoyaltyWallet`, dan `Voucher`.
   - **Integrasi Payment Gateway**: Service Midtrans Snap Token & webhook verification signature.
   - **Integrasi Logistik**: Service Biteship & RajaOngkir untuk perhitungan ongkir kurir J&T, SiCepat, Anteraja.
   - **Redis Caching & Lock**: Atomic stock lock untuk mencegah *overselling* saat flash sale atau lonjakan transaksi multi-channel.

3. **Mobile App Flutter (`mobile_flutter/`)**:
   - **State Management**: BLoC Pattern (`flutter_bloc` & `equatable`).
   - **Screens**: Home, Scent Finder Quiz, Product Detail, VIP Loyalty Card, dan Cart Checkout.
   - **Theme**: Obsidian Dark & Champagne Gold styling.

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Menjalankan Server Web & API
Pada direktori root atau direktori `web/`, jalankan:
```bash
node web/server.js
```
Akses web aplikasi di peramban (browser):
👉 **http://localhost:3000**

- **Landing Page & Storefront**: `http://localhost:3000`
- **Scent Finder Quiz**: Klik tombol *"✨ Ikuti Scent Finder"*
- **Admin Dashboard**: Klik tombol *"⚙️ Admin Omnichannel"* di pojok kanan atas navbar
- **VIP Loyalty Club**: Klik link *"VIP Club & Poin"* di navbar

### 2. Menjalankan Backend Standalone (Opsional)
```bash
cd backend
node src/server.js
```
Endpoint API tersedia di:
- `GET http://localhost:5000/api/v1/health`
- `GET http://localhost:5000/api/v1/products`
- `GET http://localhost:5000/api/v1/admin/stats`

---

## 📂 Struktur Direktori Proyek

```
yawscan/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Skema PostgreSQL Prisma
│   ├── src/
│   │   ├── controllers/          # Product, Scent Finder, Order, Loyalty, Admin
│   │   ├── services/             # Midtrans, Biteship, Redis Locks
│   │   ├── data/                 # Relational SQL Database (SQLite yawscent.db)
│   │   ├── routes/               # API endpoints
│   │   └── server.js             # Express & Native API Server
│   └── package.json
├── web/
│   ├── public/
│   │   ├── index.html            # Luxury Storefront, Testimonials & Admin UI
│   │   ├── styles.css            # Obsidian & Gold Design System + Mobile Bottom Sheets
│   │   ├── app.js                # Scent Finder, Cart, Checkout, Admin, Countdown, Skeleton
│   │   └── images/               # Product photography (noir, santara, discovery, etc.)
│   ├── server.js                 # Standalone Unified Web & API Server (Real SQL)
│   └── package.json
├── mobile_flutter/
│   ├── lib/
│   │   ├── blocs/                # ScentFinderBloc, CartBloc
│   │   ├── models/               # ProductModel, LoyaltyModel
│   │   ├── views/                # HomeScreen, ScentFinderScreen
│   │   ├── theme/                # AppTheme (Dark & Gold)
│   │   └── main.dart             # Flutter Entrypoint
│   └── pubspec.yaml
├── jalankan_yawscent.bat         # 🚀 Launcher 1-klik Server Web Lokal
├── jalankan_hp_dan_online.bat    # 🌐 Launcher Akses HP & Internet (Cloudflare Tunnel)
├── jalankan_online_gratis.bat    # 🌐 Launcher Publikasi Online Bebas Biaya
└── jalankan_android.bat          # 📱 Launcher Android (MuMu Player / Flutter)
```

---

## 📱 Panduan Menjalankan Android

Untuk menjalankan aplikasi di Android:

1. **Jalankan via Script Otomatis**:
   Cukup klik ganda file:
   👉 `jalankan_android.bat`
   Script ini otomatis menyalakan server lokal yawscent, mendeteksi emulator Android (MuMu Player), dan memeriksa ketersediaan Flutter SDK.

2. **Akses Tampilan Mobile di MuMu Player / Smartphone**:
   - Jalankan `jalankan_hp_dan_online.bat` untuk mendapatkan link publik HTTPS Cloudflare gratis.
   - Buka browser di MuMu Player atau smartphone Anda dan buka link tersebut.
   - Antarmuka web yawscent dirancang responsive 100% mobile-friendly dengan hamburger menu, bottom sheet checkout, dan floating WhatsApp concierge.

3. **Menjalankan Native Flutter (Pengembang)**:
   ```bash
   cd mobile_flutter
   flutter pub get
   flutter run
   ```
