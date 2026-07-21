const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

// Auth page (card login UI)
router.get('/login', userController.renderAuthForm);
router.get('/signup', userController.renderAuthForm);

// Logout - Clerk handles session clearing client-side, redirect home
router.get('/logout', userController.logout);

module.exports = router;