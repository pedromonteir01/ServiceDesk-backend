const pool = require("../database/database.config");

// Função para pegar todas as requisições
const getAllRequests = async function(req, res) {
  try {
    // Requisição para o banco
    const result = await pool.query("SELECT * FROM requests");
    // Resposta em JSON
    res.json({
      status: "success",
      message: "Requests List",
      quantity: result.rowCount,
      requests: result.rows,
    });
  } catch (error) {
    // Retorno do erro em JSON
    console.error("Error: Getting all requests ", error);
    // Retorno do erro em JSON
    res.status(500).send({
      status: "error",
      message: "Error getting all requests",
    });
  }
}

// Função para pegar uma requisição por id
const getRequestById = async function(req, res) {
  try {
    // Id por params
    const { id } = req.params;
    // Requisição para o banco
    const result = await pool.query("SELECT * FROM requests WHERE id = $1", [
      id,
    ]);
    if (result.rowCount === 0) {
    // Retorno de erro em JSON
      res.json({
        status: "error",
        message: `Request with id ${id} not found`,
      });
    }
    // Resposta em JSON
    res.json({
      status: "success",
      message: `Request with id ${id}`,
      request: result.rows,
    });
    // Tratamento de erro
  } catch (error) {
    // Retorno do erro em console
    console.error("Error: Getting request by id ", error);
    // Retorno do erro em JSON
    res.status(500).send({
      status: "error",
      message: "Error getting request by id",
    });
  }
}

// Função para pegar uma requisição por ambiente/local
const getRequestByLocal = async function(req, res) {
  try {
    // Local por params
    const { local } = req.params;
    // Requisição para o banco
    const result = await pool.query(
      "SELECT * FROM requests WHERE LOWER(local) LIKE $1",
      [`%${local.toLowerCase()}%`]
    );
    if (result.rowCount === 0) {
      // Retorno de erro em JSON
      res.json({
        status: "error",
        message: `Request with local ${local} not found`,
      });
    }
    // Resposta de sucesso em JSON
    res.json({
      status: "success",
      message: `Request with local ${local}`,
      request: result.rows,
    });
    // Tratamento de erro
  } catch (error) {
    // Retorno do erro em console
    console.error("Error: Getting request by local ", error);
    // Retorno do erro em JSON
    res.status(500).send({
      status: "error",
      message: "Error getting request by local",
    });
  }
}

// Função para pegar uma requisição por status
const getRequestByStatus = async function (req, res) {
  try {
    // Status por params
    const { status } = req.params;
    // Requisição para o banco
    const result = await pool.query(
      "SELECT * FROM requests WHERE status = $1",
      [status]
    );
    if (result.rowCount === 0) {
      // Retorno de erro em JSON
      res.json({
        status: "error",
        message: `Request with status ${status} not found`,
      });
    }
    // Resposta de sucesso em JSON
    res.json({
      status: "success",
      message: `Request with status ${status}`,
      request: result.rows,
    });
    // Tratamento de erro
  } catch (error) {
    console.error("Error: Getting request by status ", error);
    // Retorno do erro em JSON
    res.status(500).send({
      status: "error",
      message: "Error getting request by status",
    });
  }
}

// Função para pegar uma requisição por usuário
const getRequestByUser = async function (req, res) {
  try {
    // Usuário por params
    const { user } = req.params;
    // Requisição para o banco
    const result = await pool.query("SELECT * FROM requests WHERE user = $1", [
      user,
    ]);
    if (result.rowCount === 0) {
      // Retorno de erro em JSON
      res.json({
        status: "error",
        message: `Request with user ${user} not found`,
      });
    }
    // Resposta de sucesso em JSON
    res.json({
      status: "success",
      message: `Request with user ${user}`,
      request: result.rows,
    });
    // Tratamento de erro
  } catch (error) {
    // Retorno do erro em console
    console.error("Error: Getting request by user ", error);
    // Retorno do erro em JSON
    res.status(500).send({
      status: "error",
      message: "Error getting request by user",
    });
  }
}

// Função para criar uma requisição
const createRequest= async function (req, res) {
  // Dados da requisição
  const { local, description, user, status, statusMessage, image } = req.body;
  try {
    // Verificação de campos
    if (!local || !image) {
      // Retorno de erro em JSON
      return res.status(400).send({
        status: "error",
        message: "Local and Image are required",
      });
    }
    // Requisição para o banco
    const result = await pool.query(
      "INSERT INTO requests (local, description, user, status, statusMessage, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [local, description, user, status, statusMessage, image]
    );
    // Resposta de sucesso em JSON
    res.json({
      status: "success",
      message: "Request created",
      request: result.rows,
    });
    // Tratamento de erro
  } catch (error) {
    // Retorno do erro em console
    console.error("Error: Creating request ", error);
    // Retorno do erro em JSON
    res.status(500).send({
      status: "error",
      message: "Error creating request",
    });
  }
}

// Função para atualizar uma requisição
const updateRequest = async function (req, res) {
  try {
    // Id por params
    const { id } = req.params;
    // Dados da requisição
    const { local, description, user, status, statusMessage, image } = req.body;
    if (!local || !image) {0
      // Retorno de erro em JSON
      return res.status(400).send({
        status: "error",
        message: "Local and Image are required",
      });
    }
    // Requisição para o banco
    const result = await pool.query(
      "UPDATE requests SET local = $1, description = $2, user = $3, status = $4, statusMessage = $5, image = $6 WHERE id = $7 RETURNING *",
      [local, description, user, status, statusMessage, image, id]
    );
    if (result.rowCount === 0) {
      // Resposta de erro em JSON
      res.json({
        status: "error",
        message: `Request with id ${id} not found`,
      });
    }
    // Resposta de sucesso em JSON
    res.json({
      status: "success",
      message: `Request with id ${id} updated`,
      request: result.rows,
    });
    // Tratamento de erro
  } catch (error) {
    // Retorno do erro em console
    console.error("Error: Updating request ", error);
    // Retorno do erro em JSON
    res.status(500).send({
      status: "error",
      message: "Error updating request",
    });
  }
}

// Função para deletar uma requisição
const deleteRequest = async function (req, res) {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM requests WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      res.json({
        status: "error",
        message: `Request with id ${id} not found`,
      });
    }
    res.json({
      status: "success",
      message: `Request with id ${id} deleted`,
    });
  } catch (error) {
    console.error("Error: Deleting request ", error);
    res.status(500).send({
      status: "error",
      message: "Error deleting request",
    });
  }
}

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
