const mongoose = require('mongoose');
const Listing = require('../models/listing');
const { data: sampleListings } = require('./data');

async function connectDB() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Database error:', err.message);
  }
}

async function seedData() {
  try {
    await Listing.deleteMany({});
    await Listing.insertMany(sampleListings);
    console.log('Sample data seeded successfully');
  } catch (err) {
    console.error('Error seeding data:', err.message);
    process.exit(1);
  }
}

async function runSeeder() {
  await connectDB();
  await seedData();
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

runSeeder().catch((err) => {
  console.error('Seeder failed:', err.message);
  process.exit(1);
});
