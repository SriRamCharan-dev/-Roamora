const User = require('../Models/user');
const crypto = require('crypto');

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return { salt, hash };
}

function verifyPassword(password, salt, hash) {
    const checkHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return checkHash === hash;
}

module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup');
};

module.exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            req.flash('error', 'All fields are required!');
            return res.redirect('/signup');
        }

        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim().toLowerCase();

        // Check if username or email is taken
        const existingUser = await User.findOne({
            $or: [{ username: trimmedUsername }, { email: trimmedEmail }]
        });

        if (existingUser) {
            if (existingUser.username.toLowerCase() === trimmedUsername.toLowerCase()) {
                req.flash('error', 'Username is already taken!');
            } else {
                req.flash('error', 'Email is already registered!');
            }
            return res.redirect('/signup');
        }

        const { salt, hash } = hashPassword(password);
        const newUser = new User({
            username: trimmedUsername,
            email: trimmedEmail,
            passwordHash: hash,
            salt
        });

        await newUser.save();
        req.session.userId = newUser._id;
        req.flash('success', `Welcome to Roamora, ${newUser.username}!`);

        const redirectUrl = req.session.returnTo || '/listings';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/signup');
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
};

module.exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            req.flash('error', 'Please enter both username/email and password.');
            return res.redirect('/login');
        }

        const input = username.trim();
        const user = await User.findOne({
            $or: [{ username: input }, { email: input.toLowerCase() }]
        });

        if (!user || !verifyPassword(password, user.salt, user.passwordHash)) {
            req.flash('error', 'Invalid username/email or password.');
            return res.redirect('/login');
        }

        req.session.userId = user._id;
        req.flash('success', `Welcome back, ${user.username}!`);

        const redirectUrl = req.session.returnTo || '/listings';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/login');
    }
};

module.exports.logout = (req, res) => {
    req.session.userId = null;
    req.session.destroy(() => {
        res.redirect('/listings');
    });
};
