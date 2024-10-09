const { Router } = require('express');
const { login, refresh } = require('../controllers/login.controller');
const auth = require('../middlewares/auth');

const loginRouter = Router();

loginRouter.post('/', login);
loginRouter.post('/refresh', auth, refresh);

module.exports = loginRouter;