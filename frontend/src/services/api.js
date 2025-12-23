import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Aggregation API
export const getDelaysByNeighborhood = async () => {
  const response = await api.get('/delays/aggregate/by-neighborhood');
  return response.data;
};

// CRUD APIs
export const getAllDelays = async (page = 1, limit = 10, status = 'active') => {
  const response = await api.get('/delays', {
    params: { page, limit, status },
  });
  return response.data;
};

export const createDelay = async (delayData) => {
  const response = await api.post('/delays', delayData);
  return response.data;
};

export const deleteDelay = async (id) => {
  const response = await api.delete(`/delays/${id}`);
  return response.data;
};

export const resolveDelay = async (id) => {
  const response = await api.patch(`/delays/${id}/resolve`);
  return response.data;
};

export default api;

