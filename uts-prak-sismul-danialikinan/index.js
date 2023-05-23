let img = document.getElementById("image1"); // element input gambar
let blah = document.getElementById("blah"); // gambar original
let originalSize = document.getElementById("original-size"); // tulisan size asli
let imgControl = document.getElementById("img-control"); // pengontrol data gambar
let imgProcessing = document.getElementById("img-processing"); // section hasil gambar
let originalWidth = 0;
let originalHeight = 0;
let originalImgWidth = document.getElementById("originalImgWidth"); // tulisan width asli
let originalImgHeight = document.getElementById("originalImgHeight"); // tulisan height asli
let imgWidth = document.getElementById("imgWidth"); // tulisan width setelah
let imgHeight = document.getElementById("imgHeight"); // tulisan height setelah
const compressedImage = document.querySelector("#compressedImage"); // elemen gambar hasil
let compressedImageBlob; // menyimpan blob gambar
const scaleInput = document.getElementById("scale"); // elemen input scale (untuk kualitas gambar)

const uploadButton = document.getElementById("uploadButton"); // tombol upload
const resetButton = document.getElementById("resetButton"); // tombol reset

// dijalankan ketika gambar diinputkan
img.onchange = (e) => {
  // jika ada gambar, tombol reset muncul, tombol upload hilang
  if (img.src) {
    uploadButton.classList.remove("d-none");
    resetButton.classList.add("d-none");
  } else {
    uploadButton.classList.add("d-none");
    resetButton.classList.remove("d-none");
  }
  // menyimpan gambar yang diupload ke variable
  const [file] = img.files;
  // cek apakah ada gambar
  if (file) {
    // tampilkan gambar original
    blah.src = URL.createObjectURL(file);
    // dijalankan ketika gambar original sudah dimuat
    blah.onload = function (e) {
      // simpan height dan width gambar original ke variable
      originalHeight = this.height;
      originalWidth = this.width;
      // tampilkan height, width, dan size gambar original
      originalImgHeight.innerText = this.height;
      originalImgWidth.innerText = this.width;
      originalSize.innerText = bytesToSize(file.size);
      // atur nilai default kualitas, brightness, dan contrast
      scaleInput.value = 100;
      brightnessInput.value = 100;
      contrastInput.value = 100;

      //
      blah.style.width = "100%";

      // initializing the compressed image
      compressImage(blah, 1);
    };
    // agar bagian pengatur data gambar dan hasil gambar bisa dimunculkan ke layar
    imgControl.style.display = "block";
    imgProcessing.style.display = "block";
  }
};
// dijalankan ketika scale diubah
scaleInput.onchange = (e) => {
  compressImage(blah, e.target.value / 100);
};
// dijalankan ketika tombol reset diklik
resetButton.onclick = (e) => {
  window.location.reload();
};
// fungsi mengkompres gambar
function compressImage(imgToCompress, resizingFactor) {
  // membuat canvas
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  // ukuran canvas menyesuaikan nilai
  const canvasWidth = originalWidth * resizingFactor;
  const canvasHeight = originalHeight * resizingFactor;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  // tampilkan width dan height hasil gambar ke layar
  imgWidth.innerText = parseInt(canvasWidth);
  imgHeight.innerText = parseInt(canvasHeight);
  // cetak gambar ke canvas (untuk kompresinya)
  context.drawImage(
    imgToCompress,
    0,
    0,
    originalWidth * resizingFactor,
    originalHeight * resizingFactor
  );
  // ubah canvas ke blob
  canvas.toBlob((blob) => {
    if (blob) {
      compressedImageBlob = blob;
      // ubah source element image dengan url dari blob yang baru dibuat
      compressedImage.src = URL.createObjectURL(compressedImageBlob);
      // tampilkan size file gambar baru ke layar
      document.querySelector("#size").innerHTML = bytesToSize(blob.size);
      // agar lebar gambar baru ditampilkan penuh
      compressedImage.style.width = "100%";
    }
  }, "image/jpeg");
}

// fungsi untuk mengubah satuan byte ke satuan yang lebih besar
function bytesToSize(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  if (bytes === 0) {
    return "0 Byte";
  }

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

const brightnessInput = document.getElementById("brightness"); // element input nilai brightness
const contrastInput = document.getElementById("contrast"); // element input nilai contrast

// untuk disimpan ke css nantinya
let brightnessText = "";
let contrastText = "";

// menangkap value brightness dari input, kemudian jalankan updateImageFilter
brightnessInput.onchange = (e) => {
  brightnessText = `brightness(${e.target.value / 100})`;
  updateImageFilter();
};
// menangkap value contrast dari input, kemudian jalankan updateImageFilter
contrastInput.onchange = (e) => {
  contrastText = `contrast(${e.target.value / 100})`;
  updateImageFilter();
};

// ubah style image menggunakan filter yang telah disesuaikan dengan inputan
const updateImageFilter = () => {
  compressedImage.style.filter = `${brightnessText} ${contrastText}`;
};
