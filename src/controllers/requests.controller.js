const pool = require("../database/database.config");

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
      error: "Error: " + e,
      message: "Error in get all requests",
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
        error: 404,
        message: "Request not found with this id: " + id,
      });
    }
  } catch (e) {
    return res.status(500).send({
      error: "Error: " + e,
      message: "Error in get request: " + id,
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
        error: 404,
        message: "Requests not found with this local: " + local,
      });
    }
  } catch (e) {
    return res.status(500).send({
      error: "Error: " + e,
      message: "Error in get requests by local: " + local,
    });
  }
};

// Função para pegar uma requisição por status
const getRequestByStatus = async (req, res) => {
  const { status } = req.params;

  let search;
  switch (status) {
    case 'conclued':
      search = true;
      break;
    default:
      search = false;
      break;
  }

  try {
    const requests = await pool.query(
      "SELECT * FROM requests WHERE status_request = $1;",
      [search]
    );
    if (requests.rowCount > 0) {
      return res.status(200).send({
        results: requests.rowCount,
        requests: requests.rows,
      });
    } else {
      return res.status(404).send({
        error: 404,
        message: "Requests not found with this status: " + status,
      });
    }
  } catch (e) {
    return res.status(500).send({
      error: "Error: " + e,
      message: "Error in get requests by status: " + status,
    });
  }
};

// Função para pegar uma requisição por usuário
const getRequestByUser = async (req, res) => {
  const { user } = req.params;
  try {
    const requests = await pool.query(
      "SELECT * FROM requests WHERE user = $1;",
      [user]
    );
    if (requests.rowCount > 0) {
      return res.status(200).send({
        results: requests.rowCount,
        requests: requests.rows,
      });
    } else {
      return res.status(404).send({
        error: 404,
        message: "Requests not found with this user: " + user,
      });
    }
  } catch (e) {
    return res.status(500).send({
      error: "Error: " + e,
      message: "Error in get requests by user: " + user,
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
  if (!description || description.length < 10) errors.push("invalid_or_short_description");

  let statusRequest;
  switch (status_request) {
    case "conclued":
      statusRequest = true;
      break;
    case "inconclued":
      statusRequest = false;
      break;
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
        status: "success",
        message: "Request created",
      });
    } catch (e) {
      console.error("Error: Creating request ", e);
      return res.status(500).send({
        status: "error",
        message: "Error creating request",
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
  if (!description || description.length < 10) errors.push("invalid_or_short_description");

  let statusRequest;
  switch (status_request) {
    case "conclued":
      statusRequest = true;
      break;
    case "inconclued":
      statusRequest = false;
      break;
    default:
      errors.push("invalid_status");
      break;
  }

  let dateConclusion = date_conclusion || null;

  const emailRegex = /^[\w-\.]+@(sp\.senai\.br|aluno\.senai\.br|docente\.senai\.br)$/;
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
        status: "success",
        message: "Request updated",
      });
    } catch (e) {
      console.error("Error: Updating request ", e);
      return res.status(500).send({
        status: "error",
        message: "Error updating request",
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
      error: "Error: " + e,
      message: "Error in delete request: " + id,
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
        error: 404,
        message: "Requests not found with this title: " + title,
      });
    }
  } catch (e) {
    return res.status(500).send({
      error: "Error: " + e,
      message: "Error in get requests by title: " + title,
    });
  }
};

// Função para concluir uma requisição
const concludeStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await pool.query("UPDATE requests SET status_request=$1 WHERE id=$2", [
      status,
      id,
    ]);
    return res.status(200).send({
      message: "Status updated",
    });
  } catch (e) {
    return res.status(500).send({
      error: "Error: " + e,
      message: "Error in update status",
    });
  }
};

module.exports = {
  getAllRequests,
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
