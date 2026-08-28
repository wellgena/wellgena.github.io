/* ============================================================
   KONFIGURASI — WAJIB DIISI SEBELUM WEBSITE DIPAKAI
   ============================================================ */
const CONFIG = {
  // 1) Tempel URL Web App dari Google Apps Script Anda di sini.
  //    Cara mendapatkannya ada di file README.md.
  GOOGLE_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbwTvF4XawZsiqEwh-uSEmnfmw9wsOxpG7wkwQlT_WMpRBngvX29bBX8Cmk7o1vNe4-Z/exec",

  // 2) Nomor WhatsApp Anda, format internasional TANPA "+" dan TANPA angka 0 di depan.
  //    Contoh: 0812-3456-7890 -> ditulis 6281234567890
  WHATSAPP_NUMBER: "6282147150537",
};

/* ============================================================ */

document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("registrationForm");
const submitBtn = document.getElementById("submitBtn");
const statusEl = document.getElementById("formStatus");

function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = "form-status" + (type ? " " + type : "");
}

function buildWhatsAppMessage(data) {
  const lines = [
    "Halo, saya ingin mendaftar les privat bahasa Inggris:",
    "",
    `Nama: ${data.nama}`,
    `No. WhatsApp: ${data.whatsapp}`,
    data.usia ? `Usia: ${data.usia}` : null,
    data.email ? `Email: ${data.email}` : null,
    `Level: ${data.level}`,
    data.jadwal ? `Preferensi jadwal: ${data.jadwal}` : null,
    data.tujuan ? `Tujuan belajar: ${data.tujuan}` : null,
    "",
    "Mohon info jadwal selanjutnya ya. Terima kasih!",
  ].filter(Boolean);

  return lines.join("\n");
}

async function saveToGoogleSheet(data) {
  // Menggunakan mode "no-cors" + Content-Type text/plain agar tidak kena
  // preflight CORS (keterbatasan umum Google Apps Script Web App).
  // Konsekuensinya: kita tidak bisa membaca isi respons di sini,
  // jadi kita anggap terkirim selama tidak ada network error.
  await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(data),
  });
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  setStatus("", "");

  const data = {
    nama: form.nama.value.trim(),
    whatsapp: form.whatsapp.value.trim(),
    usia: form.usia.value.trim(),
    email: form.email.value.trim(),
    level: form.level.value,
    jadwal: form.jadwal.value,
    tujuan: form.tujuan.value.trim(),
    waktu_daftar: new Date().toLocaleString("id-ID"),
  };

  // Validasi sederhana
  if (!data.nama || !data.whatsapp || !data.level) {
    setStatus("Mohon lengkapi Nama, No. WhatsApp, dan Level terlebih dahulu.", "error");
    return;
  }
  const waDigitsOnly = data.whatsapp.replace(/[^0-9]/g, "");
  if (waDigitsOnly.length < 9) {
    setStatus("Nomor WhatsApp sepertinya belum valid, coba periksa lagi ya.", "error");
    return;
  }

  if (CONFIG.GOOGLE_SCRIPT_URL.includes("PASTE_URL_GOOGLE_APPS_SCRIPT_ANDA_DI_SINI")) {
    setStatus("Website belum tersambung ke Google Sheet. Lihat README.md untuk setup.", "error");
    console.warn("CONFIG.GOOGLE_SCRIPT_URL belum diisi. Data belum bisa tersimpan ke Google Sheet.");
    // Tetap lanjutkan ke WhatsApp supaya alur tidak terhenti total saat masih tahap uji coba.
  } else {
    submitBtn.disabled = true;
    setStatus("Menyimpan data pendaftaran...", "loading");
    try {
      await saveToGoogleSheet(data);
    } catch (err) {
      console.error("Gagal mengirim ke Google Sheet:", err);
      setStatus("Gagal menyimpan data, tapi kamu tetap bisa lanjut lewat WhatsApp.", "error");
    }
  }

  setStatus("Berhasil! Mengarahkan ke WhatsApp...", "success");

  const message = buildWhatsAppMessage(data);
  const waUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  setTimeout(() => {
    window.open(waUrl, "_blank");
    submitBtn.disabled = false;
    form.reset();
    setStatus("Pendaftaran terkirim. Silakan tekan Send di WhatsApp untuk menyelesaikan.", "success");
  }, 500);
});
