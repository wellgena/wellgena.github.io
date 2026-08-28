# Panduan Setup — Website Pendaftaran Les Privat "Lentera Inggris"

Isi folder ini:
- `index.html` — struktur halaman
- `style.css` — tampilan/desain
- `script.js` — logika form, kirim ke Google Sheet, redirect WhatsApp
- `Code.gs` — kode backend untuk ditempel di Google Apps Script
- `images/` — taruh foto-foto Anda di sini

Ikuti 4 langkah di bawah agar website langsung berfungsi penuh.

---

## Langkah 1 — Siapkan Google Sheet sebagai database

1. Buka [Google Sheets](https://sheets.google.com), buat spreadsheet baru.
   Beri nama misalnya **"Database Pendaftaran Les Privat"**.
2. Di menu atas, klik **Extensions/Ekstensi > Apps Script**.
3. Hapus semua kode default di editor yang terbuka, lalu **copy-paste seluruh isi file `Code.gs`** (yang ada di folder ini) ke sana.
4. Klik ikon **Save (💾)**, beri nama project misalnya "Backend Pendaftaran".

## Langkah 2 — Deploy sebagai Web App

1. Masih di Apps Script, klik tombol **Deploy > New deployment**.
2. Klik ikon gerigi ⚙️ di samping "Select type", pilih **Web app**.
3. Isi konfigurasi:
   - **Execute as**: `Me (email Anda)`
   - **Who has access**: `Anyone` *(wajib "Anyone" agar website bisa mengirim data tanpa login)*
4. Klik **Deploy**. Google akan minta izin akses — klik **Authorize access**, pilih akun Anda, lalu klik **Advanced > Go to (nama project) (unsafe)** kalau muncul peringatan, lalu **Allow**. Ini normal karena scriptnya milik Anda sendiri.
5. Setelah deploy selesai, **copy URL Web App** yang muncul (bentuknya seperti `https://script.google.com/macros/s/xxxxxxxxxxxx/exec`).

## Langkah 3 — Sambungkan ke website

1. Buka file `script.js`.
2. Cari baris ini di paling atas:
   ```js
   GOOGLE_SCRIPT_URL: "PASTE_URL_GOOGLE_APPS_SCRIPT_ANDA_DI_SINI",
   ```
   Ganti dengan URL yang Anda copy di Langkah 2.
3. Cari baris:
   ```js
   WHATSAPP_NUMBER: "6281234567890",
   ```
   Ganti dengan nomor WhatsApp Anda dalam format internasional **tanpa tanda `+` dan tanpa angka `0` di depan**.
   Contoh: nomor `0812-3456-7890` ditulis menjadi `6281234567890`.
4. Buka `index.html`, cari baris berikut lalu ganti dengan nomor yang sama (untuk tombol WhatsApp mengambang):
   ```html
   <a class="wa-float" href="https://wa.me/62812XXXXXXX" ...>
   ```

Setiap kali ada yang mengisi & mengirim formulir, data otomatis masuk sebagai baris baru di Google Sheet Anda, lengkap dengan waktu submit.

## Langkah 4 — Ganti foto & teks

1. Masukkan foto Anda ke folder `images/` dengan nama:
   - `foto-hero.jpg` — foto besar di bagian atas (hero)
   - `foto-profil.jpg` — foto Anda di bagian "Tentang"
   - `galeri-1.jpg`, `galeri-2.jpg`, `galeri-3.jpg`, `galeri-4.jpg` — foto galeri kegiatan
   
   *(Selama foto belum ada, website tetap tampil rapi dengan gambar placeholder otomatis.)*
2. Buka `index.html` dengan text editor apa saja, lalu cari dan ganti teks dalam tanda kurung siku, misalnya:
   - `[Nama Anda]`, `[X] tahun`, `[Nomor Anda]`, `[email@anda.com]`, `[@akun_anda]`, `Rp[XXX]`
3. Testimoni di bagian "Kata Mereka" masih contoh — ganti dengan testimoni asli murid Anda (dengan izin mereka).

---

## Cara menjalankan / mempublikasikan website

**Untuk sekadar mencoba di komputer sendiri:**
Klik dua kali file `index.html`, akan terbuka di browser.

**Untuk online agar bisa dibagikan ke calon murid**, cara termudah gratis:
1. Buat akun di [Netlify](https://www.netlify.com) atau [Vercel](https://vercel.com).
2. Drag & drop seluruh folder ini (yang berisi `index.html`, `style.css`, `script.js`, `images/`) ke dashboard mereka.
3. Anda akan mendapat link publik, misalnya `https://lentera-inggris.netlify.app`, yang bisa dibagikan lewat Instagram, WhatsApp, dsb.

---

## Troubleshooting

- **Data tidak masuk ke Google Sheet**: pastikan langkah "Who has access" di deployment memang `Anyone`, dan URL di `script.js` sudah benar (harus diakhiri `/exec`, bukan `/dev`).
- **Kalau Anda mengubah kode `Code.gs`**: Anda perlu **Deploy > Manage deployments > Edit (ikon pensil) > New version > Deploy** lagi supaya perubahan berlaku.
- **Nomor WhatsApp tidak terbuka dengan benar**: pastikan formatnya angka saja tanpa spasi/strip/plus, contoh benar: `6281234567890`.
