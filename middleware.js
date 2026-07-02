function authorize(req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in to create a new listing.');
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login');
    }
    next();
}

module.exports = authorize;