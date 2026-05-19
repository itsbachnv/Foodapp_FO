import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function Page() {
  const { isAuthenticated, isHydrated } = useAuthStore();

  if (!isHydrated) {
    return null;
  }

  return <Redirect href={isAuthenticated ? '/(tabs)/home' : '/login'} />;
}
