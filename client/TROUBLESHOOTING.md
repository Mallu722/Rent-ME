# Troubleshooting Network Errors

## Common Network Error Solutions

### Error: "Network Error" or "Cannot connect to server"

This means the frontend cannot reach the backend server. Here's how to fix it:

### 1. Check if Backend Server is Running

**Start the backend server:**
```bash
cd Rent-ME/server
npm install  # If not already installed
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

### 2. Check Backend Port

Make sure the backend is running on port **5000**. Check `server/.env`:
```env
PORT=5000
```

### 3. Check API URL Configuration

The frontend is configured to use:
- Development: `http://localhost:5000/api`
- Or via Vite proxy: `/api` (which proxies to `http://localhost:5000`)

### 4. Check CORS Settings

The backend should have CORS enabled (it does in `server/src/index.ts`):
```typescript
app.use(cors());
```

### 5. Check MongoDB Connection

Make sure MongoDB is running:
- Local MongoDB: `mongod`
- Or use MongoDB Atlas connection string in `server/.env`

### 6. Test Backend Health

Test if backend is accessible:
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{"status":"OK","message":"Rent Me API is running"}
```

### 7. Browser Console Check

Open browser DevTools (F12) and check:
- **Console tab**: Look for CORS errors
- **Network tab**: Check if requests are being sent and what the response is

### 8. Common Issues

**Issue: "ERR_NETWORK"**
- Backend server is not running
- Backend is on different port
- Firewall blocking connection

**Issue: "CORS error"**
- Backend CORS not configured
- Frontend and backend on different origins

**Issue: "404 Not Found"**
- API route doesn't exist
- Wrong API endpoint URL

### Quick Fix Checklist

✅ Backend server running on port 5000
✅ MongoDB connected
✅ Frontend running on port 3000
✅ No firewall blocking localhost:5000
✅ CORS enabled in backend
✅ API URL correct in frontend

### Test Connection

1. Open browser console (F12)
2. Go to Network tab
3. Try to login
4. Check the request to `/api/auth/login`
5. See the error response

### Still Having Issues?

1. **Restart both servers:**
   - Stop backend (Ctrl+C)
   - Stop frontend (Ctrl+C)
   - Start backend: `cd server && npm run dev`
   - Start frontend: `cd client && npm run dev`

2. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

3. **Check environment variables:**
   - Make sure `server/.env` exists and has correct values

4. **Check for port conflicts:**
   - Make sure nothing else is using port 5000 or 3000
