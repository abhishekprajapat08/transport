# MongoDB Aggregation Pipeline Documentation

## Overview

This document details the MongoDB aggregation pipeline used to group bus delays by neighborhood and return counts for each neighborhood.

## Pipeline Location

**File**: `backend/routes/delays.js`  
**Endpoint**: `GET /api/delays/aggregate/by-neighborhood`

## Complete Pipeline

```javascript
const pipeline = [
  {
    // Stage 1: Match - Filter documents
    $match: {
      status: 'active'  // Only count active delays
    }
  },
  {
    // Stage 2: Group - Group by neighborhood and calculate metrics
    $group: {
      _id: '$neighborhood',                    // Group key
      count: { $sum: 1 },                      // Count of delays per neighborhood
      totalDelayMinutes: { $sum: '$delayMinutes' },  // Sum of all delay minutes
      avgDelayMinutes: { $avg: '$delayMinutes' }     // Average delay per neighborhood
    }
  },
  {
    // Stage 3: Sort - Order results by count (descending)
    $sort: { count: -1 }
  },
  {
    // Stage 4: Project - Reshape output document
    $project: {
      _id: 0,                                  // Exclude _id field
      neighborhood: '$_id',                    // Rename _id to neighborhood
      count: 1,                                // Include count
      totalDelayMinutes: 1,                    // Include total delay minutes
      avgDelayMinutes: { $round: ['$avgDelayMinutes', 2] }  // Round average to 2 decimals
    }
  }
];
```

## Pipeline Stages Explained

### Stage 1: $match
Filters documents to include only active delays. This can be removed or modified to include all delays.

**Input**: All delay documents  
**Output**: Only active delay documents

### Stage 2: $group
Groups documents by the `neighborhood` field and calculates:
- `count`: Total number of delays per neighborhood
- `totalDelayMinutes`: Sum of all delay minutes
- `avgDelayMinutes`: Average delay time per neighborhood

**Group Key**: `$neighborhood`  
**Accumulators**: `$sum`, `$avg`

### Stage 3: $sort
Sorts the grouped results by count in descending order (neighborhoods with most delays first).

### Stage 4: $project
Reshapes the output to:
- Remove the MongoDB `_id` field
- Rename the group `_id` to `neighborhood`
- Round the average delay minutes to 2 decimal places
- Keep all calculated fields

## Sample Input Data

```javascript
[
  { neighborhood: 'Downtown', delayMinutes: 15, status: 'active' },
  { neighborhood: 'Downtown', delayMinutes: 30, status: 'active' },
  { neighborhood: 'Midtown', delayMinutes: 20, status: 'active' },
  { neighborhood: 'Uptown', delayMinutes: 10, status: 'resolved' }
]
```

## Sample Output

```json
{
  "success": true,
  "data": [
    {
      "neighborhood": "Downtown",
      "count": 2,
      "totalDelayMinutes": 45,
      "avgDelayMinutes": 22.5
    },
    {
      "neighborhood": "Midtown",
      "count": 1,
      "totalDelayMinutes": 20,
      "avgDelayMinutes": 20.0
    }
  ],
  "total": 2
}
```

## Usage in Frontend

The aggregation endpoint is called from the Dashboard component:

```javascript
// frontend/src/services/api.js
export const getDelaysByNeighborhood = async () => {
  const response = await api.get('/delays/aggregate/by-neighborhood');
  return response.data;
};
```

The data is then used to render charts in `frontend/src/components/Dashboard.js`.

## Performance Considerations

1. **Indexing**: The `neighborhood` field is indexed in the Delay model for faster grouping
2. **Status Filter**: Matching by `status: 'active'` first reduces documents before grouping
3. **Project Stage**: Only includes necessary fields, reducing data transfer

## Alternative Aggregations

### Include Resolved Delays

```javascript
{
  $match: {
    // Remove status filter or use: status: { $in: ['active', 'resolved'] }
  }
}
```

### Group by Route Instead of Neighborhood

```javascript
{
  $group: {
    _id: '$routeNumber',  // Change grouping field
    count: { $sum: 1 }
  }
}
```

### Additional Metrics

```javascript
{
  $group: {
    _id: '$neighborhood',
    count: { $sum: 1 },
    totalDelayMinutes: { $sum: '$delayMinutes' },
    avgDelayMinutes: { $avg: '$delayMinutes' },
    minDelayMinutes: { $min: '$delayMinutes' },
    maxDelayMinutes: { $max: '$delayMinutes' },
    uniqueRoutes: { $addToSet: '$routeNumber' },  // Array of unique routes
    uniqueBuses: { $addToSet: '$busId' }          // Array of unique bus IDs
  }
}
```

## Testing the Pipeline

You can test the aggregation directly in MongoDB:

```javascript
// MongoDB shell or Compass
db.delays.aggregate([
  { $match: { status: 'active' } },
  { $group: { _id: '$neighborhood', count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
```

Or use the API endpoint:

```bash
curl http://localhost:5000/api/delays/aggregate/by-neighborhood
```

