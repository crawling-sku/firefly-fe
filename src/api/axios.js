import axios from 'axios';

/** 공용 API 인스턴스 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

/** 공통 에러 처리 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  },
);

/** data 자동 추출 래퍼 */
export const API = {
  get: (url, config = {}) => api.get(url, config).then((res) => res.data),
  post: (url, data = {}, config = {}) => api.post(url, data, config).then((res) => res.data),
  put: (url, data = {}, config = {}) => api.put(url, data, config).then((res) => res.data),
  delete: (url, config = {}) => api.delete(url, config).then((res) => res.data),
};

export default api;
