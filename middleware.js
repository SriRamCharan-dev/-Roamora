function authorize(req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in to create a new listing.');
        return res.redirect('/login');
    }
    next();
}

module.exports = authorize;