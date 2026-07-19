const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const authorize = require('../middleware');
const { isReviewAuthor } = require('../middleware');
const reviewController = require('../controllers/review');

// Post Review Route
router.post('/', authorize, wrapAsync(reviewController.createReview));

// Delete Review Route
router.delete('/:reviewId', authorize, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
