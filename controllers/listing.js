const Listing = require('../models/listing');
const ExpressError = require('../utils/ExpressError');

module.exports.index = async (req, res, next) => {
  let listings = await Listing.find({});
  res.render('listings/index.ejs', { listings });
};

module.exports.renderNewForm = async (req, res) => {
  res.render('listings/new.ejs');
};

module.exports.createListing = async (req, res, next) => {
  let { title, description, image, price, location, country } = req.body;
  const newListing = new Listing({
    title,
    description,
    image: { url: image, alt: title },
    price,
    location,
    country,
  });

  let savedListing = await newListing.save();
  console.log('new listing saved', savedListing);
  req.flash('success', 'Successfully created a new listing!');
  res.redirect('/listings');
};

module.exports.showListing = async (req, res, next) => {
  let { id } = req.params;

  let listing = await Listing.findById(id).populate('reviews');
  if (!listing) {
    return next(new ExpressError(404, 'Page not found retry'));
  }
  res.render('listings/show.ejs', { listing });
};

module.exports.renderEditForm = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    return next(new ExpressError(404, 'Listing not found'));
  }
  res.render('listings/edit.ejs', { listing });
};

module.exports.updateListing = async (req, res, next) => {
  let { id } = req.params;
  let { title, description, image, price, location, country } = req.body;
  let listing = await Listing.findByIdAndUpdate(id, {
    title,
    description,
    image: { url: image, alt: title },
    price,
    location,
    country,
  });
  if (!listing) {
    req.flash('error', 'Listing you requested for does not exist!');
    return res.redirect('/listings');
  }
  // Added success flash
  req.flash('success', 'Listing updated successfully!');
  res.redirect(`/listings/${id}`);

};

module.exports.destroyListing = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndDelete(id);
  if (!listing) {
    req.flash('error', 'Listing you requested for does not exist!');
    return res.redirect('/listings');
  }
  req.flash('success', 'Listing deleted successfully!');
  res.redirect('/listings');
};
