const BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST || 'localhost:8000';
const API_PATH = import.meta.env.VITE_API_PATH || '/api/v1';

const protocol = BACKEND_HOST.startsWith('localhost') ? 'http' : 'https';
export const API_BASE = `${protocol}://${BACKEND_HOST}`;
export const API_URL = `${API_BASE}${API_PATH}`;
