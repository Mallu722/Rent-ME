import api from '../config/api';

export const userService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data: any) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  uploadProfilePhoto: async (uri: string) => {
    const formData = new FormData();
    formData.append('photo', {
      uri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    } as any);

    const response = await api.post('/users/profile/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  blockUser: async (userId: string) => {
    const response = await api.post(`/users/block/${userId}`);
    return response.data;
  },

  unblockUser: async (userId: string) => {
    const response = await api.post(`/users/unblock/${userId}`);
    return response.data;
  },

  reportUser: async (userId: string, reason?: string) => {
    const response = await api.post(`/users/report/${userId}`, { reason });
    return response.data;
  },
};
