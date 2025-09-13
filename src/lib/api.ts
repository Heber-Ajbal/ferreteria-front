import axios from 'axios';


const api = axios.create({
baseURL: 'ferreteria-api-production.up.railway.app',
headers: { 'Content-Type': 'application/json' },
});


// Lee el token desde tu store (ver sección Pinia) cuando exista
api.interceptors.request.use((config) => {
const token = localStorage.getItem('accessToken');
if (token) {
config.headers = config.headers || {};
(config.headers as any)['Authorization'] = `Bearer ${token}`;
}
return config;
});


// Manejo global de errores y 401
api.interceptors.response.use(
(res) => res,
async (error) => {
if (error.response?.status === 401) {
// Opción A: Redirigir al login
window.location.href = '/login';
// Opción B (si tienes refresh): intenta refrescar y repetir la petición
// ...
}
return Promise.reject(error);
}
);
 

export default api;