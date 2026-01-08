import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Payment.css';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bookingRes, walletRes] = await Promise.all([
        api.get(`/bookings/${bookingId}`),
        api.get('/payments/wallet'),
      ]);

      if (bookingRes.data.success) {
        setBooking(bookingRes.data.data.booking);
      }
      if (walletRes.data.success) {
        setWallet(walletRes.data.data.wallet);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      if (paymentMethod === 'wallet') {
        const response = await api.post('/payments/wallet/pay', { bookingId });
        if (response.data.success) {
          navigate('/bookings');
        }
      } else {
        // Stripe payment would go here
        alert('Stripe payment integration coming soon');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (!booking) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1>Complete Payment</h1>
        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <p>Activity: {booking.activity}</p>
          <p>Date: {new Date(booking.date).toLocaleDateString()}</p>
          <p>Time: {booking.startTime} - {booking.endTime}</p>
          <div className="total">
            <span>Total:</span>
            <span>${booking.pricing?.total?.toFixed(2)}</span>
          </div>
        </div>

        {wallet && (
          <div className="wallet-info">
            <p>Wallet Balance: ${wallet.balance?.toFixed(2)}</p>
            {wallet.balance < booking.pricing.total && (
              <p className="insufficient">Insufficient balance. Please top up.</p>
            )}
          </div>
        )}

        <div className="payment-methods">
          <h3>Payment Method</h3>
          <button
            className={`method-button ${paymentMethod === 'wallet' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('wallet')}
          >
            Wallet
          </button>
          <button
            className={`method-button ${paymentMethod === 'stripe' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('stripe')}
          >
            Credit/Debit Card (Stripe)
          </button>
        </div>

        <button
          onClick={handlePayment}
          className="pay-button"
          disabled={loading || (paymentMethod === 'wallet' && wallet?.balance < booking.pricing.total)}
        >
          {loading ? 'Processing...' : `Pay $${booking.pricing?.total?.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};

export default Payment;
