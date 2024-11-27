const pool = require("../database/database.config");
const locaisUnicos = require("../models/locals/locals");
const nodemailer = require('nodemailer');
const { uploadToS3, getUserPresignedUrls } = require("../s3"); // Importe suas funções de upload e recuperação de URLs

// Função para pegar todas as requisições
const getAllRequests = async (req, res) => {
  try {
    const requests = await pool.query(
      "SELECT * FROM requests order by date_request desc;"
    );
    if (requests.rowCount == 0) {
      return res.status(200).send({
        success: "nenhuma requisição feita",
      });
    } else {
      return res.status(200).send({
        results: requests.rowCount,
        requests: requests.rows,
      });
    }
  } catch (e) {
    return res.status(500).send({
      error: "Error de servidor",
    });
  }
};

const getLocaisInstalacao = (req, res) => {
  try {
    return res.status(200).send({
      results: locaisUnicos.length,
      locais: locaisUnicos,
    });
  } catch (e) {
    return res.status(500).send({
      error: "Erro de servidor",
    });
  }
};

// Função para pegar uma requisição por ambiente/local
const getRequestByLocal = async (req, res) => {
  const { local } = req.params;
  try {
    const requests = await pool.query(
      "SELECT * FROM requests WHERE local = $1;",
      [local]
    );
    if (requests.rowCount > 0) {
      return res.status(200).send({
        results: requests.rowCount,
        requests: requests.rows,
      });
    } else {
      return res.status(404).send({
        error: "Requisições não encontradas",
      });
    }
  } catch (e) {
    return res.status(500).send({
      error: "Erro de servidor",
    });
  }
};

// Função para pegar uma requisição por id
const getRequestById = async (req, res) => {
  const { id } = req.params;
  try {
    const request = await pool.query("SELECT * FROM requests WHERE id = $1", [
      id,
    ]);
    if (request.rowCount > 0) {
      return res.status(200).send(request.rows[0]);
    } else {
      return res.status(404).send({
        error: "Não existe requisição com este id",
      });
    }
  } catch (e) {
    return res.status(500).send({
      error: "Erro de servidor",
    });
  }
};

// Função para pegar uma requisição por status
const getRequestByStatus = async (req, res) => {
  const { status } = req.params;

  let errors = [];

  let statusRequest;
  switch (status.toLowerCase()) {
    case "conclued":
      statusRequest = "concluida";
      break;
    case "awaiting":
      statusRequest = "em andamento";
      break;
    case "inconclued":
      statusRequest = "aguardando";
      break;
    default:
      errors.push("invalid_status");
      break;
  }

  try {
    const requests = await pool.query(
      "SELECT * FROM requests WHERE status_request = $1;",
      [statusRequest]
    );
    if (requests.rowCount > 0) {
      return res.status(200).send({
        results: requests.rowCount,
        requests: requests.rows,
      });
    } else {
      return res.status(404).send({
        error: "Requisições não encontradas",
      });
    }
  } catch (e) {
    return res.status(500).send({
      error: "Erro de servidor",
    });
  }
};

const getRequestByCreation = async (req, res) => {
  const { creation } = req.params;
  try {
    const requests = await pool.query(
      "SELECT * FROM requests WHERE date_request=$1",
      [creation]
    );

    if (requests.rowCount > 0) {
      return res.status(200).send({
        results: requests.rowCount,
        requests: requests.rows,
      });
    } else {
      return res.status(404).send({
        error: "Requisições não encontradas",
      });
    }
  } catch (e) {
    return res.status(500).send({
      error: "Error de servidor",
    });
  }
};

const getRequestByFinish = async (req, res) => {
  const { finish } = req.params;
  try {
    const requests = await pool.query(
      "SELECT * FROM requests WHERE date_conclusion=$1",
      [finish]
    );

    if (requests.rowCount > 0) {
      return res.status(200).send({
        results: requests.rowCount,
        requests: requests.rows,
      });
    } else {
      return res.status(404).send({
        error: "Requisições não encontradas",
      });
    }
  } catch (e) {
    return res.status(500).send({
      error: "Error de servidor",
    });
  }
};

// Função para pegar uma requisição por usuário
const getRequestByUser = async (req, res) => {
  const { email } = req.params;
  try {
    const requests = await pool.query(
      "SELECT * FROM requests WHERE email LIKE $1;",
      [`${email}%`]
    );
    if (requests.rowCount > 0) {
      return res.status(200).send({
        results: requests.rowCount,
        requests: requests.rows,
      });
    } else {
      return res.status(404).send({
        error: "Este usuário não fez requisições",
      });
    }
  } catch (e) {
    return res.status(500).send({
      error: "Error de servidor",
    });
  }
};

