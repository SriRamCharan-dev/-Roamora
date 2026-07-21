module.exports.renderAuthForm = (req, res) => {
    res.render('users/auth');
};

module.exports.logout = (req, res) => {
    res.redirect('/listings');
};
