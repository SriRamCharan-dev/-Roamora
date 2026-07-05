const mongoose = require('mongoose');
const Listing = require('../models/listing');
const User = require('../models/user');
const { data: sampleListings, users: sampleUsers } = require('./data');

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
    await User.deleteMany({});
    await Listing.deleteMany({});

    const seededUsers = [];
    for (const userData of sampleUsers) {
      const user = new User({
        username: userData.username,
        email: userData.email,
      });
      const registeredUser = await User.register(user, userData.password);
      seededUsers.push(registeredUser);
    }

    const listingsWithOwner = sampleListings.map((obj, index) => ({
      ...obj,
      owner: seededUsers[index % seededUsers.length]._id,
    }));

    await Listing.insertMany(listingsWithOwner);
    console.log('Sample users and listings seeded successfully');
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
