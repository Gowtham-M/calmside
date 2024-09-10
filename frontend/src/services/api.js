import axios from 'axios';

// Set base URL for API requests
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export default api;
