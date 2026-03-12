import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Axios Interceptor for latency logging and auth
api.interceptors.request.use(config => {
  config.metadata = { startTime: new Date() };
  // Attach token if present
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const { token } = JSON.parse(user);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {}
  }
  return config;
});
api.interceptors.response.use(
  response => {
    const { startTime } = response.config.metadata || {};
    if (startTime) {
      const latency = new Date() - startTime;
      console.log(`[API] ${response.config.url} - ${latency}ms`);
    }
    return response;
  },
  error => {
    const { startTime } = error.config?.metadata || {};
    if (startTime) {
      const latency = new Date() - startTime;
      console.log(`[API] ${error.config?.url} - ${latency}ms (error)`);
    }
    return Promise.reject(error);
  }
);

export const getWeeklyActiveUsers = () => api.get('/analytics/weekly-active-users');
export const getEventFrequency = () => api.get('/analytics/events');
export const getDeviceUsage = () => api.get('/analytics/devices');
export const getSessionDuration = () => api.get('/analytics/session-duration');

export default api;
