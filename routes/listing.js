const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const authorize = require('../middleware');
const { validateListing, sanitizeListing } = require('../middleware/validation');
const listingController = require('../controllers/listing');

router.get('/', wrapAsync(listingController.index));
router.post('/', authorize, validateListing, sanitizeListing, wrapAsync(listingController.createListing));
router.get('/new', authorize, wrapAsync(listingController.renderNewForm));

router.get('/:id', wrapAsync(listingController.showListing));
router.put('/:id', authorize, validateListing, sanitizeListing, wrapAsync(listingController.updateListing));
router.delete('/:id', authorize, wrapAsync(listingController.destroyListing));

router.get('/:id/edit', authorize, wrapAsync(listingController.renderEditForm));

module.exports = router;
