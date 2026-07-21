const User = require('./Models/user');
const { clerkClient } = require('@clerk/express');

// Attach Clerk auth info and sync MongoDB user to res.locals
async function clerkAuthMiddleware(req, res, next) {
    const clerkId = req.auth?.userId;
    if (clerkId) {
        try {
            // Try to find user by clerkId first
            let user = await User.findOne({ clerkId });
            if (!user) {
                // Fetch Clerk user info
                const clerkUser = await clerkClient.users.getUser(clerkId);
                const email = clerkUser.emailAddresses[0]?.emailAddress || '';
                const username = clerkUser.username || clerkUser.firstName || email.split('@')[0];
                // Try to find existing user by email to avoid duplicate key error
                user = await User.findOne({ email });
                if (!user) {
                    user = new User({ clerkId, email, username });
                    await user.save();
                } else {
                    // Existing user found by email, associate clerkId
                    user.clerkId = clerkId;
                    await user.save();
                }
            }
            res.locals.currentUser = user;
        } catch (err) {
            console.error('Clerk user sync error:', err.message);
            res.locals.currentUser = null;
        }
    } else {
        res.locals.currentUser = null;
    }
    next();
}

function authorize(req, res, next) {
    if (!req.auth?.userId) {
        req.session = req.session || {};
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login');
    }
    next();
}

const Listing = require('./Models/listing');
const Review = require('./Models/review');

async function isListingOwner(req, res, next) {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate('owner', '_id clerkId');

    if (!listing) {
        return res.redirect('/listings');
    }

    const clerkId = req.auth?.userId;
    if (!listing.owner || !clerkId || listing.owner.clerkId !== clerkId) {
        return res.redirect(`/listings/${id}`);
    }
    next();
}

async function isReviewAuthor(req, res, next) {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId).populate('author', '_id clerkId');

    if (!review) {
        return res.redirect(`/listings/${id}`);
    }

    const clerkId = req.auth?.userId;
    if (!review.author || !clerkId || review.author.clerkId !== clerkId) {
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports = authorize;
module.exports.clerkAuthMiddleware = clerkAuthMiddleware;
module.exports.authorize = authorize;
module.exports.isListingOwner = isListingOwner;
module.exports.isReviewAuthor = isReviewAuthor;
