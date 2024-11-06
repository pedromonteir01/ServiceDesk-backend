require("dotenv").config(); // Carrega as variáveis de ambiente
const express = require("express"); // O express serve para criar o servidor
const cors = require("cors"); // O cors serve para permitir requisições de outros domínios
const indexRoutes = require("./routes/index.routes"); // Importa as rotas
const bodyParser = require('body-parser');
const { json } = require("express"); // Importa o método json do express
// const multer = require("multer"); // Importa o multer para lidar com uploads de arquivos
// const { memoryStorage } = require("multer"); // Importa o memoryStorage do multer
// const { getUserPresignedUrls, uploadToS3 } = require("./s3.js"); // Importa as funções do s3.mjs

const app = express(); // Cria o servidor e armazena na variável app
const port = process.env.PORT || 5000; // Pega a porta do arquivo .env ou usa a porta 5000

app.use(cors()); // Configura o servidor para aceitar requisições de outros domínios
app.use(express.json()); // Configura o servidor para receber requisições com o formato JSON

// const storage = memoryStorage();
// const upload = multer({ storage });

app.use(
  cors({
    origin: "*",
  })
);
// Aumentar o limite de tamanho da carga útil para 50 MB
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(json());

// app.post("/images", upload.single("image"), (req, res) => {
//   const { file } = req;
//   const userId = req.headers["x-user-id"];
  
//   if (!file || !userId) return res.status(400).json({ message: "Bad request" });
  
//   const { error, key } = uploadToS3({ file, userId });
//   if (error) return res.status(500).json({ message: error.message });
  
//   return res.status(201).json({ key });
// });

// app.get("/images", async (req, res) => {
//   const userId = req.headers["x-user-id"];
  
//   if (!userId) return res.status(400).json({ message: "Bad request" });
  
//   const { error, presignedUrls } = await getUserPresignedUrls(userId);
//   if (error) return res.status(400).json({ message: error.message });
  
//   return res.json(presignedUrls);
// });

app.use("/", indexRoutes);

// Inicia o servidor na porta configurada
app.listen(port, () =>
  console.log(`⚡ Server started on http://localhost:${port}`)
);