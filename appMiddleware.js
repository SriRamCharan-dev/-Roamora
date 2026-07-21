const User = require('./Models/user');

// Attach session user to res.locals
async function loadCurrentUser(req, res, next) {
    if (req.session && req.session.userId) {
        try {
            const user = await User.findById(req.session.userId);
            res.locals.currentUser = user || null;
        } catch (err) {
            console.error('Error fetching session user:', err.message);
            res.locals.currentUser = null;
        }
    } else {
        res.locals.currentUser = null;
    }
    next();
}

function authorize(req, res, next) {
    if (!req.session || !req.session.userId) {
        req.session = req.session || {};
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in first!');
        return res.redirect('/login');
    }
    next();
}

const Listing = require('./Models/listing');
const Review = require('./Models/review');

async function isListingOwner(req, res, next) {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate('owner');

    if (!listing) {
        req.flash('error', 'Listing not found!');
        return res.redirect('/listings');
    }

    if (!res.locals.currentUser || !listing.owner || !listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You do not have permission to edit/delete this listing!');
        return res.redirect(`/listings/${id}`);
    }
    next();
}

async function isReviewAuthor(req, res, next) {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId).populate('author');

    if (!review) {
        req.flash('error', 'Review not found!');
        return res.redirect(`/listings/${id}`);
    }

    if (!res.locals.currentUser || !review.author || !review.author._id.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You do not have permission to delete this review!');
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports = authorize;
module.exports.loadCurrentUser = loadCurrentUser;
module.exports.authorize = authorize;
module.exports.isListingOwner = isListingOwner;
module.exports.isReviewAuthor = isReviewAuthor;
