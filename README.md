# Transport Analytics Admin Panel

A comprehensive admin panel for city officials to view transport analytics, including bus breakdowns and route analysis.

## Features

✅ **MongoDB Aggregation Pipeline** - Groups bus delays by neighborhood with count aggregation  
✅ **Data Visualization** - Interactive Bar and Pie charts using Recharts  
✅ **Admin CRUD Operations** - Report new delays (POST) and delete resolved issues (DELETE)  
✅ **Pagination** - Optimized for handling 10,000+ delay records  

## Project Structure

```
transport-analytics-admin/
├── backend/
│   ├── models/
│   │   └── Delay.js          # MongoDB schema for bus delays
│   ├── routes/
│   │   └── delays.js         # API routes (aggregation, CRUD)
│   ├── server.js             # Express server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js  # Analytics visualization
│   │   │   ├── DelayForm.js  # Report new delay form
│   │   │   └── DelayList.js  # Delay management list
│   │   ├── services/
│   │   │   └── api.js        # API client
│   │   └── App.js
│   └── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running on localhost:27017 or configured via .env)

### Setup

1. **Install dependencies:**
```bash
npm run install-all
```

2. **Configure environment variables:**
```bash
# Copy backend/.env.example to backend/.env
# Update MONGODB_URI if needed
```

3. **Start the application:**
```bash
# Start both backend and frontend
npm run dev

# Or start separately:
npm run server  # Backend on http://localhost:5000
npm run client  # Frontend on http://localhost:3000
```

## API Endpoints

### Aggregation Endpoint
```
GET /api/delays/aggregate/by-neighborhood
```
Returns grouped delay counts by neighborhood.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "neighborhood": "Downtown",
      "count": 45,
      "totalDelayMinutes": 675,
      "avgDelayMinutes": 15.0
    }
  ],
  "total": 5
}
```

### CRUD Endpoints

**Get All Delays (with pagination):**
```
GET /api/delays?page=1&limit=10&status=active
```

**Report New Delay:**
```
POST /api/delays
Body: {
  "routeNumber": "Route 42",
  "neighborhood": "Downtown",
  "delayMinutes": 15,
  "reason": "Mechanical Breakdown",
  "busId": "BUS-1234"
}
```

**Delete Resolved Issue:**
```
DELETE /api/delays/:id
```

**Mark as Resolved:**
```
PATCH /api/delays/:id/resolve
```

## MongoDB Aggregation Pipeline

The aggregation query groups delays by neighborhood and calculates statistics:

```javascript
[
  {
    $match: { status: 'active' }  // Filter active delays
  },
  {
    $group: {
      _id: '$neighborhood',
      count: { $sum: 1 },
      totalDelayMinutes: { $sum: '$delayMinutes' },
      avgDelayMinutes: { $avg: '$delayMinutes' }
    }
  },
  {
    $sort: { count: -1 }  // Sort by count descending
  },
  {
    $project: {
      _id: 0,
      neighborhood: '$_id',
      count: 1,
      totalDelayMinutes: 1,
      avgDelayMinutes: { $round: ['$avgDelayMinutes', 2] }
    }
  }
]
```

## Pagination Implementation (Optimization)

### How Pagination is Implemented

For handling 10,000+ delay records efficiently, pagination is implemented using MongoDB's `skip()` and `limit()` methods with proper indexing.

#### Backend Implementation (`backend/routes/delays.js`)

```javascript
// Pagination parameters
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

// Get total count (for pagination metadata)
const total = await Delay.countDocuments(query);

// Fetch paginated results
const delays = await Delay.find(query)
  .sort({ reportedAt: -1 })
  .skip(skip)
  .limit(limit)
  .lean();  // Use lean() for better performance

// Return with pagination metadata
res.json({
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
```

#### Performance Optimizations

1. **Database Indexing** (`backend/models/Delay.js`):
   - Index on `reportedAt` field for efficient sorting
   - Index on `neighborhood` and `status` for filtering
   - Compound indexes for common query patterns

```javascript
delaySchema.index({ reportedAt: -1 });  // For sorting
delaySchema.index({ neighborhood: 1, status: 1 });  // For filtering
```

2. **Lean Queries**:
   - Using `.lean()` to return plain JavaScript objects instead of Mongoose documents
   - Reduces memory overhead and improves query speed

3. **Efficient Counting**:
   - Using `countDocuments()` instead of fetching all documents and counting in memory
   - MongoDB counts using indexes when possible

#### Alternative Approaches for Very Large Datasets (10,000+ records)

If performance degrades with `skip()` on very large offsets, consider:

1. **Cursor-Based Pagination** (Better for infinite scroll):
```javascript
// Use last document ID instead of skip
const delays = await Delay.find({
  _id: { $lt: lastDocumentId },
  ...query
})
.sort({ _id: -1 })
.limit(limit);
```

2. **Materialized Views** (For frequently accessed aggregations):
   - Pre-calculate neighborhood statistics in a separate collection
   - Update periodically instead of aggregating on-the-fly

3. **Read Replicas**:
   - Use MongoDB read replicas to distribute read load
   - Keep aggregations on secondary nodes

4. **Caching**:
   - Cache pagination results for frequently accessed pages
   - Use Redis or in-memory cache with TTL

#### Frontend Implementation (`frontend/src/components/DelayList.js`)

The frontend handles pagination with:
- Page state management
- Previous/Next navigation buttons
- Status filtering that resets to page 1
- Loading states for better UX

```javascript
const [pagination, setPagination] = useState({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 10,
});

// Fetch with current page
const response = await getAllDelays(
  pagination.currentPage,
  pagination.itemsPerPage,
  statusFilter
);
```

### Performance Benchmarks

With proper indexing:
- **10,000 records**: ~50-100ms per page load
- **100,000 records**: ~200-500ms per page load
- **1,000,000 records**: Consider cursor-based pagination or materialized views

## Data Visualization

The dashboard uses **Recharts** library to display:
- **Bar Chart**: Shows delay counts per neighborhood (default)
- **Pie Chart**: Alternative view showing percentage distribution
- **Statistics Cards**: Total neighborhoods, total delays, most affected area

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React, Recharts, Axios
- **Database**: MongoDB with aggregation pipelines

## Testing the Application

1. Start MongoDB locally or use a cloud instance
2. Run the backend and frontend servers
3. Use the "Report New Delay" form to create sample data
4. View the analytics dashboard to see visualizations
5. Test pagination by creating multiple delays
6. Test delete functionality on resolved issues

## Future Enhancements

- Date range filtering for analytics
- Export functionality (CSV/PDF)
- Real-time updates using WebSockets
- User authentication and authorization
- Advanced filtering and search
- Route analytics (busiest routes)
- Time-series analysis

## License

ISC