const getRequestsByPriority = async(req, res) => {
  const { priority } = req.params;

  let priorityForSQL;
  switch (priority) {
    case 'high':
      priorityForSQL = 'alta';
      break;
    case 'medium':
      priorityForSQL = 'média';
      break;
    case 'low':
      priorityForSQL = 'baixa';
      break
    default:
      errors.push('Prioridade inválida');
      break;
  }


  try {
    const response = await pool.query('SELECT * FROM requests WHERE priority=$1', [priorityForSQL]);
    if(response.rowCount === 0) {
      return res.status(404).send({
        error: "Não há requisições com esta prioridade"
      });
    } else {
      return res.status(200).send(response.rows);
    }
  } catch(e) {
    return res.status(500).send({
      error: "Error de servidor",
    });
  }
};

// Função para criar uma requisição
const createRequest = async (req, res) => {
  let errors = [];
  const {
    title,
    description,
    local,
    image, // Recebendo a imagem como array de bytes
    imageName, // Nome do arquivo de imagem
    imageType, // Tipo de imagem
    status_request,
    date_request,
    date_conclusion,
    priority,
    email,
  } = req.body;

  // Validações de campo
  if (!title || title.length < 4)
    errors.push("O título deve ter pelo menos 4 caracteres.");
  if (!description || description.length < 10)
    errors.push("A descrição deve ter pelo menos 10 caracteres.");
  if (!local) errors.push("O campo 'local' é obrigatório.");
  if (!status_request) errors.push("O status da requisição é obrigatório.");

  // Validação e tradução do status_request
  let statusRequest;
  switch (status_request.toLowerCase()) {
    case "conclued":
      statusRequest = "concluida";
      break;
    case "awaiting":
      statusRequest = "em andamento";
      break;
    case "inconclued":
      statusRequest = "aguardando";
      break;
    default:
      errors.push("Status de requisição inválido.");
      break;
  }

  let priorityForSQL;
  switch (priority) {
    case 'high':
      priorityForSQL = 'alta';
      break;
    case 'medium':
      priorityForSQL = 'média';
      break;
    case 'low':
      priorityForSQL = 'baixa';
      break
    default:
      errors.push('Prioridade inválida');
      break;
  }

  // Retorno de erros de validação
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Processo de upload da imagem (se fornecida)
  let imageUrl = null;
  if (image) {
    try {
      const buffer = Buffer.from(image);
      const file = {
        buffer,
        originalname: imageName || "imagem.jpg",
        mimetype: imageType || "image/jpeg",
      };
      const { error, url } = await uploadToS3({ file, userId: email });

      if (error) throw new Error(error.message);
      imageUrl = url;
    } catch (error) {
      return res
        .status(500)
        .json({ errors: "Erro ao fazer upload da imagem." });
    }
  }

  // Inserção da nova requisição no banco de dados
  try {
    const newRequest = await pool.query(
      "INSERT INTO requests (title, description, local, image, status_request, date_request, date_conclusion, priority, email) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;",
      [
        title,
        description,
        local,
        imageUrl,
        statusRequest,
        date_request,
        null,
        priorityForSQL,
        email,
      ]
    );
    return res.status(201).json(newRequest.rows[0]);
  } catch (error) {
    console.error("Erro de banco de dados:", error);
    return res
      .status(500)
      .json({ errors: "Erro interno do servidor ao salvar a requisição." });
  }
};

//Criar um request para teste
// {
//   "title": "Teste",
//   "description": "Teste",
//   "local": "Teste",
//   "status_request": "conclued",
//   "date_request": "2021-10-10",
//   "date_conclusion": "2021-10-10",
//   "priority": "high"
//   "email": ""
// }

// Função para atualizar uma requisição
const updateRequest = async (req, res) => {
  const { id } = req.params;

  let errors = [];
  const {
    title,
    description,
    local,
    image, // Recebendo a imagem como array de bytes
    imageName, // Nome do arquivo de imagem
    imageType, // Tipo de imagem
    imageBoolean,
    status_request,
    date_request,
    date_conclusion,
    priority,
    email,
  } = req.body;

  // Validações de campo
  if (!title || title.length < 4)
    errors.push("O título deve ter pelo menos 4 caracteres.");
  if (!description || description.length < 10)
    errors.push("A descrição deve ter pelo menos 10 caracteres.");
  if (!local) errors.push("O campo 'local' é obrigatório.");
  if (!status_request) errors.push("O status da requisição é obrigatório.");

  // Validação e tradução do status_request
  let statusRequest;
  switch (status_request.toLowerCase()) {
    case "conclued":
      statusRequest = "concluida";
      break;
    case "awaiting":
      statusRequest = "em andamento";
      break;
    case "inconclued":
      statusRequest = "aguardando";
      break;
    default:
      errors.push("Status de requisição inválido.");
      break;
  }

  let priorityForSQL;
  switch (priority) {
    case 'high':
      priorityForSQL = 'alta';
      break;
    case 'medium':
      priorityForSQL = 'média';
      break;
    case 'low':
      priorityForSQL = 'baixa';
      break
    default:
      errors.push('Prioridade inválida');
      break;
  }

  // Retorno de erros de validação
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  // Processo de upload da imagem (se fornecida)
  let imageUrl = null;
  if (imageBoolean === false) {
  if (image) {
    try {
      const buffer = Buffer.from(image);
      const file = {
        buffer,
        originalname: imageName || "imagem.jpg",
        mimetype: imageType || "image/jpeg",
      };
      const { error, url } = await uploadToS3({ file, userId: email });

      if (error) throw new Error(error.message);
      imageUrl = url;
    } catch (error) {
      return res
        .status(500)
        .json({ errors: "Erro ao fazer upload da imagem." });
    }
  }
} else {
  imageUrl = image;
}
  // Inserção da nova requisição no banco de dados
  try {
    await pool.query(
      "UPDATE requests SET title=$1, description=$2, local=$3, image=$4, status_request=$5, date_request=$6, date_conclusion=$7, priority=$8, email=$9 WHERE id=$10;",
      [
        title,
        description,
        local,
        imageUrl,
        statusRequest,
        date_request,
        null,
        priorityForSQL,
        email,
        id
      ]
    );
    return res.status(201).send({ success: 'Solicitação alterada com sucesso!' });
  } catch (error) {
    console.error("Erro de banco de dados:", error);
    return res
      .status(500)
      .json({ errors: "Erro interno do servidor ao salvar a requisição." });
  }
};

