const { Router } = require('express');
const login = require('../controllers/login.controller');

const loginRouter = Router();

loginRouter.get('/', login);

module.exports = loginRouter;