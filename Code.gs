/**
 * CODE.GS — Tempel seluruh isi file ini ke Google Apps Script
 * (Extensions > Apps Script) pada Google Sheet Anda.
 * Lihat README.md untuk langkah lengkap deploy sebagai Web App.
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Buat header otomatis kalau sheet masih kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Waktu Submit (Server)",
        "Waktu Daftar (Client)",
        "Nama",
        "No. WhatsApp",
        "Usia",
        "Email",
        "Level",
        "Preferensi Jadwal",
        "Tujuan Belajar",
      ]);
    }

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.waktu_daftar || "",
      data.nama || "",
      data.whatsapp || "",
      data.usia || "",
      data.email || "",
      data.level || "",
      data.jadwal || "",
      data.tujuan || "",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Opsional: buka URL Web App langsung di browser untuk mengecek apakah aktif.
function doGet(e) {
  return ContentService
    .createTextOutput("Web App aktif. Gunakan POST untuk mengirim data pendaftaran.")
    .setMimeType(ContentService.MimeType.TEXT);
}
