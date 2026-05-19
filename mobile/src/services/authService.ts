import { api } from '@/hooks/api';

export interface RegisterRequest {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreedToTerms: boolean;
  referralCode?: string;
}

export interface VerifyOtpRequest {
  identifier: string;
  otp: string;
}

export interface ResendOtpRequest {
  identifier: string;
}

export interface OtpSentResponse {
  maskedIdentifier: string;
  message: string;
  otpExpiresInSeconds: number;
  cooldownSeconds: number;
}

export interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    referralCode: string;
  };
}

export interface LoginResponse {
  token: string;
}

export const authService = {
  register: async (data: RegisterRequest): Promise<OtpSentResponse> => {
    console.log('Registering user with data:', data);
    const res = await api.post('/auth/register', data);
    console.log('Registering user with res:', res);
    return res.data;
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<RegisterResponse> => {
    const res = await api.post('/auth/register/verify', data);
    return res.data;
  },

  resendOtp: async (data: ResendOtpRequest): Promise<OtpSentResponse> => {
    const res = await api.post('/auth/register/resend-otp', data);
    return res.data;
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
};