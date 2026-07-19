const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });
const wrapAsync = require('../utils/wrapAsync');
const authorize = require('../appMiddleware');
const { isListingOwner } = require('../appMiddleware');
const { validateListing, sanitizeListing } = require('../validators/validation');

const listingController = require('../controllers/listing');

// Root Route
router.route('/')
    .get(wrapAsync(listingController.index))
    .post(authorize, upload.single('image'), validateListing, sanitizeListing, wrapAsync(listingController.createListing));

// Render New Form Route
router.get('/new', authorize, wrapAsync(listingController.renderNewForm));

// ID Routes
router.route('/:id')
    .get(wrapAsync(listingController.showListing))
    .put(authorize, isListingOwner, upload.single('image'), validateListing, sanitizeListing, wrapAsync(listingController.updateListing))
    .delete(authorize, isListingOwner, wrapAsync(listingController.destroyListing));

// Render Edit Form Route
router.get('/:id/edit', authorize, isListingOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
