# 📱 Rent Me - Application Output & Setup

## 🎯 What We Built

A complete full-stack companion booking mobile application with:

### ✅ Backend (Node.js + Express + TypeScript)
- RESTful API with 8 route modules
- Real-time chat with Socket.IO
- MongoDB database with 6 models
- JWT authentication & authorization
- Stripe payment integration
- File upload system
- Admin dashboard API

### ✅ Mobile App (React Native + TypeScript)
- 15+ screens with full navigation
- Real-time chat interface
- Payment processing
- Profile management
- Booking system
- Review & rating system
- Admin dashboard

## 📂 Project Structure

```
Rent-ME/
│
├── 📱 mobile/                    # React Native Mobile App
│   ├── App.tsx                   # Main entry point
│   ├── src/
│   │   ├── screens/             # 15+ screens
│   │   │   ├── auth/            # Login, Signup
│   │   │   ├── chat/            # Chat list, Chat screen
│   │   │   ├── admin/           # Admin dashboard
│   │   │   └── companion/       # Companion profile
│   │   ├── services/            # API service layer
│   │   ├── navigation/          # Navigation setup
│   │   ├── context/             # Auth & Socket contexts
│   │   └── config/              # API configuration
│   └── package.json
│
├── 🖥️ server/                    # Backend API Server
│   ├── src/
│   │   ├── index.ts             # Server entry point
│   │   ├── models/              # 6 MongoDB models
│   │   │   ├── User.model.ts
│   │   │   ├── Companion.model.ts
│   │   │   ├── Booking.model.ts
│   │   │   ├── Review.model.ts
│   │   │   ├── Message.model.ts
│   │   │   └── Payment.model.ts
│   │   ├── routes/              # 8 API route modules
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── companion.routes.ts
│   │   │   ├── booking.routes.ts
│   │   │   ├── review.routes.ts
│   │   │   ├── chat.routes.ts
│   │   │   ├── admin.routes.ts
│   │   │   └── payment.routes.ts
│   │   ├── middleware/          # Auth & validation
│   │   ├── socket/              # Socket.IO handlers
│   │   └── utils/               # Utilities
│   └── package.json
│
└── 📄 Documentation
    ├── README.md                # Full documentation
    ├── QUICKSTART.md            # Quick start guide
    └── SETUP.md                 # This file
```

## 🚀 How to Run

### Step 1: Install Dependencies

**Backend:**
```powershell
cd Rent-ME\server
npm install
```

**Mobile:**
```powershell
cd Rent-ME\mobile
npm install
```

### Step 2: Setup Environment

1. Create `server\.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/rentme
JWT_SECRET=your_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
```

2. Update mobile API URL in `mobile\src\config\api.ts`:
```typescript
const API_BASE_URL = __DEV__
  ? 'http://YOUR_IP:5000/api'  // Replace YOUR_IP with your computer's IP
  : 'https://your-api.com/api';
```

### Step 3: Start Backend

```powershell
cd Rent-ME\server
npm run dev
```

**Expected Output:**
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📱 Environment: development
```

### Step 4: Start Mobile App

```powershell
cd Rent-ME\mobile
npm start
```

**Expected Output:**
```
Starting Metro Bundler...
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go
```

## 📱 Application Screens

### Authentication Flow
1. **Login Screen** - Email/password login
2. **Signup Screen** - Create account (User/Companion)

### Main App Screens
3. **Home Screen** - Browse companions with search
4. **Companions Screen** - Filtered companion listing
5. **Companion Detail** - View profile, reviews, pricing
6. **Booking Screen** - Create/manage bookings
7. **Payment Screen** - Stripe/wallet payment
8. **Bookings Screen** - View all bookings
9. **Chat List** - Conversations
10. **Chat Screen** - Real-time messaging
11. **Review Screen** - Rate companions
12. **Profile Screen** - User profile & settings
13. **Companion Profile** - Manage companion settings
14. **Admin Dashboard** - Platform statistics

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Companions
- `GET /api/companions` - List with filters
- `GET /api/companions/:id` - Get details
- `POST /api/companions` - Create/update profile

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - User bookings
- `PUT /api/bookings/:id/status` - Update status

### Chat (Socket.IO)
- `GET /api/chat/conversations` - Get conversations
- `GET /api/chat/:userId` - Get messages
- Socket events: `send_message`, `new_message`

### Payments
- `POST /api/payments/create-intent` - Stripe intent
- `POST /api/payments/wallet/pay` - Wallet payment
- `GET /api/payments/history` - Payment history

### Admin
- `GET /api/admin/dashboard/stats` - Statistics
- `GET /api/admin/users` - Manage users
- `PUT /api/admin/users/:id/status` - Activate/deactivate

## 🧪 Test the Application

### 1. Create Account
- Open app → Sign up
- Enter name, email, password
- Select role (User/Companion)

### 2. As a User
- Browse companions
- View companion details
- Create booking
- Make payment
- Chat with companion
- Leave review

### 3. As a Companion
- Go to Profile → Manage Companion Profile
- Set activities, pricing, availability
- Accept/reject bookings
- Chat with users

### 4. Test API
```powershell
# Health check
curl http://localhost:5000/api/health

# Signup
curl -X POST http://localhost:5000/api/auth/signup `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"test@test.com\",\"password\":\"123456\",\"name\":\"Test User\"}'
```

## 📊 Database Collections

1. **Users** - User accounts & profiles
2. **Companions** - Companion profiles & availability
3. **Bookings** - Booking records
4. **Reviews** - Ratings & reviews
5. **Messages** - Chat messages
6. **Payments** - Payment transactions

## 🎨 Features Implemented

✅ JWT Authentication  
✅ Role-based Access Control  
✅ Real-time Chat (Socket.IO)  
✅ Payment Gateway (Stripe)  
✅ Wallet System  
✅ Admin Dashboard  
✅ File Uploads  
✅ Search & Filters  
✅ Reviews & Ratings  
✅ Booking Management  
✅ Safety Features (Report/Block)  

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`

### Port Already in Use
- Change PORT in `server/.env`

### Mobile Can't Connect
- Use IP address instead of localhost
- Check firewall settings
- Ensure same network

### Expo Issues
```powershell
cd Rent-ME\mobile
expo start -c  # Clear cache
```

## 📝 Next Steps

1. ✅ Set up MongoDB (local or Atlas)
2. ✅ Configure Stripe account
3. ✅ Update API URLs
4. ✅ Test all features
5. ✅ Deploy backend
6. ✅ Build mobile app

---

**Your application is ready! 🎉**

Start the backend and mobile app, then scan the QR code with Expo Go to see it in action!
