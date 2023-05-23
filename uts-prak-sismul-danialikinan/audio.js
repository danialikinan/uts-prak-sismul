// Mendapatkan elemen HTML dengan ID "audioFile"
const audioFile = document.getElementById("audioFile");

// Mendapatkan elemen HTML dengan ID "original-size"
const originalSize = document.getElementById("original-size");

// Mendapatkan elemen HTML dengan ID "file-name"
const fileName = document.getElementById("file-name");

// Mendapatkan elemen HTML dengan ID "compressed-size"
const compressedSize = document.getElementById("compressed-size");

// Mendapatkan elemen HTML dengan ID "original-audio-section"
const originalAudioSection = document.getElementById("original-audio-section");

// Mendapatkan elemen HTML dengan ID "uploadButton"
const uploadButton = document.getElementById("uploadButton");

// Mendapatkan elemen HTML dengan ID "resetButton"
const resetButton = document.getElementById("resetButton");

// Menambahkan event listener pada tombol dengan ID "compressButton" untuk menjalankan fungsi compressAudio saat diklik
document
  .getElementById("compressButton")
  .addEventListener("click", compressAudio);

// Menambahkan event listener pada input file audio untuk menampilkan informasi file audio yang dipilih
audioFile.addEventListener("change", (e) => {
  // Mengambil file audio yang dipilih
  const [file] = audioFile.files;

  // Memastikan ada file yang dipilih
  if (file) {
    // Menghilangkan class "d-none" pada elemen originalAudioSection
    originalAudioSection.classList.remove("d-none");

    // Menghilangkan class "d-none" pada elemen resetButton
    resetButton.classList.remove("d-none");

    // Menambahkan class "d-none" pada elemen uploadButton
    uploadButton.classList.add("d-none");
  }

  // Menampilkan ukuran file audio asli sebelum dikompresi
  originalSize.innerText = bytesToSize(file.size);

  // Menampilkan nama file audio yang dipilih
  fileName.innerText = file.name;
});

// Menambahkan event listener pada tombol resetButton untuk me-refresh halaman
resetButton.addEventListener("click", (e) => {
  window.location.reload();
});

// Fungsi async untuk melakukan kompresi audio
async function compressAudio() {
  // Mendapatkan elemen input file audio
  const fileInput = document.getElementById("audioFile");

  // Mendapatkan file audio yang dipilih
  const file = fileInput.files[0];

  // Memastikan ada file yang dipilih
  if (!file) {
    console.log("No file selected.");
    return;
  }

  // Membuat objek FormData untuk mengirim data file audio
  const formData = new FormData();
  formData.append("audio", file);

  try {
    // Mengirim data file audio ke server menggunakan metode POST
    const response = await fetch("http://localhost:3000/compress-audio", {
      method: "POST",
      body: formData,
    });

    // Memeriksa respon dari server
    if (response.ok) {
      // Mendapatkan blob hasil kompresi audio
      const blob = await response.blob();

      // Menampilkan ukuran file audio yang dikompresi
      compressedSize.innerText = bytesToSize(blob.size);

      // Membuat URL objek blob untuk audio yang dikompresi
      const url = URL.createObjectURL(blob);

      // Mengubah sumber audio dengan URL yang baru
      changeAudioSource(url);
    } else {
      console.error("Error:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Mendapatkan elemen audio
const audio = document.getElementById("audio");

// Mendapatkan elemen audio source
const source = document.getElementById("audioSource");

// Fungsi untuk mengubah sumber audio
const changeAudioSource = (url) => {
  source.src = url;
  audio.load();
};

// Fungsi untuk mengonversi ukuran byte menjadi ukuran yang lebih bacaan manusia
function bytesToSize(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  if (bytes === 0) {
    return "0 Byte";
  }

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}
