const pool = require("../database/database.config");
const locaisUnicos = require("../models/locals/locals");

// Função para pegar todas as requisições
const getAllRequests = async (req, res) => {
  try {
    const requests = await pool.query("SELECT * FROM requests;");
    if (requests.rowCount == 0) {
      return res.status(200).send({
        message: "nenhuma requisição feita",
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
      error: "Erro de servidor"
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
      return res.status(200).send({
        request: request.rows[0],
      });
    } else {
      return res.status(404).send({
        message: "Não existe requisição com este id"
      });
    }
  } catch (e) {
    return res.status(500).send({
      error: "Erro de servidor"
    });
  }
};

// Função para pegar uma requisição por ambiente/local
const getRequestByLocal = async (req, res) => {
  const { local } = req.params;
  try {
    const requests = await pool.query(
      "SELECT * FROM requests WHERE local LIKE $1;",
      [`%${local.toLowerCase()}%`]
    );
    if (requests.rowCount > 0) {
      return res.status(200).send({
        requests: requests.rows,
      });
    } else {
      return res.status(404).send({
        message: "Não há requisições com este local"
      });
    }
  } catch (e) {
    return res.status(500).send({
      error: "Erro de servidor"
    });
  }
};

// Função para pegar uma requisição por status
const getRequestByStatus = async (req, res) => {
  const { status } = req.params;

  let statusRequest;
  switch (status.toLowerCase()) {
    case "conclued":
      statusRequest = 'concluída';
      break;
    case "awaiting":
      statusRequest = 'em andamento';
      break;
    case "inconclued" :
      statusRequest = 'aguardando'
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
        message: "Requisições não encontradas",
      });
    }
  } catch (e) {
    return res.status(500).send({
      error: "Erro de servidor",
    });
  }
};

// Função para pegar uma requisição por usuário
const getRequestByUser = async (req, res) => {
  const { email } = req.params;
  try {
    const requests = await pool.query(
      "SELECT * FROM requests WHERE user = $1;",
      [email]
    );
    if (requests.rowCount > 0) {
      return res.status(200).send(requests.rows[0]);
    } else {
      return res.status(404).send({
        message: "Este usuário não fez requisições"
      });
    }
  } catch (e) {
    return res.status(500).send({
      error: "Error de servidor"
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
    status_request,
    date_request,
    date_conclusion,
    email,
  } = req.body;

  if (!title || title.length < 6) errors.push("invalid_or_short_name");
  if (!description || description.length < 10)
    errors.push("invalid_or_short_description");

  let statusRequest;
  switch (status_request.toLowerCase()) {
    case "conclued":
      statusRequest = 'concluída';
      break;
    case "awaiting":
      statusRequest = 'em andamento';
      break;
    case "inconclued" :
      statusRequest = 'aguardando'
    default:
      errors.push("invalid_status");
      break;
  }

  let dateConclusion = date_conclusion || null;

  if (errors.length !== 0) {
    return res.status(400).send({
      errors: errors,
    });
  } else {
    try {
      // O multer armazena o arquivo da imagem como req.file
      const image = req.file ? req.file.filename : null;

      await pool.query(
        "INSERT INTO requests (image, description, local, status_request, date_request, date_conclusion, email, title) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);",
        [
          image,
          description,
          local,
          statusRequest,
          date_request,
          dateConclusion,
          email,
          title.toLowerCase(),
        ]
      );
      return res.status(201).send({
        message: "Requisição criada com sucesso",
      });
    } catch (e) {
      return res.status(500).send({
        error: "Erro no servidor",
      });
    }
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
//   "email": ""
// }

// Função para atualizar uma requisição
const updateRequest = async (req, res) => {
  let errors = [];

  const { id } = req.params;
  const {
    title,
    image,
    description,
    local,
    status_request,
    date_request,
    date_conclusion,
    email,
  } = req.body;

  if (!title || title.length < 6) errors.push("invalid_or_short_name");
  if (!description || description.length < 10)
    errors.push("invalid_or_short_description");

  let statusRequest;
  switch (status_request.toLowerCase()) {
    case "conclued":
      statusRequest = 'concluída';
      break;
    case "awaiting":
      statusRequest = 'em andamento';
      break;
    case "inconclued" :
      statusRequest = 'aguardando'
    default:
      errors.push("invalid_status");
      break;
  }

  let dateConclusion = date_conclusion || null;

  const emailRegex =
    /^[\w-\.]+@(sp\.senai\.br|aluno\.senai\.br|docente\.senai\.br)$/;
  if (!emailRegex.test(email)) errors.push("invalid_email");

  if (errors.length !== 0) {
    return res.status(400).send({
      errors: errors,
    });
  } else {
    try {
      await pool.query(
        "UPDATE requests SET image = $1, description = $2, local = $3, status_request = $4, date_request = $5, date_conclusion = $6, email = $7, title = $8 WHERE id = $9;",
        [
          image,
          description,
          local,
          statusRequest,
          date_request,
          dateConclusion,
          email,
          title,
          id,
        ]
      );
      return res.status(200).send({
        message: "Requisição alterada com sucesso",
      });
    } catch (e) {
      console.error("Error: Updating request ", e);
      return res.status(500).send({
        error: "Error de servidor",
      });
    }
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
        error: 'Requisições não encontradas'
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
  const { status } = req.body;

  let statusRequest;
  switch (status.toLowerCase()) {
    case "conclued":
      statusRequest = 'concluída';
      break;
    case "awaiting":
      statusRequest = 'em andamento';
      break;
    case "inconclued" :
      statusRequest = 'aguardando'
    default:
      return res.status(400).send({ message: 'status_inválido'});
  }

  try {
    await pool.query("UPDATE requests SET status_request=$1 WHERE id=$2", [
      statusRequest,
      id,
    ]);
    return res.status(200).send({
      message: "status alterado com sucesso",
    });
  } catch (e) {
    return res.status(500).send({
      error: "Error: " + e,
      error: "Error in update status",
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
};
