function authorize(req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in to create a new listing.');
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login');
    }
    next();
}

const Listing = require('./Models/listing');
const Review = require('./Models/review');

async function isListingOwner(req, res, next) {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate('owner', '_id');

    if (!listing) {
        req.flash('error', 'Listing you requested for does not exist!');
        return res.redirect('/listings');
    }

    if (!listing.owner || !req.user || !listing.owner._id.equals(req.user._id)) {
        req.flash('error', 'You are not allowed to modify this listing.');
        return res.redirect(`/listings/${id}`);
    }

    next();
}

async function isReviewAuthor(req, res, next) {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash('error', 'Review not found.');
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author || !req.user || !review.author.equals(req.user._id)) {
        req.flash('error', 'You are not allowed to delete this review.');
        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports = authorize;
module.exports.isListingOwner = isListingOwner;
module.exports.isReviewAuthor = isReviewAuthor;