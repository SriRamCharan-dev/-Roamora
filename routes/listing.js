const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const authorize = require('../middleware');
const { isListingOwner } = require('../middleware');
const { validateListing, sanitizeListing } = require('../middleware/validation');
const listingController = require('../controllers/listing');

router.get('/', wrapAsync(listingController.index));
router.post('/', authorize, validateListing, sanitizeListing, wrapAsync(listingController.createListing));
router.get('/new', authorize, wrapAsync(listingController.renderNewForm));

router.get('/:id', wrapAsync(listingController.showListing));
router.put('/:id', authorize, isListingOwner, validateListing, sanitizeListing, wrapAsync(listingController.updateListing));
router.delete('/:id', authorize, isListingOwner, wrapAsync(listingController.destroyListing));

router.get('/:id/edit', authorize, isListingOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
