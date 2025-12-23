const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/transport_analytics';
console.log('Attempting to connect to MongoDB...');

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log(`   Database: ${mongoose.connection.name}`);
  console.log(`   Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.error('   Make sure MongoDB is running on your system');
  console.error('   Or update MONGODB_URI in backend/.env file');
});

// Routes
app.use('/api/delays', require('./routes/delays'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Transport Analytics API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

