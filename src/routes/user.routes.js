const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usercontroller");

router.get("/user", usersController.getAllUsers);
router.post("/user", usersController.createUser);
router.put("/user/:email", usersController.updateUser);
router.get("/user/:name", usersController.getUserByName);
router.get("/user/:email", usersController.getUserByEmail);
router.delete("/user/:email", usersController.deleteUser);

module.exports = router;
