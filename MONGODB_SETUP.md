# MongoDB Setup Guide

This guide will help you set up MongoDB for the Transport Analytics Admin Panel.

## Option 1: Install MongoDB Locally (Recommended for Development)

### Step 1: Download MongoDB Community Server

1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - **Version**: Latest stable version (e.g., 7.0)
   - **Platform**: Windows
   - **Package**: MSI
3. Click "Download"

### Step 2: Install MongoDB

1. Run the downloaded `.msi` installer
2. Choose "Complete" installation
3. **Important**: Check "Install MongoDB as a Service"
   - Service Name: `MongoDB`
   - Run service as: `Network Service user`
4. **Important**: Check "Install MongoDB Compass" (GUI tool - optional but helpful)
5. Click "Install"

### Step 3: Verify Installation

Open a new PowerShell window and run:

```powershell
mongod --version
```

You should see the MongoDB version.

### Step 4: Start MongoDB Service

MongoDB should start automatically after installation. To check/start manually:

```powershell
# Check if MongoDB service is running
Get-Service MongoDB

# If not running, start it:
Start-Service MongoDB

# Or use:
net start MongoDB
```

### Step 5: Test Connection

Test if MongoDB is accessible:

```powershell
# Connect to MongoDB shell
mongosh

# Or if mongosh is not available, use:
mongo
```

If you see a MongoDB prompt, you're connected! Type `exit` to quit.

### Step 6: Configure Your Application

The application is already configured to use the default MongoDB connection:
- **URI**: `mongodb://localhost:27017/transport_analytics`
- **Database**: `transport_analytics`

No configuration needed! Just make sure MongoDB service is running.

---

## Option 2: Use MongoDB Atlas (Cloud - Free Tier)

If you prefer cloud MongoDB or don't want to install locally:

### Step 1: Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account
3. Create a free cluster (M0 - Free tier)

### Step 2: Create Database User

1. Go to "Database Access" → "Add New Database User"
2. Choose "Password" authentication
3. Create username and password (save these!)
4. Set privileges: "Atlas Admin" or "Read and write to any database"
5. Click "Add User"

### Step 3: Whitelist Your IP Address

1. Go to "Network Access" → "Add IP Address"
2. Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address
3. Click "Confirm"

### Step 4: Get Connection String

1. Go to "Database" → Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
4. Replace `<password>` with your database user password
5. Add database name at the end: `transport_analytics`

**Final connection string should look like:**
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/transport_analytics?retryWrites=true&w=majority
```

### Step 5: Update Your Application Configuration

1. Create/update `backend/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/transport_analytics?retryWrites=true&w=majority
```

2. Replace `yourusername`, `yourpassword`, and cluster URL with your actual values

---

## Option 3: Use Docker (Alternative)

If you have Docker installed:

```powershell
# Run MongoDB in a Docker container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Check if it's running
docker ps
```

The application will connect to `mongodb://localhost:27017/transport_analytics` automatically.

---

## Verify MongoDB is Working

### Test 1: Check if MongoDB is Running

```powershell
# Check service status
Get-Service MongoDB

# Or test connection
mongosh --eval "db.adminCommand('ping')"
```

### Test 2: Test from Your Application

Start your backend server:

```powershell
cd backend
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
   Database: transport_analytics
   Host: localhost:27017
```

If you see an error, MongoDB is not running or not accessible.

---

## Common Issues & Solutions

### Issue 1: "MongoDB connection error"

**Solution:**
- Make sure MongoDB service is running: `Start-Service MongoDB`
- Check if port 27017 is available
- Verify MongoDB is installed: `mongod --version`

### Issue 2: "Access Denied" or Authentication Error

**Solution:**
- If using local MongoDB, make sure it's installed as a service
- If using Atlas, verify username/password in `.env` file
- Check network access settings in Atlas

### Issue 3: Port 27017 Already in Use

**Solution:**
```powershell
# Find what's using port 27017
netstat -ano | findstr :27017

# Stop other MongoDB instances or change port
```

### Issue 4: MongoDB Compass (GUI Tool)

Install MongoDB Compass for a visual interface:
- Download from: https://www.mongodb.com/products/compass
- Or it should be included in the MongoDB installer
- Connect to: `mongodb://localhost:27017`

---

## Quick Start Checklist

- [ ] MongoDB installed and service running
- [ ] MongoDB service verified: `Get-Service MongoDB`
- [ ] Connection tested: `mongosh` or `mongo`
- [ ] Backend `.env` file configured (if using Atlas)
- [ ] Backend server shows "MongoDB connected successfully"
- [ ] (Optional) Seed sample data: `node backend/scripts/seedData.js`

---

## Next Steps

After MongoDB is set up:

1. **Seed Sample Data** (optional):
   ```powershell
   cd backend
   node scripts/seedData.js
   ```

2. **Start Backend**:
   ```powershell
   npm run dev
   ```

3. **Start Frontend**:
   ```powershell
   npm run client
   ```

4. **Open Browser**: `http://localhost:3000`

---

## Need Help?

- MongoDB Documentation: https://docs.mongodb.com/
- MongoDB Community: https://community.mongodb.com/
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/

