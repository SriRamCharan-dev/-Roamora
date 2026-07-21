const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const wrapAsync = require('../utils/wrapAsync');

// Home Route
router.get('/', (req, res) => {
    res.render('hero');
});

// Signup
router.get('/signup', userController.renderSignupForm);
router.post('/signup', wrapAsync(userController.signup));

// Login
router.get('/login', userController.renderLoginForm);
router.post('/login', wrapAsync(userController.login));

// Logout
router.get('/logout', userController.logout);
router.post('/logout', userController.logout);

module.exports = router;