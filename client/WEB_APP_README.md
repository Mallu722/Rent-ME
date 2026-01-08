# 🌐 Rent Me - Web Application

Complete React web application for the Rent Me companion booking platform.

## ✅ What's Built

### Pages Created (15+)
1. **Login** - User authentication
2. **Signup** - Account creation with role selection
3. **Dashboard** - Home page with companion listings
4. **Companions** - Browse and filter companions
5. **CompanionDetail** - View companion profile and reviews
6. **Booking** - Create and manage bookings
7. **Bookings** - View all bookings with filters
8. **Chat** - List of conversations
9. **ChatRoom** - Real-time chat interface
10. **Profile** - User profile management
11. **CompanionProfile** - Companion settings
12. **Review** - Rate and review companions
13. **Payment** - Payment processing
14. **AdminDashboard** - Admin statistics

### Features
- ✅ Responsive design (mobile-friendly)
- ✅ Modern UI with CSS styling
- ✅ React Router navigation
- ✅ Socket.IO real-time chat
- ✅ Payment integration ready
- ✅ Admin dashboard
- ✅ Protected routes
- ✅ Authentication context

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd Rent-ME/client
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 3. Make Sure Backend is Running
The backend should be running on `http://localhost:5000`

## 📁 Project Structure

```
client/
├── src/
│   ├── pages/          # All page components
│   ├── components/     # Reusable components
│   ├── context/        # React contexts (Auth, Socket)
│   ├── services/       # API service
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point
├── index.html
├── vite.config.js
└── package.json
```

## 🎨 Design Features

- Modern, clean UI
- Responsive layout
- Color scheme: Blue (#007AFF) primary
- Card-based design
- Smooth transitions
- Mobile-first approach

## 🔌 API Integration

All API calls go through `src/services/api.js` which:
- Adds JWT token to requests
- Handles 401 errors (auto logout)
- Base URL: `http://localhost:5000/api`

## 🔐 Authentication

- JWT tokens stored in localStorage
- Protected routes with `ProtectedRoute` component
- Role-based access control
- Auto-redirect on logout

## 💬 Real-time Chat

- Socket.IO client integration
- Real-time message updates
- Typing indicators (ready)
- Read receipts (ready)

## 💳 Payments

- Wallet system integration
- Stripe ready (needs Stripe Elements)
- Payment history
- Top-up functionality

## 📱 Responsive Design

Works on:
- Desktop (1200px+)
- Tablet (768px - 1200px)
- Mobile (< 768px)

## 🛠️ Tech Stack

- **React 18** - UI library
- **React Router 6** - Navigation
- **Vite** - Build tool
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time
- **CSS3** - Styling

## 🎯 Next Steps

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Open browser: `http://localhost:3000`
4. Create account and start using!

## 📝 Notes

- Backend must be running on port 5000
- Update API URL in `src/services/api.js` if needed
- Socket.IO connects to `http://localhost:5000`
- All routes are protected except Login/Signup

---

**Your web application is ready! 🎉**
