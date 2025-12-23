# How to Run Project in One Terminal

## Single Command to Run Everything

Root directory se (D:\ash) yeh command chalao:

```powershell
npm run dev
```

Yeh automatically:
- ✅ Backend server start karega (port 5000)
- ✅ Frontend React app start karega (port 3000)
- ✅ Dono ek saath same terminal mein dikhengi

## Prerequisites (Pehle karna hai)

### 1. Dependencies Install Karein

```powershell
npm run install-all
```

Yeh sab install karega:
- Root dependencies
- Backend dependencies  
- Frontend dependencies

### 2. MongoDB Running Hona Chahiye

Check karein:
```powershell
Get-Service MongoDB
```

Agar "Running" dikh raha hai, tab theek hai! ✅

## Complete Steps

```powershell
# Step 1: Dependencies install (sirf pehli baar)
npm run install-all

# Step 2: MongoDB check karein
Get-Service MongoDB

# Step 3: Project run karein (ek hi command!)
npm run dev
```

## Expected Output

Terminal mein aise dikhega:

```
[0] > transport-analytics-backend@1.0.0 dev
[0] > nodemon server.js
[0] Attempting to connect to MongoDB...
[0] ✅ MongoDB connected successfully
[0] Server is running on port 5000
[1] > transport-analytics-frontend@0.1.0 start
[1] > react-scripts start
[1] Compiled successfully!
[1] You can now view transport-analytics-frontend in the browser.
[1] Local: http://localhost:3000
```

## Browser Mein Kholna

```
http://localhost:3000
```

## Stop Karne Ke Liye

Terminal mein `Ctrl + C` press karein (dono stop ho jayengi)

## Agar Error Aaye

### Error: "react-scripts is not recognized"
**Solution**: Frontend dependencies install nahi hain
```powershell
cd frontend
npm install
cd ..
npm run dev
```

### Error: "MongoDB connection error"
**Solution**: MongoDB service start karein
```powershell
Start-Service MongoDB
```

### Error: "Port already in use"
**Solution**: 
- Port 5000 (backend): Kisi aur app ko band karein ya `.env` mein PORT change karein
- Port 3000 (frontend): React automatically next port use karega

## Separate Terminals Mein Run Karna

Agar separately run karna ho:

**Terminal 1 - Backend:**
```powershell
npm run server
```

**Terminal 2 - Frontend:**
```powershell
npm run client
```

Par `npm run dev` se ek hi terminal mein sab ho jata hai! 🚀

