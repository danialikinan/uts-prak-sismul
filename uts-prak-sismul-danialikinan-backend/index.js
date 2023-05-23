// Mengimpor library yang diperlukan
const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");

// Membuat instance aplikasi Express
const app = express();

// Membuat middleware multer untuk menangani upload file
const upload = multer({ dest: "uploads/" });

// Mendefinisikan route POST "/compress-audio" untuk melakukan kompresi audio
app.post("/compress-audio", upload.single("audio"), (req, res) => {
  // Mendapatkan path file audio yang di-upload
  const inputFile = req.file.path;

  // Menentukan nama file output hasil kompresi
  const outputFile = `compressed_${req.file.filename}.mp3`;

  // Spawning child process untuk menjalankan ffmpeg dengan argumen yang sesuai
  const ffmpegProcess = spawn("ffmpeg", [
    "-i",
    inputFile,
    "-b:a",
    "64k",
    outputFile,
  ]);

  // Mengatur header response untuk mengatasi masalah CORS
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.setHeader("Access-Control-Allow-Methods", "POST");

  // Event listener untuk menangani ketika proses ffmpeg selesai
  ffmpegProcess.on("close", () => {
    // Mengirimkan file hasil kompresi ke klien
    res.download(outputFile, (err) => {
      if (err) {
        console.error("Error sending file:", err);
      } else {
        console.log("File sent successfully");
      }
    });
  });
});

// Menjalankan server pada port 3000
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
