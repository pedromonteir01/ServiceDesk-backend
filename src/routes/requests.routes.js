const { Router } = require("express");
const requestsController = require("../controllers/requests.controller");
const requestsRouter = Router();

//métodos
requestsRouter.get("/", requestsController.getAllRequests);
requestsRouter.get("/locais", requestsController.getLocaisInstalacao);
requestsRouter.get("/:id", requestsController.getRequestById);
requestsRouter.get("/local/:local", requestsController.getRequestByLocal);
requestsRouter.get("/status/:status", requestsController.getRequestByStatus);
requestsRouter.get("/user/:email", requestsController.getRequestByUser);
requestsRouter.post("/", requestsController.createRequest);
requestsRouter.put("/:id", requestsController.updateRequest);
requestsRouter.delete("/:id", requestsController.deleteRequest);
requestsRouter.get("/title/:title", requestsController.filterRequestsByTitle);
requestsRouter.patch("/status/:id", requestsController.concludeStatus);

module.exports = requestsRouter;
