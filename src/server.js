require("dotenv").config(); // Carrega as variáveis de ambiente
const express = require("express"); // O express serve para criar o servidor
const cors = require("cors"); // O cors serve para permitir requisições de outros domínios
const indexRoutes = require("./routes/index.routes"); // Importa as rotas
const bodyParser = require('body-parser');

const app = express(); // Cria o servidor e armazena na variável app
const port = process.env.PORT || 5000; // Pega a porta do arquivo .env ou usa a porta 5000

app.use(cors()); // Configura o servidor para aceitar requisições de outros domínios

// Aumentar o limite de tamanho da carga útil para 50 MB
app.use(bodyParser.json({ limit: '50mb' }));

app.use(
  cors({
    origin: "*",
  })
);

app.use("/", indexRoutes);

// Inicia o servidor na porta configurada
app.listen(port, () =>
  console.log(`⚡ Server started on http://localhost:${port}`)
);

module.exports = app;