import { useSyncExternalStore } from 'react';
import * as SecureStore from 'expo-secure-store';
import { decodeJwtPayload } from '@/utils/jwt';

interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  referralCode: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (token: string, refreshToken?: string | null, user?: User | null) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

type AuthSnapshot = Omit<AuthState, 'setAuth' | 'logout' | 'loadFromStorage'>;

const initialSnapshot: AuthSnapshot = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

let snapshot = initialSnapshot;
const listeners = new Set<() => void>();

const buildUserFromToken = (token: string): User => {
  const payload = decodeJwtPayload(token);
  const email = (payload?.sub || payload?.email || '') as string;

  return {
    id: email,
    email,
    phone: (payload?.phone as string) || '',
    firstName: (payload?.firstName as string) || '',
    lastName: (payload?.lastName as string) || '',
    referralCode: (payload?.referralCode as string) || '',
  };
};

const notify = () => {
  listeners.forEach((listener) => listener());
};

const updateSnapshot = (next: Partial<AuthSnapshot>) => {
  snapshot = { ...snapshot, ...next };
  notify();
};

const safeGet = async (key: string) => {
  try {
    if ((SecureStore as any).getItemAsync) return await (SecureStore as any).getItemAsync(key);
    if ((SecureStore as any).getValueWithKeyAsync) return await (SecureStore as any).getValueWithKeyAsync(key);
  } catch {
    // fall through to localStorage
  }

  try {
    if (typeof window !== 'undefined' && window.localStorage) return window.localStorage.getItem(key);
  } catch {
    // ignore
  }

  return null;
};

const safeSet = async (key: string, value: string) => {
  try {
    if ((SecureStore as any).setItemAsync) return await (SecureStore as any).setItemAsync(key, value);
    if ((SecureStore as any).setValueWithKeyAsync) return await (SecureStore as any).setValueWithKeyAsync(key, value);
  } catch {
    // fall through to localStorage
  }

  try {
    if (typeof window !== 'undefined' && window.localStorage) window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
};

const safeDelete = async (key: string) => {
  try {
    if ((SecureStore as any).deleteItemAsync) return await (SecureStore as any).deleteItemAsync(key);
    if ((SecureStore as any).deleteValueWithKeyAsync) return await (SecureStore as any).deleteValueWithKeyAsync(key);
  } catch {
    // fall through to localStorage
  }

  try {
    if (typeof window !== 'undefined' && window.localStorage) window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
};

const setAuth: AuthState['setAuth'] = async (accessToken, refreshToken, user) => {
  await safeSet('accessToken', accessToken);
  if (refreshToken) {
    await safeSet('refreshToken', refreshToken);
  }
  const nextUser = user || buildUserFromToken(accessToken);
  await safeSet('user', JSON.stringify(nextUser));
  updateSnapshot({ accessToken, refreshToken: refreshToken || null, user: nextUser, isAuthenticated: true });
};

const logout: AuthState['logout'] = async () => {
  await safeDelete('accessToken');
  await safeDelete('refreshToken');
  await safeDelete('user');
  updateSnapshot({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
};

const loadFromStorage: AuthState['loadFromStorage'] = async () => {
  const token = await safeGet('accessToken');
  const refreshToken = await safeGet('refreshToken');
  const userStr = await safeGet('user');
  if (token) {
    const user = userStr ? JSON.parse(userStr) : buildUserFromToken(token);
    updateSnapshot({ accessToken: token, refreshToken: refreshToken || null, user, isAuthenticated: true });
  }
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => snapshot;

export const useAuthStore = () => {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    ...state,
    setAuth,
    logout,
    loadFromStorage,
  };
};