const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const userController = require('../controllers/user');

// Google Auth Routes
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', failureFlash: true }),
    userController.googleCallback);

// Home Route
router.get('/', (req, res) => {
    res.render('hero');
});

// Signup Routes
router.route('/signup')
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

// Login Routes
router.route('/login')
    .get(userController.renderLoginForm)
    .post(passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), wrapAsync(userController.login));

// Logout Route
router.get('/logout', userController.logout);

module.exports = router;