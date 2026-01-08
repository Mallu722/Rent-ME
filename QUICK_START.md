# 🚀 Quick Start Guide - Fix Network Errors

## The Problem
If you see "Network Error" when trying to login/signup, it means the **backend server is not running**.

## ✅ Solution - Start Both Servers

### Step 1: Start Backend Server

Open **Terminal 1** (or Command Prompt):

```bash
cd Rent-ME/server
npm install
npm run dev
```

**You should see:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📱 Environment: development
```

**If you see MongoDB connection error:**
- Make sure MongoDB is installed and running
- Or update `server/.env` with MongoDB Atlas connection string

### Step 2: Start Frontend (Web App)

Open **Terminal 2** (new terminal window):

```bash
cd Rent-ME/client
npm install
npm run dev
```

**You should see:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### Step 3: Open Browser

Go to: **http://localhost:3000**

Now you can:
- ✅ Sign up for a new account
- ✅ Login with your credentials
- ✅ Use all features

## 🔍 Verify Backend is Running

Test the backend health endpoint:

**In browser or terminal:**
```
http://localhost:5000/api/health
```

**Should return:**
```json
{"status":"OK","message":"Rent Me API is running"}
```

## ⚠️ Common Issues

### Issue 1: "Cannot connect to server"
**Solution:** Backend is not running. Start it with `cd server && npm run dev`

### Issue 2: MongoDB Connection Error
**Solution:** 
- Install MongoDB locally, OR
- Use MongoDB Atlas (free cloud database)
- Update `server/.env` with connection string

### Issue 3: Port Already in Use
**Solution:**
- Change port in `server/.env`: `PORT=5001`
- Update `client/src/services/api.js` to use new port

### Issue 4: CORS Error
**Solution:** Backend already has CORS enabled. Make sure backend is running.

## 📝 Setup MongoDB (If Not Installed)

### Option 1: MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Add to `server/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rentme
```

### Option 2: Local MongoDB
1. Download from https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service
4. Use in `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/rentme
```

## 🎯 Complete Setup Checklist

- [ ] Backend dependencies installed (`cd server && npm install`)
- [ ] Frontend dependencies installed (`cd client && npm install`)
- [ ] MongoDB running (local or Atlas)
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 3000
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:5000/api/health

## 🆘 Still Having Issues?

1. **Check both terminals are running:**
   - Terminal 1: Backend (port 5000)
   - Terminal 2: Frontend (port 3000)

2. **Check browser console (F12):**
   - Look for error messages
   - Check Network tab for failed requests

3. **Restart both servers:**
   - Stop both (Ctrl+C)
   - Start backend first
   - Then start frontend

4. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R

---

**Once both servers are running, the network error will be fixed! ✅**
