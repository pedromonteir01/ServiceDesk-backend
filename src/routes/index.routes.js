const express = require('express');
const router = express.Router();
const requestRoute = require('./request.routes');
const userRoute = require('./user.routes');

router.use('/user', userRoute);
router.use('/request', requestRoute);

module.exports = router;