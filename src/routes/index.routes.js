const { Router } = require('express');
const usersRouter = require('./users.routes');
const requestsRouter = require('./requests.routes');
const dataRouter = require('./getData.routes');
const loginRouter = require('./login.routes');

//rotas da aplicação
const router = Router();
router.get('/', (req, res) => {
    res.send('Em execução');
    });
router.use('/users', usersRouter);
router.use('/requests', requestsRouter);
router.use('/data', dataRouter);
router.use('/authenticate', loginRouter);

module.exports = router;