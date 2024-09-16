const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Request route');
});

module.exports = router;