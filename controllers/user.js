const User = require('../Models/user');

module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup');
};

module.exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        let registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.login(registeredUser, function (err) {
            if (err) {
                req.flash('error', 'Something went wrong.');
                return res.redirect('/signup');
            }
            req.flash('success', 'Welcome to Roamora!');
            const redirectUrl = req.session.returnTo || '/listings';
            delete req.session.returnTo;
            res.redirect(redirectUrl);
        });
    }
    catch (err) {
        req.flash('error', err.message);
        res.redirect('/signup');
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
};

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome back to Roamora!');
    const redirectUrl = req.session.returnTo || '/listings';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            req.flash('error', 'Something went wrong.');
            return res.redirect('/listings');
        }
        req.flash('success', 'You have been logged out.');
        res.redirect('/listings');
    });
};

module.exports.googleCallback = (req, res) => {
    req.flash('success', 'Welcome back to Roamora!');
    const redirectUrl = req.session.returnTo || '/listings';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};