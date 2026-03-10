import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getWeeklyActiveUsers = () => api.get('/analytics/weekly-active-users');
export const getEventFrequency = () => api.get('/analytics/events');
export const getDeviceUsage = () => api.get('/analytics/devices');
export const getSessionDuration = () => api.get('/analytics/session-duration');

export default api;
