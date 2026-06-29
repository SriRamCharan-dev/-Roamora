const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const reviewController = require('../controllers/review');

// Post Review Route
router.post('/', wrapAsync(reviewController.createReview));

// Delete Review Route
router.delete('/:reviewId', wrapAsync(reviewController.destroyReview));

module.exports = router;
