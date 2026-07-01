const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', failureFlash: true }),
    function (req, res) {
        req.flash('success', 'Welcome back to Roamora!');
        res.redirect('/listings');
    });

router.get('/', (req, res) => {
    res.render('hero');
});

router.get('/signup', (req, res) => {
    res.render('users/signup');
});
router.post('/signup', wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        let registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.flash('success', 'Welcome to Roamora!');
        res.redirect('/listings');
    }
    catch (err) {
        req.flash('error', err.message);
        res.redirect('/signup');
    }

}));
router.get('/login', (req, res) => {
    res.render('users/login');
});
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash('success', 'Welcome back to Roamora!');
    res.redirect('/listings');
});

router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            req.flash('error', 'Something went wrong.');
            return res.redirect('/listings');
        }
        req.flash('success', 'You have been logged out.');
        res.redirect('/listings');
    });
});


module.exports = router;