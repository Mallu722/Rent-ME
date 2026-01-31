import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Companions from './pages/Companions';
import CompanionDetail from './pages/CompanionDetail';
import Booking from './pages/Booking';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import Review from './pages/Review';
import Payment from './pages/Payment';
import AdminDashboard from './pages/AdminDashboard';
import CompanionProfile from './pages/CompanionProfile';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/companions"
                  element={
                    <ProtectedRoute>
                      <Companions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/companions/:id"
                  element={
                    <ProtectedRoute>
                      <CompanionDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bookings"
                  element={
                    <ProtectedRoute>
                      <Bookings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bookings/:id"
                  element={
                    <ProtectedRoute>
                      <Booking />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/book/:companionId"
                  element={
                    <ProtectedRoute>
                      <Booking />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/companion-profile"
                  element={
                    <ProtectedRoute>
                      <CompanionProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/review/:bookingId"
                  element={
                    <ProtectedRoute>
                      <Review />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment/:bookingId"
                  element={
                    <ProtectedRoute>
                      <Payment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
