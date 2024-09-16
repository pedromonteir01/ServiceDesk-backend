const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");

router.get("/", usersController.getAllUsers);
router.post("/", usersController.createUser);
router.put("/:email", usersController.updateUser);
router.get("/:name", usersController.getUserByName);
router.get("/:email", usersController.getUserByEmail);
router.delete("/:email", usersController.deleteUser);

module.exports = router;
