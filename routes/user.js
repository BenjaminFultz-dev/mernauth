const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const passport = require('passport');
const passportConfig = require('../passport');




router.post('/register', userController.registerNewUser);

router.post('/login', passport.authenticate('local', { session: false }), userController.login);

router.get('/logout', passport.authenticate('jwt', { session: false }), userController.logout);

router.post('/todo', passport.authenticate('jwt', { session: false }), userController.createTodo);

router.get('/todos', passport.authenticate('jwt', { session: false }), userController.getTodos);

router.get('/admin', passport.authenticate('jwt', { session: false }), userController.admin);

router.get('/authenticated', passport.authenticate('jwt', { session: false }), userController.authentication);






module.exports = router;
