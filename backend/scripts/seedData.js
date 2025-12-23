/**
 * Seed script to populate MongoDB with sample delay data
 * Run with: node scripts/seedData.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Delay = require('../models/Delay');

const neighborhoods = [
  'Downtown',
  'Midtown',
  'Uptown',
  'Eastside',
  'Westside',
  'North End',
  'South Park',
  'Central District',
  'Riverside',
  'Harbor View'
];

const reasons = [
  'Mechanical Breakdown',
  'Traffic Congestion',
  'Weather Conditions',
  'Accident',
  'Construction',
  'Other'
];

const routes = ['Route 1', 'Route 2', 'Route 3', 'Route 4', 'Route 5', 'Route 42', 'Route 101', 'Route 202'];

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/transport_analytics');
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await Delay.deleteMany({});
    console.log('Cleared existing delay data');

    // Generate sample delays
    const delays = [];
    const now = new Date();

    for (let i = 0; i < 50; i++) {
      const delay = {
        routeNumber: routes[Math.floor(Math.random() * routes.length)],
        neighborhood: neighborhoods[Math.floor(Math.random() * neighborhoods.length)],
        delayMinutes: Math.floor(Math.random() * 60) + 5, // 5-65 minutes
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        busId: `BUS-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
        reportedAt: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Last 7 days
        status: Math.random() > 0.3 ? 'active' : 'resolved' // 70% active, 30% resolved
      };
      delays.push(delay);
    }

    // Insert delays
    await Delay.insertMany(delays);
    console.log(`Successfully seeded ${delays.length} delay records`);

    // Show summary
    const stats = await Delay.aggregate([
      {
        $group: {
          _id: '$neighborhood',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\nDelays by Neighborhood:');
    stats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} delays`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedData();

