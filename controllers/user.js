const User = require('../Models/user');
const { clerkClient } = require('@clerk/clerk-sdk-node');

// Sync Clerk user into MongoDB on first login
async function syncClerkUser(clerkId) {
    let user = await User.findOne({ clerkId });
    if (!user) {
        const clerkUser = await clerkClient.users.getUser(clerkId);
        const email = clerkUser.emailAddresses[0]?.emailAddress || '';
        const username = clerkUser.username || clerkUser.firstName || email.split('@')[0];
        user = new User({ clerkId, email, username });
        await user.save();
    }
    return user;
}

module.exports.renderAuthForm = (req, res) => {
    res.render('users/auth');
};

module.exports.logout = (req, res) => {
    res.redirect('/listings');
};