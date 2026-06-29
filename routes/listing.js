const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { validateListing, sanitizeListing } = require('../middleware/validation');
const listingController = require('../controllers/listing');

router.get('/', wrapAsync(listingController.index));
router.post('/', validateListing, sanitizeListing, wrapAsync(listingController.createListing));

router.get('/new', wrapAsync(listingController.renderNewForm));

router.get('/:id', wrapAsync(listingController.showListing));
router.put('/:id', validateListing, sanitizeListing, wrapAsync(listingController.updateListing));
router.delete('/:id', wrapAsync(listingController.destroyListing));

router.get('/:id/edit', wrapAsync(listingController.renderEditForm));

module.exports = router;
