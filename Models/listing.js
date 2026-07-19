const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      default: 'listingimage',
      trim: true,
      minlength: [1, 'Filename must not be empty'],
      maxlength: [100, 'Filename must not exceed 100 characters'],
    },

    url: {
      type: String,
      default: 'https://www.pngall.com/wp-content/uploads/5/Hotel-Icon-PNG-Picture.png',
      set: (v) => (v === '' || v == null ? 'https://www.pngall.com/wp-content/uploads/5/Hotel-Icon-PNG-Picture.png' : v),
    },

    alt: {
      type: String,
      default: 'listing image',
    },
  },
  { _id: false }
);

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [100, 'Title must not exceed 100 characters'],
  },
  description: {
    type: String,
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [5000, 'Description must not exceed 5000 characters'],
  },
  image: {
    type: imageSchema,
    default: () => ({})
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive number'],
    max: [999999, 'Price cannot exceed 999999'],
    validate: {
      validator: function (v) {
        return v > 0;
      },
      message: 'Price must be greater than 0'
    }
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    minlength: [3, 'Location must be at least 3 characters long'],
    maxlength: [100, 'Location must not exceed 100 characters'],
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    minlength: [2, 'Country must be at least 2 characters long'],
    maxlength: [100, 'Country must not exceed 100 characters'],
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    }
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    }
  }
});

const Review = require('./review');

listingSchema.post('findOneAndDelete', async (listing) => {
  if (listing && listing.reviews.length) {
    await Review.deleteMany({
      _id: { $in: listing.reviews }
    });
  }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;