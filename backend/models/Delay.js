const mongoose = require('mongoose');

const delaySchema = new mongoose.Schema({
  routeNumber: {
    type: String,
    required: true,
    trim: true
  },
  neighborhood: {
    type: String,
    required: true,
    trim: true,
    index: true // Index for faster aggregation queries
  },
  delayMinutes: {
    type: Number,
    required: true,
    min: 0
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  busId: {
    type: String,
    required: true,
    trim: true
  },
  reportedAt: {
    type: Date,
    default: Date.now,
    index: true // Index for sorting and pagination
  },
  status: {
    type: String,
    enum: ['active', 'resolved'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for efficient queries
delaySchema.index({ neighborhood: 1, status: 1 });
delaySchema.index({ reportedAt: -1 });

module.exports = mongoose.model('Delay', delaySchema);

