import api from '../config/api';

export const paymentService = {
  createPaymentIntent: async (bookingId: string, amount: number, currency = 'usd') => {
    const response = await api.post('/payments/create-intent', {
      bookingId,
      amount,
      currency,
    });
    return response.data;
  },

  confirmPayment: async (paymentIntentId: string, bookingId: string, method = 'stripe') => {
    const response = await api.post('/payments/confirm', {
      paymentIntentId,
      bookingId,
      method,
    });
    return response.data;
  },

  topUpWallet: async (amount: number, paymentMethod: string, paymentIntentId?: string) => {
    const response = await api.post('/payments/wallet/topup', {
      amount,
      paymentMethod,
      paymentIntentId,
    });
    return response.data;
  },

  payWithWallet: async (bookingId: string) => {
    const response = await api.post('/payments/wallet/pay', { bookingId });
    return response.data;
  },

  getPaymentHistory: async (page = 1, limit = 20) => {
    const response = await api.get('/payments/history', {
      params: { page, limit },
    });
    return response.data;
  },

  getWallet: async () => {
    const response = await api.get('/payments/wallet');
    return response.data;
  },
};
