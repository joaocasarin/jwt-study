const express = require('express');
const AuthUser = require('../middlewares/AuthUser');
const UserController = require('../controllers/UserController');
const router = express.Router();

const User = new UserController();

router.post('/register', User.createUser);
router.get('/users', User.listAllUsers);
router.get('/auth', User.authenticateUser);
router.get('/me', AuthUser, User.currentUser);

module.exports = router;