const pool = require("../database/database.config");
const { verifyEmail } = require("../models/verifysFunctions/verifyElements");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const special = ["!", "@", "#", "$", "%", "&", "*", "(", ")", "/", "?", "|"];
const number = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const upper = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const lower = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

const getAllUsers = async (req, res) => {
  try {
    //requisição para o banco
    const users = await pool.query("SELECT * FROM users;");
    //resposta em JSON
    if (users.rowCount == 0) {
      return res.status(200).send({
        success: "none_users",
      });
    } else {
      return res.status(200).send({
        results: users.rowCount,
        users: users.rows,
      });
    }
  } catch (e) {
    //retorno do erro em JSON
    return res.status(500).send({
      error: "Error: " + e,
    });
  }
};

const getUsersByName = async (req, res) => {
  //name por params
  const { name } = req.params;
  try {
    //requisição para o banco
    const users = await pool.query("SELECT * FROM users WHERE name LIKE $1;", [
      `%${name.toLowerCase()}%`,
    ]);
    //resposta em JSON
    if (users) {
      return res.status(200).send({
        results: users.rowCount,
        users: users.rows,
      });
    } else {
      return res.status(404).send({
        error: "404, Users not found with this name",
      });
    }
  } catch (e) {
    //retorno do erro em JSON
    return res.status(500).send({
      error: "Error: " + e,
      error: "Error in get user: " + email,
    });
  }
};

const getUserByEmail = async (req, res) => {
  //email por params
  const { email } = req.params;
  try {
    //requisição para o banco
    const user = await pool.query("SELECT * FROM users WHERE email=$1;", [
      email,
    ]);
    //resposta em JSON
    if (user) {
      return res.status(200).send(user.rows[0]);
    } else {
      return res.status(404).send({
        error: 404,
        error: "User not found: " + email,
      });
    }
  } catch (e) {
    //retorno do erro em JSON
    return res.status(500).send({
      error: "Error: " + e,
      error: "Error in get user: " + email,
    });
  }
};

const getUserByRole = async (req, res) => {
  //função por params
  const { role } = req.params;
  let occupation;

  if (role == "student") {
    occupation = true;
  } else {
    occupation = false;
  }

  try {
    //requisição para o banco
    const users = await pool.query("SELECT * FROM users WHERE isStudent=$1;", [
      occupation,
    ]);
    //resposta em JSON
    if (users.rowCount !== 0) {
      return res.status(200).send({
        users: users.rows,
      });
    } else {
      return res.status(404).send({
        error: 404,
        error: "Users not found",
      });
    }
  } catch (e) {
    //retorno do erro em JSON
    return res.status(500).send({
      error: "Error: " + e,
      error: "Error in get user: " + email,
    });
  }
};

const createUser = async (req, res) => {
  let errors = [];

  //body para criar elementos
  const { name, email, password, isAdmin, isStudent } = req.body;

  if (!name || !email || !password || !isAdmin || !isStudent) {
    return false;
  }

  if (typeof name !== "string") {
    errors.push("nome_inválido");
  } else if (name.length < 3) {
    errors.push("nome_curto_demais");
  }

  if (typeof email !== "string") {
    errors.push("email_inválido");
  } else if (email.length < 10) {
    errors.push("email_inválido");
  } else if (
    !verifyEmail(email, "sp.senai.br") &&
    !verifyEmail(email, "aluno.senai.br") &&
    !verifyEmail(email, "docente.senai.br")
  ) {
    errors.push("domínio_inválido");
  }

  if (password.length < 8) {
    errors.push("senha_deve_ter_8_no_mínimo_caracteres");
  } else if (password.split("").includes(special)) {
    errors.push("senha_deve_ter_caracteres_especiais");
  } else if (password.split("").includes(number)) {
    errors.push("senha_deve_ter_caracteres_numericos");
  } else if (password.split("").includes(upper)) {
    errors.push("senha_deve_ter_caracteres_maiusculos");
  } else if (password.split("").includes(lower)) {
    errors.push("senha_deve_ter_caracteres_minusculos");
  }

  let statusAdmin;
  switch (isAdmin) {
    case "admin":
      statusAdmin = true;
      break;
    case "user":
      statusAdmin = false;
      break;
    default:
      errors.push("status_inválido");
      break;
  }

  let role;
  switch (isStudent) {
    case "student":
      role = true;
      break;
    case "educator":
      role = false;
      break;
    default:
      errors.push("cargo_inválido");
      break;
  }

  const user = (await pool.query("SELECT * FROM users WHERE email=$1", [email]))
    .rows[0];

  if (user) {
    return res
      .status(400)
      .send({ error: "usuário com este email já está cadastrado" });
  }

  if (errors.length !== 0) {
    return res.status(400).send({ errors });
  } else {
    try {
      const hash = await bcrypt.hash(password, 10);
      //requisição para o banco
      await pool.query(
        "INSERT INTO users(name, email, password, isAdmin, isStudent) VALUES($1, $2, $3, $4, $5);",
        [name, email, hash, statusAdmin, role]
      );
      //resposta em JSON
      return res.status(201).send({
        success: "registered with success",
      });
    } catch (e) {
      //retorno do erro em JSON
      return res.status(500).json({
        error: e,
        error: "Error in post user",
      });
    }
  }
};

