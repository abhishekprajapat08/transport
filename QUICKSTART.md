# Quick Start Guide

## Step-by-Step Instructions to Run the Application

### 1. Install Dependencies

```bash
# Install root, backend, and frontend dependencies
npm run install-all
```

Or install manually:
```bash
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
# If MongoDB is installed as a service, it should already be running
# Check status or start manually:
net start MongoDB
```

**Mac/Linux:**
```bash
# Start MongoDB service
sudo systemctl start mongod
# or
mongod
```

**Or use MongoDB Atlas (cloud):**
- Update `backend/.env` with your MongoDB Atlas connection string

### 3. (Optional) Seed Sample Data

To populate the database with sample delay records:

```bash
cd backend
node scripts/seedData.js
cd ..
```

### 4. Run the Application

**Option A: Run Both Backend & Frontend Together (Recommended)**

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend React app on `http://localhost:3000`

**Option B: Run Separately**

Terminal 1 - Backend:
```bash
npm run server
# or
cd backend && npm run dev
```

Terminal 2 - Frontend:
```bash
npm run client
# or
cd frontend && npm start
```

### 5. Open the Application

Open your browser and navigate to:
```
http://localhost:3000
```

### 6. Use the Application

1. **View Analytics Dashboard** - See bus delays grouped by neighborhood
2. **Report New Delay** - Fill out the form to add a new delay
3. **Manage Delays** - View, resolve, or delete delay records
4. **Switch Chart Views** - Toggle between Bar Chart and Pie Chart

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check `backend/.env` file has correct MongoDB URI
- Default: `mongodb://localhost:27017/transport_analytics`

### Port Already in Use
- Backend: Change `PORT` in `backend/.env` (default: 5000)
- Frontend: React will ask to use a different port automatically

### Dependencies Not Installing
- Make sure Node.js is installed (v14 or higher)
- Try deleting `node_modules` and `package-lock.json`, then reinstall

## Available Scripts

```bash
npm run dev          # Start both backend and frontend
npm run server       # Start only backend
npm run client       # Start only frontend
npm run install-all  # Install all dependencies
```

