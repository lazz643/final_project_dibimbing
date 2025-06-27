# TravelJoy - Travel & Tourism Booking Platform

TravelJoy adalah platform booking travel dan tourism yang memungkinkan pengguna untuk menjelajahi, memesan, dan mengelola aktivitas wisata dengan mudah. Platform ini dibangun menggunakan React.js dengan antarmuka yang modern dan responsif.

## 🚀 Fitur Utama

### Untuk Pengguna

- **Autentikasi Pengguna**: Login dan registrasi dengan JWT token
- **Katalog Aktivitas**: Jelajahi berbagai aktivitas wisata dengan filter kategori
- **Sistem Promo**: Dapatkan diskon menarik untuk berbagai aktivitas
- **Keranjang Belanja**: Tambahkan aktivitas ke keranjang sebelum checkout
- **Manajemen Transaksi**: Lihat riwayat pemesanan dan status pembayaran
- **Pembatalan Transaksi**: Batalkan transaksi yang masih pending
- **Profil Pengguna**: Kelola informasi pribadi dan foto profil
- **Pencarian**: Cari aktivitas berdasarkan nama atau lokasi

### Untuk Admin

- **Dashboard Admin**: Panel kontrol untuk mengelola seluruh platform
- **Manajemen Pengguna**: Kelola data pengguna dan hak akses
- **Manajemen Aktivitas**: CRUD operasi untuk aktivitas wisata
- **Manajemen Kategori**: Organisasi aktivitas berdasarkan kategori
- **Manajemen Promo**: Buat dan kelola kode promo dan diskon
- **Manajemen Banner**: Kelola banner promosi di halaman utama
- **Manajemen Pesanan**: Monitor dan kelola semua transaksi

## 🛠️ Teknologi yang Digunakan

- **Frontend Framework**: React.js 19.1.0
- **Build Tool**: Vite 6.3.5
- **Routing**: React Router Dom 7.6.0
- **HTTP Client**: Axios 1.9.0
- **Styling**: Tailwind CSS 4.1.5
- **Icons**: React Icons 5.5.0
- **State Management**: React Hooks (useState, useEffect, useContext)

## 🚀 Instalasi dan Menjalankan Aplikasi

### Langkah Instalasi

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Jalankan aplikasi dalam mode development**

   ```bash
   npm run dev
   ```

3. **Build untuk production**

   ```bash
   npm run build
   ```

4. **Preview build production**
   ```bash
   npm run preview
   ```

## 🔧 Konfigurasi API

Aplikasi ini menggunakan API dari `https://travel-journal-api-bootcamp.do.dibimbing.id` dengan API Key: `24405e01-fbc1-45a5-9f5a-be13afcd757c`

### Endpoint Utama:

- **Authentication**: `/api/v1/login`, `/api/v1/register`
- **Activities**: `/api/v1/activities`
- **Categories**: `/api/v1/categories`
- **Promos**: `/api/v1/promos`
- **Banners**: `/api/v1/banners`
- **Cart**: `/api/v1/carts`
- **Transactions**: `/api/v1/transactions`
- **User Profile**: `/api/v1/user`

**TravelJoy** - Menjelajahi dunia dengan mudah dan menyenangkan! 🌍✈️
