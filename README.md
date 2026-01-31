# Saathi - Full-Stack Companion Booking Application

A comprehensive full-stack mobile application built with React Native (TypeScript) and Node.js/Express backend, enabling users to find, book, and interact with verified companions for various activities.

## 🚀 Features

### Core Features
- **User Authentication**: JWT-based authentication with role-based access (User, Companion, Admin)
- **Companion Discovery**: Search and filter companions by activity, location, rating, and price
- **Booking System**: Create, manage, and track bookings with status management
- **Real-time Chat**: Socket.IO-powered messaging between users and companions
- **Reviews & Ratings**: Rate and review companions after service completion
- **Payment Integration**: Stripe payment gateway with wallet system
- **Admin Dashboard**: Comprehensive admin panel for platform management
- **Safety Features**: Report/block users, SOS emergency functionality

### Technology Stack

**Frontend (Mobile)**
- React Native with TypeScript
- Expo
- React Navigation
- Socket.IO Client
- Stripe React Native SDK
- AsyncStorage

**Backend**
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Socket.IO
- JWT Authentication
- Stripe API
- Multer for file uploads

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Expo CLI (`npm install -g expo-cli`)
- Stripe account (for payments)

### Backend Setup

1. Navigate to server directory:
```bash
cd Rent-ME/server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in `server` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/saathi
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

4. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Mobile App Setup

1. Navigate to mobile directory:
```bash
cd Rent-ME/mobile
```

2. Install dependencies:
```bash
npm install
```

3. Update API configuration in `src/config/api.ts`:
```typescript
const API_BASE_URL = __DEV__
  ? 'http://YOUR_LOCAL_IP:5000/api'  // Replace with your local IP
  : 'https://your-production-api.com/api';
```

4. Start Expo:
```bash
npm start
```

5. Scan QR code with Expo Go app (iOS/Android) or press `i` for iOS simulator / `a` for Android emulator

## 📁 Project Structure

```
Rent-ME/
├── server/
│   ├── src/
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── middleware/     # Auth & validation middleware
│   │   ├── socket/          # Socket.IO handlers
│   │   ├── utils/           # Utility functions
│   │   └── index.ts         # Server entry point
│   ├── uploads/             # Uploaded files
│   └── package.json
├── mobile/
│   ├── src/
│   │   ├── screens/         # App screens
│   │   ├── navigation/      # Navigation setup
│   │   ├── services/        # API services
│   │   ├── context/         # React contexts
│   │   └── config/          # Configuration
│   └── package.json
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Companions
- `GET /api/companions` - Get all companions (with filters)
- `GET /api/companions/:id` - Get companion details
- `POST /api/companions` - Create/update companion profile

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/companion-bookings` - Get companion bookings
- `PUT /api/bookings/:id/status` - Update booking status
- `POST /api/bookings/:id/checkin` - Check-in
- `POST /api/bookings/:id/checkout` - Check-out

### Chat
- `GET /api/chat/conversations` - Get conversations
- `GET /api/chat/:userId` - Get messages with user
- Socket.IO events: `send_message`, `new_message`, `typing`

### Payments
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/confirm` - Confirm payment
- `POST /api/payments/wallet/topup` - Top up wallet
- `POST /api/payments/wallet/pay` - Pay with wallet
- `GET /api/payments/history` - Payment history

### Admin
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Activate/deactivate user
- `PUT /api/admin/companions/:id/verify` - Verify companion

## 🗄️ Database Schema

### Collections
- **Users**: User accounts with roles and profiles
- **Companions**: Companion-specific data and availability
- **Bookings**: Booking records with status tracking
- **Reviews**: User reviews and ratings
- **Messages**: Chat messages
- **Payments**: Payment transactions

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- File upload restrictions
- CORS configuration

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Mobile Testing
- Use Expo Go app for development
- Test on iOS Simulator / Android Emulator
- Test on physical devices

## 📱 Mobile App Features

### User Flow
1. **Signup/Login**: Create account or login
2. **Browse Companions**: Search and filter companions
3. **View Details**: See companion profile, reviews, pricing
4. **Create Booking**: Select date, time, and activity
5. **Make Payment**: Pay via wallet or Stripe
6. **Chat**: Communicate with companion (post-booking)
7. **Review**: Rate and review after service

### Companion Flow
1. **Create Profile**: Set activities, pricing, availability
2. **Manage Bookings**: Accept/reject booking requests
3. **Chat**: Communicate with users
4. **Track Earnings**: View payment history

### Admin Flow
1. **Dashboard**: View platform statistics
2. **User Management**: Activate/deactivate users
3. **Companion Verification**: Verify companion profiles
4. **Monitor Bookings**: Track all bookings
5. **View Reports**: Handle user reports

## 🚨 Safety Features

- **Report Users**: Report inappropriate behavior
- **Block Users**: Block unwanted users
- **SOS Button**: Emergency assistance (to be implemented)
- **Check-in/Check-out**: Location-based tracking
- **Admin Monitoring**: Platform-wide monitoring

## 💳 Payment Integration

### Stripe Setup
1. Create Stripe account
2. Get API keys from Stripe Dashboard
3. Add keys to `.env` file
4. Test with Stripe test cards

### Wallet System
- Users can top up wallet
- Pay directly from wallet balance
- Transaction history tracking

## 🛠️ Development

### Running in Development
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Mobile
cd mobile
npm start
```

### Building for Production

**Backend:**
```bash
cd server
npm run build
npm start
```

**Mobile:**
```bash
cd mobile
expo build:android  # or expo build:ios
```

## 📝 Environment Variables

See `.env.example` in server directory for all required environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name

## 🙏 Acknowledgments

- React Native community
- Expo team
- Stripe for payment integration
- Socket.IO for real-time features

## 📞 Support

For support, email support@saathi.com or create an issue in the repository.

---

**Note**: This is a production-ready application structure. Make sure to:
- Set up proper environment variables
- Configure MongoDB connection
- Set up Stripe account
- Test all features thoroughly
- Deploy backend to a cloud service (Heroku, AWS, etc.)
- Deploy mobile app to App Store / Play Store
