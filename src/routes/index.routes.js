const express = require('express');
const router = express.Router();
const requestRoute = require('./request.routes')
const userRoute = require('./user.routes')

router.get('/', (req, res) => {
    res.send('Server On!');
}
);

router.use('/user', userRoute)
router.use('/request', requestRoute)