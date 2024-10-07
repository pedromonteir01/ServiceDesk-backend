const { Router } = require('express');
const getDataController = require('../controllers/data.controller');

const dataRouter = Router();

dataRouter.get('/', getDataController.getLocalsWithRequests);

module.exports = dataRouter;