const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController');

router.post('/user', usersController.createUser);
router.get('/user', usersController.getUser);
router.get('/user/:name', usersController.getUserByName);
router.get('/user/:email', usersController.getUserByEmail);
router.delete('/user/:email', usersController.deleteUser);

module.exports = router;