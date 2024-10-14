// multer.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define o diretório onde os arquivos serão salvos
const UPLOAD_DIR = path.join(__dirname, "../uploads");

// Verifica se o diretório existe, se não, cria
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Configura o armazenamento do multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR); // Usa o diretório uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Define um nome único para o arquivo
  },
});

const upload = multer({ storage });

module.exports = upload;
