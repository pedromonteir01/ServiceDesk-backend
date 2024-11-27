const { Router } = require("express");
const requestsController = require("../controllers/requests.controller");
const requestsRouter = Router();
const auth = require('../middlewares/auth');
const multer = require('multer');
const upload = multer(); // Configuração básica do multer para upload de arquivos

// métodos
requestsRouter.get("/", requestsController.getAllRequests);
requestsRouter.get("/locais", requestsController.getLocaisInstalacao);
requestsRouter.get("/:id", requestsController.getRequestById);
requestsRouter.get("/local/:local", requestsController.getRequestByLocal);
requestsRouter.get("/status/:status", requestsController.getRequestByStatus);
requestsRouter.get("/creation/:creation", requestsController.getRequestByCreation);
requestsRouter.get("/finish/:finish", requestsController.getRequestByFinish);
requestsRouter.get("/user/:email", requestsController.getRequestByUser);
requestsRouter.get("/priority/:priority", requestsController.getRequestsByPriority);
requestsRouter.post("/", auth, requestsController.createRequest); 
requestsRouter.put("/:id", auth, requestsController.updateRequest);
requestsRouter.delete("/:id", requestsController.deleteRequest);
requestsRouter.get("/title/:title", requestsController.filterRequestsByTitle);
requestsRouter.patch("/status/:id", requestsController.concludeStatus);

module.exports = requestsRouter;