# 🐳 Panduan Lengkap Docker & Hosting Deployment — yawscent indonesia

Dokumentasi ini mencakup instruksi langkah-demi-langkah untuk menjalankan platform **yawscent indonesia** menggunakan Docker untuk keperluan **Development lokal**, **Pengujian Produksi**, hingga **Hosting di VPS / Cloud Server**.

---

## 🏗️ Arsitektur Kontainer

Stack Docker yawscent terdiri dari 4 layanan utama yang saling terisolasi dalam jaringan internal `yawscent-net`:

| Layanan | Image Base | Port Internal | Port Host | Fungsi |
| :--- | :--- | :--- | :--- | :--- |
| **`web`** | `node:20-alpine` | 3000 | `3000` | Web Storefront, Scent Finder, Admin UI & API Proxy |
| **`backend`** | `node:20-alpine` | 5000 | `5000` | REST API Engine, Midtrans, Biteship, Prisma |
| **`postgres`** | `postgres:16-alpine` | 5432 | `5432` | Database PostgreSQL dengan volume persisten |
| **`redis`** | `redis:7-alpine` | 6379 | `6379` | Cache cepat & Atomic lock stok multi-channel |

---

## ⚡ 1. Menjalankan di Komputer Lokal

### A. Mode Produksi / Uji Coba Hosting
Cukup klik dua kali file:
```bash
docker-deploy.bat
```
Atau melalui terminal (PowerShell / Command Prompt / Terminal):
```bash
# Build dan jalankan seluruh container di background (-d)
docker compose up -d --build
```
Akses di browser:
- **Storefront & Scent Finder**: 👉 [http://localhost:3000](http://localhost:3000)
- **Admin Omnichannel**: Klik menu "Admin" di pojok kanan atas website
- **API Healthcheck**: [http://localhost:3000/api/v1/health](http://localhost:3000/api/v1/health)

### B. Mode Development (Hot-Reload)
Jika Anda sedang mengedit source code di `web/` atau `backend/` dan ingin perubahannya langsung aktif tanpa build ulang:
```bash
docker-dev.bat
# atau via CLI:
docker compose -f docker-compose.dev.yml up --build
```

### C. Menghentikan Kontainer
Cukup klik dua kali:
```bash
docker-down.bat
# atau via CLI:
docker compose down
```

---

## 🌐 2. Panduan Hosting di VPS (Ubuntu / Debian / AWS / DigitalOcean)

### Langkah 1: Siapkan Server VPS & Install Docker
Buka terminal SSH ke VPS Anda:
```bash
ssh root@IP_VPS_ANDA
```
Install Docker dan Docker Compose plugin (Ubuntu/Debian):
```bash
# Update package
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker otomatis via script resmi
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Verifikasi instalasi
docker --version
docker compose version
```

### Langkah 2: Unggah / Clone Project ke Server
```bash
# Opsi Git:
git clone https://github.com/USERNAME/yawscan.git /var/www/yawscent
cd /var/www/yawscent

# Atau copy folder via SCP/rsync dari komputer lokal:
# scp -r C:/Users/moham/Downloads/yawscan root@IP_VPS_ANDA:/var/www/yawscent
```

### Langkah 3: Konfigurasi Environment File (.env)
```bash
cp .env.example .env
nano .env
```
Sesuaikan:
- `POSTGRES_PASSWORD`: Buat password yang kuat.
- `DATABASE_URL`: Sesuaikan password yang sama dengan di atas.
- `MIDTRANS_SERVER_KEY`: Kunci production Midtrans Anda jika sudah live.

### Langkah 4: Jalankan Kontainer
```bash
chmod +x docker-deploy.sh
./docker-deploy.sh
```
Platform yawscent kini sudah aktif dan otomatis menyala kembali jika server reboot (`restart: unless-stopped`).

---

## 🔒 3. Menghubungkan Domain & SSL (HTTPS)

### Pilihan A: Menggunakan Cloudflare Tunnel (Paling Cepat & 100% Gratis)
Tidak perlu buka port firewall / IP publik statis:
1. Install `cloudflared` di VPS:
   ```bash
   curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
   sudo dpkg -i cloudflared.deb
   ```
2. Hubungkan domain Anda langsung ke port lokal:
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```
3. Domain Anda otomatis memiliki sertifikat SSL HTTPS aktif!

### Pilihan B: Reverse Proxy Nginx & Certbot SSL
Jika Anda ingin memasang Nginx langsung di VPS untuk domain `yawscent.id`:
```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```
Buat konfigurasi di `/etc/nginx/sites-available/yawscent`:
```nginx
server {
    server_name yawscent.id www.yawscent.id;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```
Aktifkan dan pasang SSL gratis Let's Encrypt:
```bash
sudo ln -s /etc/nginx/sites-available/yawscent /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d yawscent.id -d www.yawscent.id
```

---

## 🚀 4. Deploy via Platform Modern (Coolify / Portainer)

Platform yawscent kompatibel penuh dengan panel manajemen Docker web seperti **Coolify**, **Portainer**, atau **Dokku**:
1. Di panel Coolify / Portainer, pilih **Add New Application -> Docker Compose**.
2. Masukkan repositori Git proyek ini.
3. Tentukan file compose: `docker-compose.yml`.
4. Isi environment variables sesuai file `.env.example`.
5. Klik **Deploy**!

---

## 🛠️ Perintah Berguna (Maintenance)

| Perintah | Deskripsi |
| :--- | :--- |
| `docker compose ps` | Melihat status kesehatan semua kontainer |
| `docker compose logs -f` | Melihat live log output dari seluruh layanan |
| `docker compose logs -f web` | Melihat log khusus service web |
| `docker compose logs -f backend` | Melihat log khusus backend API |
| `docker compose restart` | Restart seluruh layanan tanpa hapus data |
| `docker compose down -v` | ⚠️ Hentikan dan hapus volume database (reset data) |
