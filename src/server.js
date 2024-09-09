const express = require('express'); // O express serve para criar o servidor
const { config } = require('dotenv'); // O dotenv serve para ler as variáveis de ambiente

config(); // Carrega as variáveis de ambiente

const port = process.env.PORT || 5000; // Pega a porta do arquivo .env ou usa a porta 5000

const app = express(); // Cria o servidor e armazena na variável app
app.use(express.json()); // Configura o servidor para receber requisições com o formato JSON

// Inicia o servidor na porta configurada
app.listen(port, () =>
  console.log(`⚡ Server started on http://localhost:${port}`)
);