const { Router } = require('express');
const usersRouter = require('./users.routes');
const requestsRouter = require('./requests.routes');

//rotas da aplicação
const router = Router();
router.use('/users', usersRouter);
router.use('/requests', requestsRouter);

module.exports = router;