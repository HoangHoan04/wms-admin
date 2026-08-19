import { message } from 'ant-design-vue';
import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wms_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem('wms_access_token');
      localStorage.removeItem('wms_user_info');
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login';
      }
    } else if (status === 403) {
      message.error('Bạn không có quyền thực hiện thao tác này!');
    } else if (status === 500) {
      message.error('Lỗi máy chủ nội bộ. Vui lòng thử lại sau!');
    } else if (error.code === 'ERR_NETWORK') {
      message.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng!');
    }

    return Promise.reject(error);
  },
);

export default api;

export function request<T = any>(config: AxiosRequestConfig): Promise<T> {
  return api.request(config) as unknown as Promise<T>;
}
