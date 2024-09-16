const { Router } = require('express');
const usersController = require("../controllers/users.controller");

const usersRouter = Router();

usersRouter.get("/", usersController.getAllUsers);
usersRouter.post("/", usersController.createUser);
usersRouter.put("/:email", usersController.updateUser);
usersRouter.get("/name/:name", usersController.getUsersByName);
usersRouter.get("/:email", usersController.getUserByEmail);
usersRouter.delete("/:email", usersController.deleteUser);
router.get("/", usersController.getAllUsers);
router.post("/", usersController.createUser);
router.put("/:email", usersController.updateUser);
router.get("/:name", usersController.getUserByName);
router.get("/:email", usersController.getUserByEmail);
router.delete("/:email", usersController.deleteUser);

module.exports = usersRouter;
