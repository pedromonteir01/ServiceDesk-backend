const { Router } = require('express');
const { getLocalsWithRequests, getDataFromRequests, } = require('../controllers/data.controller');

const dataRouter = Router();

dataRouter.get('/', getLocalsWithRequests);
dataRouter.get('/requests_data', getDataFromRequests);

module.exports = dataRouter;