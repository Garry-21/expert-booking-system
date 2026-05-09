import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';
    return Promise.reject({ message, status: error.response?.status });
  }
);

// Expert APIs
export const getExperts = (params = {}) => {
  return api.get('/experts', { params });
};

export const getExpertById = (id) => {
  return api.get(`/experts/${id}`);
};

// Booking APIs
export const createBooking = (bookingData) => {
  return api.post('/bookings', bookingData);
};

export const getBookingsByEmail = (email) => {
  return api.get('/bookings', { params: { email } });
};

export const updateBookingStatus = (id, status) => {
  return api.patch(`/bookings/${id}/status`, { status });
};

export default api;
