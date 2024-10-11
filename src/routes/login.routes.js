const { Router } = require('express');
const { login, refresh } = require('../controllers/login.controller');

const loginRouter = Router();

loginRouter.post('/', login);
loginRouter.post('/refresh', refresh);

module.exports = loginRouter;
