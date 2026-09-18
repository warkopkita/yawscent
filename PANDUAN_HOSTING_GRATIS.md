# PANDUAN DEPLOY WEB HOSTING GRATIS 100% (RENDER.COM)
### YAWSCENT INDONESIA — HAUTE PARFUMERIE

Panduan ini memungkinkan website Yawscent Anda aktif **24 jam nonstop di internet secara GRATIS** tanpa harus menyalakan laptop, tanpa membuka Docker, dan tanpa Cloudflare Tunnel. Anda dan pelanggan dapat membukanya langsung dari browser HP kapan saja!

---

## 🌟 Mengapa Render.com?
- **100% Gratis** (Free Web Service Plan).
- **Gratis Sertifikat Keamanan HTTPS (SSL)** resmi.
- Mendukung **Node.js** dan database **SQLite** secara langsung.
- Mendapatkan tautan domain permanen, contoh: `https://yawscent-indonesia.onrender.com`.

---

## 📋 LANGKAH-LANGKAH DEPLOY (5 MENIT):

### Langkah 1: Upload File Proyek ke GitHub (Lewat Browser Web)
*(Anda tidak perlu menginstal aplikasi Git di laptop)*

1. Buka [https://github.com](https://github.com) dan buat akun (atau Login jika sudah punya).
2. Di pojok kanan atas, klik tanda **`+`** lalu pilih **`New repository`**.
3. Beri nama repository: **`yawscent`**.
4. Pilih opsi **Public**, lalu klik tombol hijau **`Create repository`**.
5. Pada halaman baru yang muncul, klik tautan:  
   👉 **`uploading an existing file`**.
6. Tarik (*drag & drop*) file-file proyek dari folder `yawscan` laptop Anda ke halaman browser GitHub:
   - Folder `web`
   - Folder `backend`
   - File `package.json`
   - File `render.yaml`
7. Klik tombol hijau **`Commit changes`** di bagian bawah. Selesai!

---

### Langkah 2: Hubungkan ke Render.com (1-Klik Deploy)

1. Buka [https://render.com](https://render.com) dan klik tombol **`Get Started for Free`** (atau Sign In).
2. Pilih **`Continue with GitHub`** agar otomatis terhubung dengan akun GitHub Anda.
3. Di Dashboard Render, klik tombol **`New +`** (di kanan atas) lalu pilih **`Web Service`**.
4. Pilih repository **`yawscent`** yang tadi Anda buat, lalu klik **`Connect`**.
5. Masukkan pengaturan berikut (tinggal salin-tempel):

| Kolom Pengaturan | Teks yang Harus Diisi / Dipilih |
| :--- | :--- |
| **Name** | `yawscent-indonesia` *(atau nama brand Anda)* |
| **Region** | `Singapore` *(paling cepat untuk pengguna Indonesia)* |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node web/server.js` |
| **Instance Type / Plan** | **Free ($0/mo)** |

6. Di bagian bawah, klik tombol **`Create Web Service`**.

---

### Langkah 3: Selesai & Buka di HP!

- Render akan memproses instalasi selama sekitar 1-2 menit.
- Begitu status berubah menjadi **`Live`** berwarna hijau, Anda akan mendapatkan URL resmi seperti:  
  👉 **`https://yawscent-indonesia.onrender.com`**
- Halaman Login:  
  👉 **`https://yawscent-indonesia.onrender.com/login`**

Sekarang Anda bisa **mematikan laptop Anda**, dan website serta halaman login tetap bisa dibuka dari HP kapan saja!