const updateUser = async (req, res) => {
  let errors = [];

  //email por params
  const { emailAux } = req.params;

  //body para criar elementos
  const { name, email, password, isAdmin, isStudent } = req.body;

  if (!name || !email || !password || !isAdmin || !isStudent || !emailAux) {
    return false;
  }

  if (typeof name !== "string") {
    errors.push("nome_inválido");
  } else if (name.length < 3) {
    errors.push("nome_curto_demais");
  }

  if (typeof email !== "string") {
    errors.push("email_inválido");
  } else if (email.length < 10) {
    errors.push("email_inválido");
  } else if (
    !verifyEmail(email, "sp.senai.br") ||
    !verifyEmail(email, "aluno.senai.br")
  ) {
    errors.push("domínio_inválido");
  }

  if (password.length < 8) {
    errors.push("senha_deve_ter_8_no_mínimo_caracteres");
  } else if (password.split("").includes(special)) {
    errors.push("senha_deve_ter_caracteres_especiais");
  }

  let statusAdmin;
  switch (isAdmin) {
    case "admin":
      statusAdmin = true;
      break;
    case "user":
      statusAdmin = false;
    default:
      errors.push("status_inválido");
      break;
  }

  let role;
  switch (isStudent) {
    case "student":
      role = true;
      break;
    case "educator":
      role = false;
      break;
    default:
      errors.push("cargo_inválido");
      break;
  }

  if (errors.length !== 0) {
    return res.status(400).send({
      errors: errors,
    });
  } else {
    try {
      //requisição para o banco
      await pool.query(
        "UPDATE users SET name=$1, email=$2, isAdmin=$3, isStudent=$4 WHERE email=$5;",
        [name, email, statusAdmin, role, emailAux]
      );

      //resposta em JSON
      return res.status(200).send({
        success: "updated with success",
      });
    } catch (e) {
      //retorno do erro em JSON
      return res.status(500).send({
        error: "Error: " + e,
        error: "Error in post user",
      });
    }
  }
};

const deleteUser = async (req, res) => {
  //email por params
  const { email } = req.params;

  try {
    //coleta usuário
    const user = await pool.query("SELECT * FROM users WHERE email=$1;", [
      email,
    ]);

    //verifica se existe
    if (!user) {
      return res.status(404).send({
        error: "user not found",
      });
    } else {
      //se existir, deleta
      await pool.query("DELETE FROM users WHERE email=$1;", [email]);

      return res.status(200).send({
        success: "user deleted",
      });
    }
  } catch (e) {
    //retorno do erro em JSON
    return res.status(500).send({
      error: "Error: " + e,
      error: "Error in delete user",
    });
  }
};

//função de alterar senha
const changePassword = async (req, res) => {
  let errors = [];

  // Input validation
  const { email } = req.params;
  const { password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  if (password.length < 8) {
    errors.push("Senha deve ter pelo menos 8 caracteres");
  }

  if (password !== confirmPassword) {
    errors.push("Senhas não coincidem");
  }

  // Check if user exists
  const user = await pool.query("SELECT * FROM users WHERE email=$1;", [email]);

  if (user.rows.length === 0) {
    return res.status(404).send({ error: "Usuário não encontrado" });
  }

  // Generate reset token
  const now = new Date();

  // Check if token is expired
  const userToken = (
    await pool.query(
      "SELECT * FROM refreshtoken WHERE email=$1 AND expires > $2",
      [email, now]
    )
  ).rows[0];
  if (!userToken) {
    return res.status(401).send({ error: "Token expirado ou inválido" });
  }
  // Update user password
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query("UPDATE users SET password=$1 WHERE email=$2;", [
    hashedPassword,
    email,
  ]);

  return res.status(200).send({ success: "Senha alterada com sucesso" });
};

module.exports = {
  getAllUsers,
  getUsersByName,
  getUserByEmail,
  getUserByRole,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
};
