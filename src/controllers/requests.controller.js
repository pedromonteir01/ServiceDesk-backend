const req = require("express/lib/request");
const pool = require("../database/database.config");

// Função para pegar todas as requisições
const getAllRequests = async (req, res) => {
  try {
    /* requisição para o banco */
    const requests = await pool.query("SELECT * FROM requests;");
    /* resposta em json */
    if (requests.rowCount == 0) {
      return res.status(200).send({
        message: "none_requests",
      });
    } else {
      return res.status(200).send({
        results: requests.rowCount,
        requests: requests.rows,
      });
    }
  } catch (e) {
    /* retorno do erro em json */
    return res.status(500).send({
      error: "Error: " + e,
      message: "Error in get all requests",
    });
  }
};

// Função para pegar uma requisição por id
const getRequestById = async (req, res) => {
  /* id por params */
  const { id } = req.params;
  try {
    /* requisição para o banco */
    const request = await pool.query("SELECT * FROM requests WHERE id = $1", [
      id,
    ]);
    /* resposta em json */
    if (request) {
      return res.status(200).send({
        results: request.rowCount,
        request: request.rows,
      });
    } else {
      return res.status(404).send({
        error: 404,
        message: "Request not found with this id: " + id,
      });
    }
  } catch (e) {
    /* retorno do erro em json */
    return res.status(500).send({
      error: "Error: " + e,
      message: "Error in get request: " + id,
    });
  }
};

// Função para pegar uma requisição por ambiente/local
const getRequestByLocal = async (req, res) => {
  /* local por params */
  const { local } = req.params;
  try {
    /* requisição para o banco */
    const requests = await pool.query(
      "SELECT * FROM requests WHERE local LIKE $1;",
      [`%${local.toLowerCase()}%`]
    );
    /* resposta em json */
    if (requests) {
      return res.status(200).send({
        results: requests.rowCount,
        requests: requests.rows,
      });
    } else {
      return res.status(404).send({
        error: 404,
        message: "Requests not found with this local: " + local,
      });
    }
  } catch (e) {
    /* retorno do erro em json */
    return res.status(500).send({
      error: "Error: " + e,
      message: "Error in get requests by local: " + local,
    });
  }
};

// Função para pegar uma requisição por status
const getRequestByStatus = async (req, res) => {
  // status por params
  const { status } = req.params;

  try {
    /* requisição para o banco */
    const requests = await pool.query(
      "SELECT * FROM requests WHERE status = $1;",
      [status]
    );
    /* resposta em json */
    if (requests) {
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
    /* retorno do erro em json */
    return res.status(500).send({
      error: "Error: " + e,
      message: "Error in get requests by status: " + status,
    });
  }
};

// Função para pegar uma requisição por usuário
const getRequestByUser = async (req, res) => {
  // usuário por params
  const { user } = req.params;
  try {
    /* requisição para o banco */
    const requests = await pool.query(
      "SELECT * FROM requests WHERE user = $1;",
      [user]
    );
    /* resposta em json */
    if (requests) {
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
    /* retorno do erro em json */
    return res.status(500).send({
      error: "Error: " + e,
      message: "Error in get requests by user: " + user,
    });
  }
};

// Função para criar uma requisição
const createRequest = async (req, res) => {
  /* array para tratativa dos erros das regras de negocio */
  let errors = [];

  /* body pra criar elementos */
  const { local, description, user, status, statusMessage, image } = req.body;

  if (!local || !image) {
    /* retorno de erro em JSON */
    return res.status(400).send({
      status: "error",
      message: "Local and Image are required",
    });
  }

  try {
    /* requisição para o banco */
    const request = await pool.query(
      "INSERT INTO requests (local, description, user, status, statusMessage, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [local, description, user, status, statusMessage, image]
    );
    /* resposta em JSON */
    return res.status(201).send({
      status: "success",
      message: "Request created",
      request: request.rows,
    });
  } catch (e) {
    /* retorno do erro em console */
    console.error("Error: Creating request ", e);
    /* retorno do erro em JSON */
    return res.status(500).send({
      status: "error",
      message: "Error creating request",
    });
  }
};

// Função para atualizar uma requisição
const updateRequest = async (req, res) => {
  let errors = [];

  // Id por params
  const { id } = req.params;
  // Body para criar elementos
  const { local, description, user, status, statusMessage, image } = req.body;

  if (!local || !image) {
    // Retorno de erro em JSON
    return res.status(400).send({
      status: "error",
      message: "Local and Image are required",
    });
  }

  try {
    // Requisição para o banco
    const request = await pool.query(
      "UPDATE requests SET local = $1, description = $2, user = $3, status = $4, statusMessage = $5, image = $6 WHERE id = $7 RETURNING *",
      [local, description, user, status, statusMessage, image, id]
    );
    // Resposta em JSON
    return res.status(200).send({
      status: "success",
      message: "Request updated",
      request: request.rows,
    });
  } catch (e) {
    // Retorno do erro em console
    console.error("Error: Updating request ", e);
    // Retorno do erro em JSON
    return res.status(500).send({
      status: "error",
      message: "Error updating request",
    });
  }
};

// Função para deletar uma requisição
const deleteRequest = async (req, res) => {
  /* id por params */
  const { id } = req.params;

  try {
    /* coleta requisição */
    const request = await pool.query("SELECT * FROM requests WHERE id = $1;", [
      id,
    ]);

    /* verifica se existe */
    if (!request) {
      return res.status(404).send({
        error: "Request not found",
      });
    } else {
      /* se existir, deleta */
      await pool.query("DELETE FROM requests WHERE id = $1;", [id]);

      return res.status(200).send({
        message: "Request deleted",
      });
    }
  } catch (e) {
    /* retorno do erro em JSON */
    return res.status(500).send({
      error: "Error: " + e,
      message: "Error in delete request",
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
};
