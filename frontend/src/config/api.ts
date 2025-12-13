const BACKEND_HOST = import.meta.env.VITE_BACKEND_HOST || 'localhost';
const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || '8000';
const API_PATH = import.meta.env.VITE_API_PATH || '/api/v1';

export const API_BASE = `http://${BACKEND_HOST}:${BACKEND_PORT}`;
export const API_URL = `${API_BASE}${API_PATH}`;
