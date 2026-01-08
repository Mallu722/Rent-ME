import api from '../config/api';

export interface CreateReviewData {
  booking: string;
  rating: number;
  comment?: string;
  tags?: string[];
}

export const reviewService = {
  createReview: async (data: CreateReviewData) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  getCompanionReviews: async (companionId: string, page = 1, limit = 20) => {
    const response = await api.get(`/reviews/companion/${companionId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  getMyReviews: async () => {
    const response = await api.get('/reviews/my-reviews');
    return response.data;
  },
};
