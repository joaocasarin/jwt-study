const express = require('express');
const AuthUser = require('../middlewares/AuthUser');
const UserController = require('../controllers/UserController');
const router = express.Router();

const User = new UserController();

//CRUD - CREATE done   READ done   UPDATE done   DELETE done
router.post('/user/create', User.createUser);
router.patch('/user/update', User.updateUser);
router.delete('/user/delete', User.deleteUser);
router.get('/users', User.listAllUsers);
router.get('/auth', User.authenticateUser);
router.get('/me', AuthUser, User.currentUser);

module.exports = router;