const Listing = require('../Models/listing');
const ExpressError = require('../utils/ExpressError');
const { cloudinary } = require('../cloudConfig');

const locationIQKey = process.env.LOCATIONIQ_API_KEY;

async function getGeocode(location, country) {
  try {
    const query = `${location}, ${country}`;
    const url = `https://us1.locationiq.com/v1/search?key=${locationIQKey}&q=${encodeURIComponent(query)}&format=json&limit=1`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`LocationIQ HTTP error: ${res.status}`);
    }
    const data = await res.json();
    if (data && data.length > 0) {
      const lon = parseFloat(data[0].lon);
      const lat = parseFloat(data[0].lat);
      return {
        type: 'Point',
        coordinates: [lon, lat]
      };
    }
  } catch (err) {
    console.error('LocationIQ geocoding error:', err.message);
  }
  return null;
}

module.exports.index = async (req, res, next) => {
  const { search } = req.query;
  let query = {};
  
  if (search && search.trim() !== "") {
    const searchRegex = new RegExp(search.trim(), 'i');
    query = {
      $or: [
        { title: searchRegex },
        { location: searchRegex },
        { country: searchRegex },
        { description: searchRegex }
      ]
    };
  }

  let listings = await Listing.find(query);
  res.render('listings/index.ejs', { listings, search: search || '' });
};

module.exports.renderNewForm = async (req, res) => {
  res.render('listings/new.ejs');
};

module.exports.createListing = async (req, res, next) => {
  let { title, description, price, location, country } = req.body;

  // req.file is populated by multer when a file is uploaded
  const imageUrl      = req.file ? req.file.path     : undefined;
  const imageFilename = req.file ? req.file.filename  : undefined;

  let geometry = { type: 'Point', coordinates: [77.2090, 28.6139] }; // Fallback to Delhi coordinates
  const geocodeResult = await getGeocode(location, country);
  if (geocodeResult) {
    geometry = geocodeResult;
  }

  const newListing = new Listing({
    title,
    description,
    image: { url: imageUrl, filename: imageFilename, alt: title },
    price,
    location,
    country,
    geometry,
    owner: req.user._id,
  });

  let savedListing = await newListing.save();
  console.log('new listing saved', savedListing);
  req.flash('success', 'Successfully created a new listing!');
  res.redirect('/listings');
};

module.exports.showListing = async (req, res, next) => {
  let { id } = req.params;

  let listing = await Listing.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('owner', 'username email');
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
  let { title, description, price, location, country } = req.body;

  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'Listing you requested for does not exist!');
    return res.redirect('/listings');
  }

  // If a new image was uploaded, delete the old one from Cloudinary
  if (req.file) {
    if (listing.image && listing.image.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }
    listing.image = { url: req.file.path, filename: req.file.filename, alt: title };
  }

  // Update geometry if location or country has changed, or if it doesn't exist
  if (!listing.geometry || !listing.geometry.coordinates || listing.geometry.coordinates.length === 0 || listing.location !== location || listing.country !== country) {
    const geocodeResult = await getGeocode(location, country);
    if (geocodeResult) {
      listing.geometry = geocodeResult;
    }
  }

  listing.title       = title;
  listing.description = description;
  listing.price       = price;
  listing.location    = location;
  listing.country     = country;

  await listing.save();
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
