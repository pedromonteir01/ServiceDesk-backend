require("dotenv").config(); // Carrega as variáveis de ambiente
const express = require("express"); // O express serve para criar o servidor
const cors = require("cors"); // O cors serve para permitir requisições de outros domínios
const indexRoutes = require("./routes/index.routes"); // Importa as rotas
const { Query } = require("pg");
const { populate } = require("dotenv");
const uploadUser = require("./../middlewares/uploadimage"); // Importa o middleware de upload de imagem

const app = express(); // Cria o servidor e armazena na variável app
const port = process.env.PORT || 5000; // Pega a porta do arquivo .env ou usa a porta 5000

app.use(cors()); // Configura o servidor para aceitar requisições de outros domínios
app.use(express.json()); // Configura o servidor para receber requisições com o formato JSON
app.use("/", indexRoutes); // Configura o servidor para usar as rotas

app.post("/upload-image", uploadUser.single("image"), async (req, res) => {
  //console.log(req.file);
  if (req.file) {
    return res.json({
      error: false,
      message: "Image uploaded successfully!",
      fileName: req.file.filename,
      path: req.file.path,
    });
  }
  return res.status(400).json({
    error: true,
    message: "Error uploading image",
  });
});

// Inicia o servidor na porta configurada
app.listen(port, () =>
  console.log(`⚡ Server started on http://localhost:${port}`)
);
