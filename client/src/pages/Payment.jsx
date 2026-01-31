import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Payment.css';

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [selectedUpi, setSelectedUpi] = useState('');
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const bookingRes = await api.get(`/bookings/${bookingId}`);
      if (bookingRes.data.success) {
        setBooking(bookingRes.data.data.booking);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Mock booking data if API fails (for demo flow)
      setBooking({
        _id: bookingId,
        activity: 'Mock Activity',
        date: new Date().toISOString(),
        startTime: '10:00',
        endTime: '12:00',
        pricing: { total: 900 }
      });
    }
  };

  const handleCardChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    setLoading(true);

    // Simulate processing delay
    setTimeout(() => {
      setLoading(false);
      alert(`Payment of ₹${booking?.pricing?.total} successful via ${paymentMethod === 'upi' ? selectedUpi : 'Card'}!`);
      navigate('/'); // Redirect to dashboard or bookings
    }, 2500);
  };

  if (!booking) {
    return <div className="loading">Loading Payment Details...</div>;
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1>Complete Payment</h1>

        <div className="booking-summary-card">
          <h3>Booking Summary</h3>
          <div className="summary-row">
            <span>Amount to Pay</span>
            <span className="amount">₹{booking.pricing?.total?.toFixed(2)}</span>
          </div>
        </div>

        <div className="payment-tabs">
          <button
            className={`tab-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('upi')}
          >
            UPI (PhonePe/GPay)
          </button>
          <button
            className={`tab-btn ${paymentMethod === 'card' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('card')}
          >
            Credit/Debit Card
          </button>
        </div>

        <div className="payment-content">
          {paymentMethod === 'upi' && (
            <div className="upi-content">
              <h4>Select UPI App</h4>
              <div className="upi-options">
                <div
                  className={`upi-option ${selectedUpi === 'PhonePe' ? 'selected' : ''}`}
                  onClick={() => setSelectedUpi('PhonePe')}
                >
                  <span className="upi-icon">🟣</span>
                  <span>PhonePe</span>
                </div>
                <div
                  className={`upi-option ${selectedUpi === 'Google Pay' ? 'selected' : ''}`}
                  onClick={() => setSelectedUpi('Google Pay')}
                >
                  <span className="upi-icon">🔵</span>
                  <span>Google Pay</span>
                </div>
                <div
                  className={`upi-option ${selectedUpi === 'Paytm' ? 'selected' : ''}`}
                  onClick={() => setSelectedUpi('Paytm')}
                >
                  <span className="upi-icon">💠</span>
                  <span>Paytm</span>
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="card-form">
              <div className="input-group">
                <label>Card Number</label>
                <input
                  type="text"
                  name="number"
                  placeholder="0000 0000 0000 0000"
                  value={cardDetails.number}
                  onChange={handleCardChange}
                  maxLength="19"
                />
              </div>
              <div className="input-group">
                <label>Card Holder Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={handleCardChange}
                />
              </div>
              <div className="form-row-split">
                <div className="input-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    name="expiry"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={handleCardChange}
                    maxLength="5"
                  />
                </div>
                <div className="input-group">
                  <label>CVV</label>
                  <input
                    type="password"
                    name="cvv"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={handleCardChange}
                    maxLength="3"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handlePayment}
          className="pay-button"
          disabled={loading || (paymentMethod === 'upi' && !selectedUpi) || (paymentMethod === 'card' && !cardDetails.number)}
        >
          {loading ? (
            <span className="spinner">Processing...</span>
          ) : (
            `Pay ₹${booking.pricing?.total?.toFixed(2)}`
          )}
        </button>
      </div>
    </div>
  );
};

export default Payment;
