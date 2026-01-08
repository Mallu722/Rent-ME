import api from '../config/api';

export interface CompanionFilters {
  activity?: string;
  city?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export const companionService = {
  getCompanions: async (filters: CompanionFilters = {}) => {
    const response = await api.get('/companions', { params: filters });
    return response.data;
  },

  getCompanionById: async (id: string) => {
    const response = await api.get(`/companions/${id}`);
    return response.data;
  },

  createCompanionProfile: async (data: any) => {
    const response = await api.post('/companions', data);
    return response.data;
  },

  updateAvailability: async (data: any) => {
    const response = await api.put('/companions/availability', data);
    return response.data;
  },

  updatePricing: async (data: any) => {
    const response = await api.put('/companions/pricing', data);
    return response.data;
  },
};
