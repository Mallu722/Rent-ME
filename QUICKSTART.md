# 🚀 Quick Start Guide - Rent Me Application

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js (v16+) installed
- ✅ MongoDB running (local or cloud)
- ✅ Expo CLI installed globally: `npm install -g expo-cli`
- ✅ Expo Go app on your phone (for testing)

## Step 1: Install Dependencies

### Backend Setup
```bash
cd Rent-ME/server
npm install
```

### Mobile App Setup
```bash
cd Rent-ME/mobile
npm install
```

## Step 2: Configure Environment

1. Create `.env` file in `Rent-ME/server/`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/rentme
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

2. Create `uploads` directory:
```bash
cd Rent-ME/server
mkdir uploads
```

3. Update API URL in mobile app:
   - Open `Rent-ME/mobile/src/config/api.ts`
   - Replace `localhost` with your computer's IP address (for device testing)
   - Example: `http://192.168.1.100:5000/api`

## Step 3: Start the Application

### Terminal 1 - Backend Server
```bash
cd Rent-ME/server
npm run dev
```

**Expected Output:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📱 Environment: development
```

### Terminal 2 - Mobile App
```bash
cd Rent-ME/mobile
npm start
```

**Expected Output:**
```
Starting Metro Bundler...
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

## Step 4: Test the Application

### On Your Phone:
1. Install **Expo Go** app (iOS App Store / Google Play)
2. Scan the QR code from Terminal 2
3. App will load on your device

### On Simulator/Emulator:
- **iOS**: Press `i` in the terminal
- **Android**: Press `a` in the terminal (requires Android Studio)

## Step 5: Create Your First Account

1. Open the app
2. Tap **"Sign up"**
3. Fill in:
   - Name
   - Email
   - Password (min 6 characters)
   - Select role: "Find Companions" or "Be a Companion"
4. Tap **"Sign Up"**

## Step 6: Test Features

### As a User:
1. ✅ Browse companions on Home screen
2. ✅ Search and filter companions
3. ✅ View companion details
4. ✅ Create a booking
5. ✅ Make payment
6. ✅ Chat with companion (after booking confirmed)
7. ✅ Leave a review

### As a Companion:
1. ✅ Go to Profile → "Manage Companion Profile"
2. ✅ Set activities, pricing, availability
3. ✅ View booking requests
4. ✅ Accept/reject bookings
5. ✅ Chat with users

### As an Admin:
1. ✅ Login with admin account
2. ✅ Access Admin Dashboard
3. ✅ View statistics
4. ✅ Manage users and bookings

## API Testing

### Test Backend Health:
```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Rent Me API is running"
}
```

### Test Authentication:
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "user"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Troubleshooting

### MongoDB Connection Error
```bash
# Start MongoDB (if local)
mongod

# Or use MongoDB Atlas connection string in .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rentme
```

### Port Already in Use
```bash
# Change PORT in server/.env
PORT=5001
```

### Mobile App Can't Connect to Backend
1. Check firewall settings
2. Ensure both devices are on same network
3. Use IP address instead of localhost
4. Check backend is running

### Expo Issues
```bash
# Clear cache
cd Rent-ME/mobile
expo start -c
```

## Project Structure Overview

```
Rent-ME/
├── server/                 # Backend API
│   ├── src/
│   │   ├── models/        # Database models
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Auth & validation
│   │   ├── socket/        # Real-time chat
│   │   └── utils/         # Helpers
│   └── uploads/           # Uploaded files
│
├── mobile/                # React Native App
│   ├── src/
│   │   ├── screens/       # App screens
│   │   ├── services/      # API calls
│   │   ├── navigation/    # Navigation setup
│   │   └── context/       # State management
│   └── App.tsx            # Entry point
│
└── README.md              # Full documentation
```

## Next Steps

1. ✅ Set up Stripe account for payments
2. ✅ Configure email service (optional)
3. ✅ Set up production MongoDB
4. ✅ Deploy backend to cloud (Heroku, AWS, etc.)
5. ✅ Build mobile app for App Store/Play Store

## Support

For issues or questions:
- Check `README.md` for detailed documentation
- Review error messages in console
- Check MongoDB connection
- Verify environment variables

---

**Happy Coding! 🎉**
