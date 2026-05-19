declare module 'expo-linear-gradient' {
  import * as React from 'react';
  import { ViewProps } from 'react-native';

  export type LinearGradientPoint = { x: number; y: number };
  export interface LinearGradientProps extends ViewProps {
    colors: string[];
    start?: LinearGradientPoint;
    end?: LinearGradientPoint;
    locations?: number[];
  }

  export const LinearGradient: React.ComponentType<LinearGradientProps>;
}

declare module 'expo-secure-store' {
  export type SecureStoreOptions = {
    keychainService?: string;
    requireAuthentication?: boolean;
    authenticationPrompt?: string;
    keychainAccessible?: number;
  };

  export function isAvailableAsync(): Promise<boolean>;
  export function deleteItemAsync(key: string, options?: SecureStoreOptions): Promise<void>;
  export function getItemAsync(key: string, options?: SecureStoreOptions): Promise<string | null>;
  export function setItemAsync(key: string, value: string, options?: SecureStoreOptions): Promise<void>;
  export function setItem(key: string, value: string, options?: SecureStoreOptions): void;
  export function getItem(key: string, options?: SecureStoreOptions): string | null;
}

declare module 'expo-router' {
  export type Router = {
    back: () => void;
    replace: (href: string | { pathname: string; params?: Record<string, string> }) => void;
    push: (href: string | { pathname: string; params?: Record<string, string> }) => void;
  };

  export function useRouter(): Router;
  export function useLocalSearchParams<T extends Record<string, string | string[] | undefined> = Record<string, string | string[] | undefined>>(): T;
}