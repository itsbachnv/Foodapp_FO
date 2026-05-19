import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Tự động gắn JWT vào mỗi request
const safeGet = async (key: string) => {
  try {
    if ((SecureStore as any).getItemAsync) return await (SecureStore as any).getItemAsync(key);
    if ((SecureStore as any).getValueWithKeyAsync) return await (SecureStore as any).getValueWithKeyAsync(key);
  } catch (e) {
    // ignore and fallback to localStorage below
  }
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage.getItem(key);
  } catch (e) {
    // ignore
  }
  return null;
};

const safeDelete = async (key: string) => {
  try {
    if ((SecureStore as any).deleteItemAsync) return await (SecureStore as any).deleteItemAsync(key);
    if ((SecureStore as any).deleteValueWithKeyAsync) return await (SecureStore as any).deleteValueWithKeyAsync(key);
  } catch (e) {
    // ignore and fallback
  }
  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage.removeItem(key);
  } catch (e) {
    // ignore
  }
};

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await safeGet('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Xử lý lỗi global
api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await safeDelete('accessToken');
      await safeDelete('refreshToken');
    }
    return Promise.reject(error);
  }
);