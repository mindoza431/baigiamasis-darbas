import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log('Siunčiama užklausa:', {
      url: config.url,
      method: config.method,
      data: config.data,
    });
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Užklausos klaida:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('Gautas atsakymas:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('Atsakymo klaida:', {
      message: error.message,
      response: error.response,
      request: error.request,
    });
    return Promise.reject(error);
  }
);

export default api; 