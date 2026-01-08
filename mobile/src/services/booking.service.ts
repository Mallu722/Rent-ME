import api from '../config/api';

export interface CreateBookingData {
  companion: string;
  activity: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  location?: {
    address: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  specialRequests?: string;
}

export const bookingService = {
  createBooking: async (data: CreateBookingData) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  getMyBookings: async (status?: string, page = 1, limit = 20) => {
    const response = await api.get('/bookings/my-bookings', {
      params: { status, page, limit },
    });
    return response.data;
  },

  getCompanionBookings: async (status?: string, page = 1, limit = 20) => {
    const response = await api.get('/bookings/companion-bookings', {
      params: { status, page, limit },
    });
    return response.data;
  },

  getBookingById: async (id: string) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  updateBookingStatus: async (id: string, status: string) => {
    const response = await api.put(`/bookings/${id}/status`, { status });
    return response.data;
  },

  checkIn: async (id: string, location?: { lat: number; lng: number }) => {
    const response = await api.post(`/bookings/${id}/checkin`, { location });
    return response.data;
  },

  checkOut: async (id: string, location?: { lat: number; lng: number }) => {
    const response = await api.post(`/bookings/${id}/checkout`, { location });
    return response.data;
  },
};
