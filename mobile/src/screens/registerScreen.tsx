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

const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().regex(/^(0)(3[2-9]|5[6-9]|7[0|6-9]|8[0-9]|9[0-9])[0-9]{7}$/, 'Số điện thoại không hợp lệ'),
  password: z.string()
    .min(8, 'Mật khẩu ít nhất 8 ký tự')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 'Phải có chữ hoa, số và ký tự đặc biệt'),
  confirmPassword: z.string(),
  agreedToTerms: z.boolean(),
  referralCode: z.string().optional(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showReferral, setShowReferral] = useState(false);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreedToTerms: false,
      referralCode: '',
    },
  });

  const onSubmit = async (data: FormData) => {

  console.log('========== SUBMIT START ==========');

  console.log('FORM DATA:', data);

  console.log('agreedToTerms:', agreedToTerms);

  if (!agreedToTerms) {

    console.log('User chưa đồng ý điều khoản');

    Toast.show({
      type: 'error',
      text1: 'Lỗi',
      text2: 'Vui lòng đồng ý điều khoản sử dụng'
    });

    return;
  }

  setLoading(true);

  try {

    const payload = {
      email: data.email,
      phone: data.phone,
      password: data.password,
      confirmPassword: data.confirmPassword,
      agreedToTerms,
      referralCode: data.referralCode || undefined,
    };

    console.log('REQUEST PAYLOAD:', payload);

    console.log('CALLING API REGISTER...');

    const res = await authService.register(payload);

      console.log('========== API SUCCESS ==========');
      console.log('FULL RESPONSE:', res);

      Toast.show({
        type: 'success',
        text1: 'Đã gửi OTP',
        text2: res.message || `Kiểm tra email ${res.maskedIdentifier}`,
      });

      router.push({
        pathname: '/otp',
        params: {
          identifier: data.email,
          masked: res.maskedIdentifier,
        },
      });

  } catch (err: any) {

    console.log('========== API ERROR ==========');

    console.log('FULL ERROR:', err);

    console.log('ERROR MESSAGE:', err?.message);

    console.log('ERROR RESPONSE:', err?.response);

    console.log('ERROR DATA:', err?.response?.data);

    console.log('ERROR STATUS:', err?.response?.status);

    console.log('ERROR REQUEST:', err?.request);

    const msg =
      err?.response?.data?.message ||
      err?.message ||
      'Đăng ký thất bại';

    Toast.show({
      type: 'error',
      text1: 'Lỗi',
      text2: msg,
    });

  } finally {

    console.log('========== FINALLY ==========');

    setLoading(false);
  }
};
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerEmoji}>🍽️</Text>
            <Text style={styles.headerTitle}>Tạo tài khoản</Text>
            <Text style={styles.headerSubtitle}>Đặt hàng nhanh chóng, giao tận nơi</Text>
          </View>
        </LinearGradient>

        {/* Form */}
        <View style={styles.form}>

          <Controller control={control} name="email"
            render={({ field: { onChange, value } }) => (
              <Input label="Email *" placeholder="example@gmail.com"
                keyboardType="email-address" autoCapitalize="none"
                leftIcon="mail-outline" value={value}
                onChangeText={onChange} error={errors.email?.message} />
            )} />

          <Controller control={control} name="phone"
            render={({ field: { onChange, value } }) => (
              <Input label="Số điện thoại" placeholder="0912345678"
                keyboardType="phone-pad" leftIcon="call-outline"
                value={value} onChangeText={onChange} error={errors.phone?.message} />
            )} />

          <Controller control={control} name="password"
            render={({ field: { onChange, value } }) => (
              <Input label="Mật khẩu *" placeholder="Ít nhất 8 ký tự"
                isPassword leftIcon="lock-closed-outline"
                value={value} onChangeText={onChange} error={errors.password?.message} />
            )} />

          <Controller control={control} name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <Input label="Xác nhận mật khẩu *" placeholder="Nhập lại mật khẩu"
                isPassword leftIcon="lock-closed-outline"
                value={value} onChangeText={onChange} error={errors.confirmPassword?.message} />
            )} />

          {/* Referral toggle */}
          <TouchableOpacity style={styles.referralToggle} onPress={() => setShowReferral(!showReferral)}>
            <Ionicons name={showReferral ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.primary} />
            <Text style={styles.referralToggleText}>Có mã giới thiệu?</Text>
          </TouchableOpacity>

          {showReferral && (
            <Controller control={control} name="referralCode"
              render={({ field: { onChange, value } }) => (
                <Input placeholder="Nhập mã giới thiệu" leftIcon="gift-outline"
                  autoCapitalize="characters" value={value} onChangeText={onChange} />
              )} />
          )}

          {/* Terms checkbox */}
          <TouchableOpacity
            style={styles.termsRow}
            onPress={() => {
              const next = !agreedToTerms;
              setAgreedToTerms(next);
              // keep the form value in sync so validation and submitted payload match
              setValue('agreedToTerms', next, { shouldValidate: true, shouldDirty: true });
            }}
          >
            <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
              {agreedToTerms && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
            <Text style={styles.termsText}>
              Tôi đồng ý với{' '}
              <Text style={styles.termsLink}>Điều khoản dịch vụ</Text>
              {' '}và{' '}
              <Text style={styles.termsLink}>Chính sách bảo mật</Text>
            </Text>
          </TouchableOpacity>

          <Button
            title="Đăng ký"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.submitBtn}
          />

          {/* Login link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text style={styles.loginLink}>Đăng nhập</Text>
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
  header: { paddingTop: 60, paddingBottom: 40, paddingHorizontal: 24 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerContent: { alignItems: 'center', marginTop: 8 },
  headerEmoji: { fontSize: 48, marginBottom: 12 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 6 },
  headerSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.85)' },
  form: {
    backgroundColor: Colors.background, borderTopLeftRadius: 28,
    borderTopRightRadius: 28, marginTop: -20, padding: 28, paddingTop: 32,
  },
  referralToggle: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 6 },
  referralToggleText: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 24, gap: 12 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2,
    borderColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginTop: 1,
  },
  checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  termsText: { flex: 1, fontSize: 13, color: Colors.textLight, lineHeight: 20 },
  termsLink: { color: Colors.primary, fontWeight: '600' },
  submitBtn: { marginBottom: 24 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', paddingBottom: 40 },
  loginText: { fontSize: 14, color: Colors.textLight },
  loginLink: { fontSize: 14, fontWeight: '700', color: Colors.primary },
});