const express = require('express');
const router = express.Router();
const Delay = require('../models/Delay');

// GET: Aggregation - Group delays by neighborhood
// This implements the MongoDB aggregation pipeline requirement
router.get('/aggregate/by-neighborhood', async (req, res) => {
  try {
    const pipeline = [
      {
        // Match only active delays (optional filter)
        $match: {
          status: 'active'
        }
      },
      {
        // Group by neighborhood and count
        $group: {
          _id: '$neighborhood',
          count: { $sum: 1 },
          totalDelayMinutes: { $sum: '$delayMinutes' },
          avgDelayMinutes: { $avg: '$delayMinutes' }
        }
      },
      {
        // Sort by count descending
        $sort: { count: -1 }
      },
      {
        // Rename _id to neighborhood for cleaner response
        $project: {
          _id: 0,
          neighborhood: '$_id',
          count: 1,
          totalDelayMinutes: 1,
          avgDelayMinutes: { $round: ['$avgDelayMinutes', 2] }
        }
      }
    ];

    const results = await Delay.aggregate(pipeline);
    res.json({
      success: true,
      data: results,
      total: results.length
    });
  } catch (error) {
    console.error('Aggregation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error aggregating delay data',
      error: error.message
    });
  }
});

// GET: Get all delays with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status || 'active';

    // Build query
    const query = {};
    if (status !== 'all') {
      query.status = status;
    }

    // Get total count for pagination
    const total = await Delay.countDocuments(query);

    // Get paginated delays
    const delays = await Delay.find(query)
      .sort({ reportedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: delays,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get delays error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching delays',
      error: error.message
    });
  }
});

// POST: Report a new delay
router.post('/', async (req, res) => {
  try {
    const { routeNumber, neighborhood, delayMinutes, reason, busId } = req.body;

    // Validation
    if (!routeNumber || !neighborhood || delayMinutes === undefined || !reason || !busId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: routeNumber, neighborhood, delayMinutes, reason, busId'
      });
    }

    const newDelay = new Delay({
      routeNumber,
      neighborhood,
      delayMinutes: parseInt(delayMinutes),
      reason,
      busId,
      status: 'active'
    });

    const savedDelay = await newDelay.save();
    res.status(201).json({
      success: true,
      message: 'Delay reported successfully',
      data: savedDelay
    });
  } catch (error) {
    console.error('Create delay error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reporting delay',
      error: error.message
    });
  }
});

// DELETE: Delete a resolved issue
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const delay = await Delay.findByIdAndDelete(id);

    if (!delay) {
      return res.status(404).json({
        success: false,
        message: 'Delay not found'
      });
    }

    res.json({
      success: true,
      message: 'Resolved issue deleted successfully',
      data: delay
    });
  } catch (error) {
    console.error('Delete delay error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting delay',
      error: error.message
    });
  }
});

// PATCH: Update delay status (mark as resolved)
router.patch('/:id/resolve', async (req, res) => {
  try {
    const { id } = req.params;

    const delay = await Delay.findByIdAndUpdate(
      id,
      { status: 'resolved' },
      { new: true }
    );

    if (!delay) {
      return res.status(404).json({
        success: false,
        message: 'Delay not found'
      });
    }

    res.json({
      success: true,
      message: 'Delay marked as resolved',
      data: delay
    });
  } catch (error) {
    console.error('Resolve delay error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resolving delay',
      error: error.message
    });
  }
});

module.exports = router;

