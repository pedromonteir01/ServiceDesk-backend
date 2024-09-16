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

async function getRequestByStatus(req, res) {
  try {
    const { status } = req.params;
    const result = await pool.query(
      "SELECT * FROM requests WHERE status = $1",
      [status]
    );
    if (result.rowCount === 0) {
      res.json({
        status: "error",
        message: `Request with status ${status} not found`,
      });
    }
    res.json({
      status: "success",
      message: `Request with status ${status}`,
      request: result.rows,
    });
  } catch (error) {
    console.error("Error: Getting request by status ", error);
    res.status(500).send({
      status: "error",
      message: "Error getting request by status",
    });
  }
}

async function getRequestByUser(req, res) {
  try {
    const { user } = req.params;
    const result = await pool.query("SELECT * FROM requests WHERE user = $1", [
      user,
    ]);
    if (result.rowCount === 0) {
      res.json({
        status: "error",
        message: `Request with user ${user} not found`,
      });
    }
    res.json({
      status: "success",
      message: `Request with user ${user}`,
      request: result.rows,
    });
  } catch (error) {
    console.error("Error: Getting request by user ", error);
    res.status(500).send({
      status: "error",
      message: "Error getting request by user",
    });
  }
}

async function createRequest(req, res) {
  const { local, description, user, status, statusMessage, image } = req.body;
  try {
    if (!local || !image) {
      return res.status(400).send({
        status: "error",
        message: "Local and Image are required",
      });
    }
    const result = await pool.query(
      "INSERT INTO requests (local, description, user, status, statusMessage, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [local, description, user, status, statusMessage, image]
    );
    res.json({
      status: "success",
      message: "Request created",
      request: result.rows,
    });
  } catch (error) {
    console.error("Error: Creating request ", error);
    res.status(500).send({
      status: "error",
      message: "Error creating request",
    });
  }
}

async function updateRequest(req, res) {
  try {
    const { id } = req.params;
    const { local, description, user, status, statusMessage, image } = req.body;
    if (!local || !image) {
      return res.status(400).send({
        status: "error",
        message: "Local and Image are required",
      });
    }
    const result = await pool.query(
      "UPDATE requests SET local = $1, description = $2, user = $3, status = $4, statusMessage = $5, image = $6 WHERE id = $7 RETURNING *",
      [local, description, user, status, statusMessage, image, id]
    );
    if (result.rowCount === 0) {
      res.json({
        status: "error",
        message: `Request with id ${id} not found`,
      });
    }
    res.json({
      status: "success",
      message: `Request with id ${id} updated`,
      request: result.rows,
    });
  } catch (error) {
    console.error("Error: Updating request ", error);
    res.status(500).send({
      status: "error",
      message: "Error updating request",
    });
  }
}

async function deleteRequest(req, res) {
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
