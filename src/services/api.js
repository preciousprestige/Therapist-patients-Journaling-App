import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: BASE_URL, headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

// Journals (patient entries)
export const journalAPI = {
  getAll: () => api.get('/journals'),
  getById: (id) => api.get(`/journals/${id}`),
  create: (data) => api.post('/journals', data),
  update: (id, data) => api.put(`/journals/${id}`, data),
  delete: (id) => api.delete(`/journals/${id}`),
  getPatientJournals: (patientId) => api.get(`/journals/patient/${patientId}`),
};

// Session Notes (therapist notes)
export const notesAPI = {
  getAll: () => api.get('/notes'),
  getById: (id) => api.get(`/notes/${id}`),
  create: (data) => api.post('/notes', data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
  getPatientNotes: (patientId) => api.get(`/notes/patient/${patientId}`),
};

// Mood check-ins
export const moodAPI = {
  getAll: () => api.get('/moods'),
  create: (data) => api.post('/moods', data),
  getPatientMoods: (patientId) => api.get(`/moods/patient/${patientId}`),
};

// Messages
export const messageAPI = {
  getConversation: (userId) => api.get(`/messages/${userId}`),
  send: (data) => api.post('/messages', data),
  getConversations: () => api.get('/messages'),
};

// Users
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getPatients: () => api.get('/users?role=patient'),
  getTherapists: () => api.get('/users?role=therapist'),
  getMyPatients: () => api.get('/users/my-patients'),
};

export default api;

// Ratings
export const ratingsAPI = {
  submit: (data) => api.post('/ratings', data),
  getMyRating: () => api.get('/ratings/my'),
  getTherapistRatings: (id) => api.get(`/ratings/therapist/${id}`),
};

// Care Packages
export const carePackageAPI = {
  send: (data) => api.post('/care-packages', data),
  getMy: () => api.get('/care-packages/my'),
  markRead: (id) => api.put(`/care-packages/${id}/read`),
};
