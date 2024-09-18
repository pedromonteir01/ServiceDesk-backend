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
        request: request.rows[0],
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

  /* verifica se os campos obrigatórios estão preenchidos */

  switch (title) {
    case typeof title != 'string':
      errors.push('invalid_name');
      break;
    case title.length < 6:
      errors.push('short_name');
      break;
    default:
      break;
  }

  switch (description) {
    case typeof description !== 'string':
      errors.push('description_type_invalid');
      break;
    case description.length < 10:
      errors.push('short_description');
      break;
    default:
      break;
  }

  let statusRequest;
  switch (status_request) {
    case 'conclued':
      statusRequest = true;
      break;
    case 'inconclued':
      statusRequest = false;
      break;
    default:
      errors.push('invalid_status');
      break;
  }

  switch (date_request) {
    case JSON.stringify(date_request).length != 10:
      errors.push('invalid_date_length');
      break;
    case typeof date_request != 'object':
      errors.push('invalid_date_type');
      break;
    default:
      break;
  }

  let dateConclusion;
  if (!date_conclusion) {
    dateConclusion = null;
  } else {
    errors.push('logic_error');
  }

  switch (email) {
    case typeof email !== 'string':
      errors.push('invalid_email');
      break;
    case email.length < 10:
      errors.push('short_email');
      break;
    case !email.includes('@') || !email.includes('sp.senai.br') || !email.includes('aluno.senai.br'):
      errors.push('invalid_domain');
      break;
    default:
      break;
  }


  if (errors.length !== 0) {
    return res.status(400).send({
      errors: errors
    });
  } else {



    try {
      /* requisição para o banco */
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
          title
        ]
      );
      /* resposta em JSON */
      return res.status(201).send({
        status: "success",
        message: "Request created"
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
  }
};

// Função para atualizar uma requisição
const updateRequest = async (req, res) => {
  let errors = [];

  // Id por params
  const { id } = req.params;
  // Body para criar elementos
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

  // Verifica se os campos obrigatórios estão preenchidos

  switch (title) {
    case typeof title != 'string':
      errors.push('invalid_name');
      break;
    case title.length < 6:
      errors.push('short_name');
      break;
    default:
      break;
  }

  switch (description) {
    case typeof description !== 'string':
      errors.push('description_type_invalid');
      break;
    case description.length < 10:
      errors.push('short_description');
      break;
    default:
      break;
  }

  let statusRequest;
  switch (status_request) {
    case 'conclued':
      statusRequest = true;
      break;
    case 'inconclued':
      statusRequest = false;
      break;
    default:
      errors.push('invalid_status');
      break;
  }

  switch (date_request) {
    case JSON.stringify(date_request).length != 10:
      errors.push('invalid_date_length');
      break;
    case typeof date_request != 'object':
      errors.push('invalid_date_type');
      break;
    default:
      break;
  }

  let dateConclusion;
  if (!date_conclusion) {
    dateConclusion = null;
  } else {
    errors.push('logic_error');
  }

  switch (email) {
    case typeof email !== 'string':
      errors.push('invalid_email');
      break;
    case email.length < 10:
      errors.push('short_email');
      break;
    case !email.includes('@') || !email.includes('sp.senai.br') || !email.includes('aluno.senai.br'):
      errors.push('invalid_domain');
      break;
    default:
      break;
  }

  if (errors.length !== 0) {
    return res.status(400).send({
      errors: errors
    });
  } else {

    try {
      // Requisição para o banco
      await pool.query(
        "UPDATE requests SET image = $1, description = $2, local = $3, status_request = $4, date_request = $5, date_conclusion = $6, email = $7, name = $9 WHERE id = $8;",
        [
          image,
          description,
          local,
          statusRequest,
          date_request,
          dateConclusion,
          email,
          id,
          title
        ]
      );
      // Resposta em JSON
      return res.status(200).send({
        status: "success",
        message: "Request updated"
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
}

const concludeStatus = async(req, res) => {
  //id por params
  const { id } = req.params;
  const { status } = req.body;

  try {
    const request = (await pool.query('SELECT * FROM requests WHERE id=$1',[id])).rows;
    if(!request) {
      return res.status(404).send({ message: 'request not found' });
    } else {
      await pool.query('UPDATE users SET status_request=$1 WHERE id=$2', [status, id]);
      return res.status(200).send({ message: 'request conclued' });
    }
  } catch(e) {
    return res.status(500).send({ error: e, message: 'server error' });
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
  concludeStatus
};
