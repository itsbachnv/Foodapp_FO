import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, Dimensions,
  TouchableOpacity, StatusBar, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { loadFromStorage, isAuthenticated } = useAuthStore();

  useEffect(() => {
    (async () => {
      await loadFromStorage();
      if (isAuthenticated) router.replace('/(tabs)/home');
    })();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background gradient */}
      <LinearGradient
        colors={[Colors.primaryDark, Colors.primary, '#FF9A5C']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Decorative circles */}
      <View style={styles.circleTop} />
      <View style={styles.circleBottom} />

      {/* Logo & tagline */}
      <View style={styles.logoSection}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🍔</Text>
        </View>
        <Text style={styles.appName}>FoodApp</Text>
        <Text style={styles.tagline}>Đồ ăn ngon, giao tận nơi</Text>
      </View>

      {/* Food illustration placeholder */}
      <View style={styles.illustrationBox}>
        <Text style={styles.illustrationEmoji}>🍜 🍕 🍣 🧆</Text>
        <Text style={styles.illustrationSub}>Hơn 500+ món ăn từ các nhà hàng nổi tiếng</Text>
      </View>

      {/* CTA buttons */}
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => router.push('/register')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnPrimaryText}>Bắt đầu ngay</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnOutline}
          onPress={() => router.push('/login')}
          activeOpacity={0.85}
        >
          <Text style={styles.btnOutlineText}>Đăng nhập</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          Bằng cách tiếp tục, bạn đồng ý với{' '}
          <Text style={styles.termsLink}>Điều khoản dịch vụ</Text>
          {' '}của chúng tôi
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  circleTop: {
    position: 'absolute', top: -80, right: -80,
    width: 250, height: 250, borderRadius: 125,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  circleBottom: {
    position: 'absolute', bottom: 200, left: -100,
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  logoSection: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  logoBox: {
    width: 90, height: 90, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5,
  },
  logoEmoji: { fontSize: 48 },
  appName: { fontSize: 38, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  tagline: { fontSize: 16, color: 'rgba(255,255,255,0.85)', marginTop: 8, fontWeight: '400' },
  illustrationBox: { alignItems: 'center', paddingHorizontal: 40, marginBottom: 20 },
  illustrationEmoji: { fontSize: 42, letterSpacing: 8, marginBottom: 12 },
  illustrationSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 20 },
  buttonSection: {
    paddingHorizontal: 28, paddingBottom: 48,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 0, borderTopLeftRadius: 32, borderTopRightRadius: 32,
    paddingTop: 32,
  },
  btnPrimary: {
    backgroundColor: '#fff', borderRadius: 14, height: 54,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 3,
  },
  btnPrimaryText: { color: Colors.primary, fontSize: 16, fontWeight: '700' },
  btnOutline: {
    borderRadius: 14, height: 54, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.6)', marginBottom: 24,
  },
  btnOutlineText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  terms: { textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 18 },
  termsLink: { textDecorationLine: 'underline', fontWeight: '600' },
});