const pool = require("../database/database.config");

async function getAllUsers(req, res) {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json({
      status: "success",
      message: "Users List",
      quantity: result.rowCount,
      users: result.rows,
    });
  } catch (error) {
    console.error("Error: Getting all users ", error);
    res.status(500).send({
      status: "error",
      message: "Error getting all users",
    });
  }
}

async function getUserByName(req, res) {
  try {
    const { name } = req.params;
    const result = await pool.query(
      "SELECT * FROM users WHERE LOWER(name) LIKE $1",
      [`%${name.toLowerCase()}%`]
    );
    if (result.rowCount === 0) {
      res.json({
        status: "error",
        message: `User with name ${name} not found`,
      });
    }
    res.json({
      status: "success",
      message: `User with name ${name}`,
      user: result.rows,
    });
  } catch (error) {
    console.error("Error: Getting user by name ", error);
    res.status(500).send({
      status: "error",
      message: "Error getting user by name",
    });
  }
}

async function getUserByEmail(req, res) {
  try {
    const { email } = req.params;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rowCount === 0) {
      res.json({
        status: "error",
        message: `User with email ${email} not found`,
      });
    }
    res.json({
      status: "success",
      message: `User with email ${email}`,
      user: result.rows,
    });
  } catch (error) {
    console.error("Error: Getting user by email ", error);
    res.status(500).send({
      status: "error",
      message: "Error getting user by email",
    });
  }
}

async function createUser(req, res) {
  const { name, email, password, cellphone } = req.body;
  try {
    if (name.length < 5) {
      res.json({
        status: "error",
        message: "Name must be at least 5 characters long",
      });
      return;
    }
    if (password.length < 8) {
      res.json({
        status: "error",
        message: "Password must be at least 8 characters long",
      });
      return;
    }
    if (cellphone.length !== 11) {
      res.json({
        status: "error",
        message: "Cellphone must be at least 10 characters long",
      });
      return;
    }
    const result = await pool.query(
      "INSERT INTO users (name, email, password, cellphone) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, password, cellphone]
    );
    res.json({
      status: "success",
      message: "User created",
      user: result.rows,
    });
  } catch (error) {
    console.error("Error: Creating user ", error);
    res.status(500).send({
      status: "error",
      message: "Error creating user",
    });
  }
}

async function updateUser(req, res) {
  try {
    const { name, email, password, cellphone } = req.body;
    const { id } = req.params;
    if (name.length < 5) {
      res.json({
        status: "error",
        message: "Name must be at least 5 characters long",
      });
      return;
    }
    if (password.length < 8) {
      res.json({
        status: "error",
        message: "Password must be at least 8 characters long",
      });
      return;
    }
    if (cellphone.length !== 11) {
      res.json({
        status: "error",
        message: "Cellphone must be at least 10 characters long",
      });
      return;
    }
    await pool.query(
      "UPDATE users SET name = $1, email = $2, password = $3, cellphone = $4 WHERE id = $5",
      [name, email, password, cellphone, id]
    );
  } catch (error) {
    console.error("Error: Updating user ", error);
    res.status(500).send({
      status: "error",
      message: "Error updating user",
    });
  }
}

async function deleteUser(req, res) {
  try {
    const { email } = req.params;
    const result = await pool.query("DELETE FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rowCount === 0) {
      res.json({
        status: "error",
        message: `User with email ${email} not found`,
      });
    }
    res.json({
      status: "success",
      message: `User with email ${email} deleted`,
    });
  } catch (error) {
    console.error("Error: Deleting user ", error);
    res.status(500).send({
      status: "error",
      message: "Error deleting user",
    });
  }
}

module.exports = {
  getAllUsers,
  getUserByName,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
};
