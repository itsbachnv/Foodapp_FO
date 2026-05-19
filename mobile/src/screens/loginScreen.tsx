import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView,
  Platform, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Colors } from '@/constants/colors';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';

const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});
type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await authService.login(data.email, data.password);
      await setAuth(res.token);
      router.replace('/home');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Đăng nhập thất bại';
      Toast.show({ type: 'error', text1: 'Lỗi', text2: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerEmoji}>👋</Text>
            <Text style={styles.headerTitle}>Chào mừng trở lại!</Text>
            <Text style={styles.headerSubtitle}>Đăng nhập để tiếp tục đặt hàng</Text>
          </View>
        </LinearGradient>

        {/* Form */}
        <View style={styles.form}>
          <Controller
            control={control} name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Email"
                placeholder="example@gmail.com"
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon="mail-outline"
                value={value}
                onChangeText={onChange}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control} name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Mật khẩu"
                placeholder="Nhập mật khẩu"
                isPassword
                leftIcon="lock-closed-outline"
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
              />
            )}
          />

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <Button title="Đăng nhập" onPress={handleSubmit(onSubmit)} loading={loading} style={styles.submitBtn} />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>hoặc</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social login placeholder */}
          <TouchableOpacity style={styles.socialBtn}>
            <Text style={styles.socialIcon}>🇬</Text>
            <Text style={styles.socialText}>Tiếp tục với Google</Text>
          </TouchableOpacity>

          {/* Register link */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.registerLink}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Toast />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1 },
  header: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 24 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerContent: { alignItems: 'center', marginTop: 8 },
  headerEmoji: { fontSize: 48, marginBottom: 12 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 6 },
  headerSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.85)' },
  form: {
    flex: 1, backgroundColor: Colors.background,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    marginTop: -20, padding: 28, paddingTop: 32,
  },
  forgotBtn: { alignSelf: 'flex-end', marginTop: -8, marginBottom: 24 },
  forgotText: { color: Colors.primary, fontSize: 14, fontWeight: '600' },
  submitBtn: { marginBottom: 24 },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.grayBorder },
  dividerText: { paddingHorizontal: 16, color: Colors.gray, fontSize: 14 },
  socialBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.grayBorder, borderRadius: 14,
    height: 54, marginBottom: 32, backgroundColor: Colors.white,
  },
  socialIcon: { fontSize: 20, marginRight: 10 },
  socialText: { fontSize: 15, fontWeight: '600', color: Colors.text },
  registerRow: { flexDirection: 'row', justifyContent: 'center' },
  registerText: { fontSize: 14, color: Colors.textLight },
  registerLink: { fontSize: 14, fontWeight: '700', color: Colors.primary },
});