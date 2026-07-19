const ExpressError = require('../utils/ExpressError');

// Validation rules object
const validationRules = {
  title: {
    required: true,
    type: 'string',
    minLength: 5,
    maxLength: 100,
    trim: true,
  },
  description: {
    required: false,
    type: 'string',
    minLength: 10,
    maxLength: 5000,
    trim: true,
  },
  image: {
    required: false,
    type: 'string',
    maxLength: 500,
    urlValidator: true,
  },
  price: {
    required: true,
    type: 'number',
    min: 1,
    max: 999999,
  },
  location: {
    required: true,
    type: 'string',
    minLength: 3,
    maxLength: 100,
    trim: true,
  },
  country: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 100,
    trim: true,
  },
};

// Validate URL format
function isValidUrl(url) {
  if (!url || url === '') return true; // Optional field
  const urlPattern = /^https?:\/\/.+/;
  return urlPattern.test(url);
}

// Main validation middleware
function validateListing(req, res, next) {
  const { title, description, image, price, location, country } = req.body;
  const errors = {};

  // Validate each field
  Object.keys(validationRules).forEach((field) => {
    const rule = validationRules[field];
    const value = req.body[field];

    // Check required fields
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      return;
    }

    // Skip validation if field is empty and not required
    if (!rule.required && (value === undefined || value === null || value === '')) {
      return;
    }

    // Type validation
    if (rule.type === 'number') {
      const num = parseFloat(value);
      if (isNaN(num)) {
        errors[field] = `${field} must be a valid number`;
        return;
      }
      if (rule.min !== undefined && num < rule.min) {
        errors[field] = `${field} must be at least ${rule.min}`;
        return;
      }
      if (rule.max !== undefined && num > rule.max) {
        errors[field] = `${field} cannot exceed ${rule.max}`;
        return;
      }
    } else if (rule.type === 'string') {
      let stringValue = String(value).trim();

      if (rule.minLength && stringValue.length < rule.minLength) {
        errors[field] = `${field} must be at least ${rule.minLength} characters long`;
        return;
      }
      if (rule.maxLength && stringValue.length > rule.maxLength) {
        errors[field] = `${field} must not exceed ${rule.maxLength} characters`;
        return;
      }

      // URL validation
      if (rule.urlValidator && !isValidUrl(value)) {
        errors[field] = `${field} must be a valid HTTP or HTTPS URL`;
        return;
      }

      // Update request body with trimmed value
      if (rule.trim) {
        req.body[field] = stringValue;
      }
    }
  });

  // If there are errors, return 400 with error details
  if (Object.keys(errors).length > 0) {
    return next(new ExpressError(400, JSON.stringify(errors)));
  }

  // Validation passed, proceed to next middleware
  next();
}

// Sanitize middleware - ensures data is clean before saving
function sanitizeListing(req, res, next) {
  const { title, description, image, price, location, country } = req.body;

  // Trim and clean string fields
  req.body.title = String(title).trim();
  req.body.description = description ? String(description).trim() : description;
  req.body.location = String(location).trim();
  req.body.country = String(country).trim();

  // Convert price to float with 2 decimal places
  req.body.price = parseFloat(price).toFixed(2);

  // Handle image URL
  if (image) {
    req.body.image = String(image).trim();
  }

  next();
}

module.exports = {
  validateListing,
  sanitizeListing,
};
