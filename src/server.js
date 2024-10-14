require("dotenv").config(); // Carrega as variáveis de ambiente
const express = require("express"); // O express serve para criar o servidor
const cors = require("cors"); // O cors serve para permitir requisições de outros domínios
const indexRoutes = require("./routes/index.routes"); // Importa as rotas
const uploadUser = require("./middlewares/uploadimage"); // Importa o middleware de upload de imagem

const app = express(); // Cria o servidor e armazena na variável app
const port = process.env.PORT || 5000; // Pega a porta do arquivo .env ou usa a porta 5000

app.use(cors()); // Configura o servidor para aceitar requisições de outros domínios
app.use(express.json()); // Configura o servidor para receber requisições com o formato JSON

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static('uploads'));

// Configura o servidor para usar as rotas
app.use("/", indexRoutes); 

// Rota de upload de imagem
app.post("/upload-image", uploadUser.single("image"), async (req, res) => {
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
