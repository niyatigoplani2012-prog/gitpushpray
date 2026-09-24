const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const User = require('../models/User');
const RecipientOrg = require('../models/RecipientOrg');
const Donation = require('../models/Donation');
const Match = require('../models/Match');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/surplus-to-shelter');
    console.log('Connected to DB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await RecipientOrg.deleteMany({});
    await Donation.deleteMany({});
    await Match.deleteMany({});
    console.log('Cleared existing data.');

    // Create Admin
    await User.create({
      name: 'Admin User',
      email: 'admin@surplus.org',
      password: 'password123',
      role: 'admin'
    });

    // Create a Donor
    const donor = await User.create({
      name: 'Local Bakery',
      email: 'donor@bakery.com',
      password: 'password123',
      role: 'donor'
    });

    // Create a Driver
    const driver = await User.create({
      name: 'Volunteer Driver',
      email: 'driver@volunteer.com',
      password: 'password123',
      role: 'driver'
    });

    // Create 3 Recipient Orgs Users
    const orgUser1 = await User.create({
      name: 'Downtown Shelter',
      email: 'contact@downtownshelter.org',
      password: 'password123',
      role: 'recipient_org'
    });

    const orgUser2 = await User.create({
      name: 'Community Food Bank',
      email: 'contact@foodbank.org',
      password: 'password123',
      role: 'recipient_org'
    });

    const orgUser3 = await User.create({
      name: 'Youth Center Kitchen',
      email: 'kitchen@youthcenter.org',
      password: 'password123',
      role: 'recipient_org'
    });

    // Create Recipient Orgs
    const org1 = await RecipientOrg.create({
      user_id: orgUser1._id,
      name: 'Downtown Shelter',
      location: { address: '123 Downtown St', lat: 40.7128, lng: -74.0060 },
      current_capacity: 100, // meals
      accepted_food_types: ['produce', 'prepared', 'packaged'],
      contact: { name: 'Alice', phone: '555-0101' }
    });

    const org2 = await RecipientOrg.create({
      user_id: orgUser2._id,
      name: 'Community Food Bank',
      location: { address: '456 East Side Ave', lat: 40.7138, lng: -73.9960 },
      current_capacity: 500, // meals
      accepted_food_types: ['packaged', 'produce'],
      contact: { name: 'Bob', phone: '555-0202' }
    });

    const org3 = await RecipientOrg.create({
      user_id: orgUser3._id,
      name: 'Youth Center Kitchen',
      location: { address: '789 West End Blvd', lat: 40.7228, lng: -74.0160 },
      current_capacity: 50, // meals
      accepted_food_types: ['prepared'],
      contact: { name: 'Charlie', phone: '555-0303' }
    });

    // ----------------------------------------------------
    // LIVE DEMO STATE SEEDING
    // ----------------------------------------------------
    
    // 1. A Donation that is matched, waiting for driver claim
    const donation1 = await Donation.create({
      donor_id: donor._id,
      food_type: 'produce',
      quantity: 50,
      unit: 'kg',
      expiry_window: { safe_until: new Date(Date.now() + 1000 * 60 * 60 * 2) }, // 2 hours
      pickup_location: { address: 'Local Bakery, 45 Main St', lat: 40.71, lng: -74.01 },
      status: 'matched'
    });

    await Match.create({
      donation_id: donation1._id,
      recipient_id: org1._id,
      status: 'matched'
    });

    // 2. A Donation that a driver has already picked up
    const donation2 = await Donation.create({
      donor_id: donor._id,
      food_type: 'prepared',
      quantity: 20,
      unit: 'meals',
      expiry_window: { safe_until: new Date(Date.now() + 1000 * 60 * 45) }, // 45 mins
      pickup_location: { address: 'Downtown Events, 7th Ave', lat: 40.72, lng: -74.01 },
      status: 'picked_up'
    });

    await Match.create({
      donation_id: donation2._id,
      recipient_id: org2._id,
      driver_id: driver._id,
      status: 'picked_up'
    });

    console.log('Seed completed successfully with live demo state!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
