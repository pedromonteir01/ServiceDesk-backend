const { Router } = require('express');
const requestsController = require('../controllers/requestcontroller');
//inicializa a rota
const requestsRouter = Router();

//métodos
requestsRouter.get('/', requestsController.getAllRequests);
requestsRouter.get('/:id', requestsController.getRequestById);
requestsRouter.get('/local/:local', requestsController.getRequestByLocal);
requestsRouter.get('/status/:status', requestsController.getRequestByStatus);
requestsRouter.get('/user/:user', requestsController.getRequestByUser);
requestsRouter.post('/', requestsController.createRequest);
requestsRouter.put('/:id', requestsController.updateRequest);
requestsRouter.delete('/:id', requestsController.deleteRequest);

module.exports = requestsRouter;