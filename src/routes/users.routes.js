const { Router } = require('express');
const usersController = require("../controllers/users.controller");
//inicializa a rota
const usersRouter = Router();

//métodos
usersRouter.get("/", usersController.getAllUsers);
usersRouter.get("/name/:name", usersController.getUsersByName);
usersRouter.get("/:email", usersController.getUserByEmail);
usersRouter.get("/role/:role", usersController.getUserByRole);
usersRouter.post("/", usersController.createUser);
usersRouter.put("/:email", usersController.updateUser);
usersRouter.delete("/:email", usersController.deleteUser);

module.exports = usersRouter;