// Função para deletar uma requisição
const deleteRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await pool.query("SELECT * FROM requests WHERE id = $1;", [
      id,
    ]);

    if (request.rowCount === 0) {
      return res.status(404).send({
        error: "Request not found",
      });
    } else {
      await pool.query("DELETE FROM requests WHERE id = $1;", [id]);
      return res.status(200).send({
        message: "Request deleted",
      });
    }
  } catch (e) {
    return res.status(500).send({
      error: "Error in delete request: " + id,
    });
  }
};

// Função para filtrar requisições por título
const filterRequestsByTitle = async (req, res) => {
  const { title } = req.params;
  try {
    // Filtra as requisições que contém o título é necessário que o title seja convertido para minúsculo
    const requests = await pool.query(
      "SELECT * FROM requests WHERE title LIKE $1;",
      [`%${title.toLowerCase()}%`]
    );
    if (requests.rowCount > 0) {
      return res.status(200).send({
        results: requests.rowCount,
        requests: requests.rows,
      });
    } else {
      return res.status(404).send({
        error: "Requisições não encontradas",
      });
    }
  } catch (e) {
    return res.status(500).send({
      error: "Error in get requests by title: " + title,
    });
  }
};

// Função para concluir uma requisição
const concludeStatus = async (req, res) => {
  const { id } = req.params;
  const { status, email } = req.body;

  if (!status) {
    return res.status(400).send({ error: 'status missing' });
  }

  let statusRequest;
  switch (status.toLowerCase()) {
    case "conclued":
      statusRequest = "concluida";
      break;
    case "awaiting":
      statusRequest = "em andamento";
      break;
    case "inconclued":
      statusRequest = "aguardando";
    default:
      return res.status(400).send({ message: "status_inválido" });
  }

  try {

    const date = new Date().toISOString().split('T')[0];

    const request = (await pool.query('SELECT * FROM requests WHERE id=$1',[id])).rows[0];

    if(!request) return res.status(404).send({ error: 'requisição não encontrada' });

    if (statusRequest === 'concluida') {
      await pool.query("UPDATE requests SET status_request=$1, date_conclusion=$2 WHERE id=$3", [
        statusRequest,
        date,
        id
      ]);

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: "bflowcompany@gmail.com",
          pass: "wjvr sqme iqti ywiu"
        }
      });

      const mailOptions = {
        from: 'bflowcompany@gmail.com',
        to: email,
        html: `<p>Olá! O aplicativo Service Desk informa que,</p>
        <p>A solicitação de nº${id} do assunto: "${request.title}" foi finalmente concluída!</p>`,
        subject: 'Requisição alterada com sucessso!',
        text: `Olá! O aplicativo Service Desk informa que, A solicitação de nº${id} do assunto: "${request.title}" foi finalmente concluída!`
      }
      
      transporter.sendMail(mailOptions, function(error, info) {
        if(error) {
          return res.status(400).send({ error: error });
        } else {
          console.log(info.response);
        }
      })

    } else {
      await pool.query("UPDATE requests SET status_request=$1, date_conclusion=NULL WHERE id=$2", [
        statusRequest,
        id
      ]);
    }

    return res.status(200).send({
      message: "status alterado com sucesso",
    });
  } catch (e) {
    return res.status(500).send({
      error: "Error: " + e,
    });
  }
};

module.exports = {
  getAllRequests,
  getLocaisInstalacao,
  getRequestById,
  getRequestByLocal,
  getRequestByStatus,
  getRequestByUser,
  createRequest,
  updateRequest,
  deleteRequest,
  filterRequestsByTitle,
  concludeStatus,
  getRequestByCreation,
  getRequestByFinish,
  getRequestsByPriority
};
