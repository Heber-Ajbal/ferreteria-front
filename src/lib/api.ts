import axios from 'axios';

// 1) Lee y sanea la URL del .env (asegura https y sin '/' final)
const RAW = import.meta.env.VITE_API_URL || '';
const BASE_URL = (/^https?:\/\//i.test(RAW) ? RAW : `https://${RAW}`).replace(/\/+$/, '');

if (!BASE_URL) {
  // Te avisa en build/runtime si faltó definir la variable
  // (quítalo si no lo quieres ver en consola)
  // eslint-disable-next-line no-console
  console.error('VITE_API_URL no está definida');
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

// 2) Token (si hay)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3) 401 global
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      return;
    }
    return Promise.reject(error);
  }
);

export default api;
