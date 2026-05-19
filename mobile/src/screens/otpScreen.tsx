import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { OtpInput } from 'react-native-otp-entry';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/button';
import { Colors } from '@/constants/colors';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';

export default function OtpScreen() {
  const router = useRouter();
  const { identifier, masked } = useLocalSearchParams<{ identifier: string; masked: string }>();
  const { setAuth } = useAuthStore();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Đếm ngược resend
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length < 6) {
      Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Vui lòng nhập đủ 6 số OTP' });
      return;
    }
    setLoading(true);
    try {
      const res = await authService.verifyOtp({ identifier, otp });
      await setAuth(res.accessToken, res.refreshToken, res.user);
      Toast.show({ type: 'success', text1: '🎉 Thành công!', text2: 'Chào mừng bạn đến với FoodApp' });
      setTimeout(() => router.replace('/(tabs)/home'), 1000);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'OTP không đúng';
      Toast.show({ type: 'error', text1: 'Lỗi', text2: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await authService.resendOtp({ identifier });
      setCountdown(60);
      setCanResend(false);
      Toast.show({ type: 'success', text1: 'Đã gửi lại OTP', text2: `Kiểm tra email ${masked}` });
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Không thể gửi lại OTP';
      Toast.show({ type: 'error', text1: 'Lỗi', text2: msg });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>

        {/* Header */}
        <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerEmoji}>📩</Text>
            <Text style={styles.headerTitle}>Xác thực OTP</Text>
            <Text style={styles.headerSubtitle}>
              Nhập mã 6 số đã gửi đến{'\n'}
              <Text style={styles.maskedText}>{masked}</Text>
            </Text>
          </View>
        </LinearGradient>

        {/* OTP form */}
        <View style={styles.form}>
          <Text style={styles.otpLabel}>Nhập mã OTP</Text>

          <OtpInput
            numberOfDigits={6}
            onTextChange={setOtp}
            focusColor={Colors.primary}
            theme={{
              containerStyle: styles.otpContainer,
              pinCodeContainerStyle: styles.otpBox,
              pinCodeTextStyle: styles.otpText,
              focusedPinCodeContainerStyle: styles.otpBoxFocused,
            }}
          />

          <Text style={styles.expireText}>
            Mã OTP có hiệu lực trong <Text style={styles.expireHighlight}>2 phút</Text>
          </Text>

          <Button
            title="Xác nhận"
            onPress={handleVerify}
            loading={loading}
            disabled={otp.length < 6}
            style={styles.verifyBtn}
          />

          {/* Resend */}
          <View style={styles.resendRow}>
            <Text style={styles.resendText}>Không nhận được mã? </Text>
            {canResend ? (
              <TouchableOpacity onPress={handleResend} disabled={resendLoading}>
                <Text style={styles.resendLink}>
                  {resendLoading ? 'Đang gửi...' : 'Gửi lại'}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.countdownText}>Gửi lại sau {countdown}s</Text>
            )}
          </View>

          {/* Wrong number */}
          <TouchableOpacity style={styles.wrongRow} onPress={() => router.back()}>
            <Ionicons name="create-outline" size={16} color={Colors.gray} />
            <Text style={styles.wrongText}>Sai email? Đổi lại</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingTop: 60, paddingBottom: 44, paddingHorizontal: 24 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerContent: { alignItems: 'center', marginTop: 8 },
  headerEmoji: { fontSize: 48, marginBottom: 12 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 8 },
  headerSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 22 },
  maskedText: { fontWeight: '700', color: '#fff' },
  form: {
    flex: 1, backgroundColor: Colors.background,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    marginTop: -20, padding: 28, paddingTop: 36,
  },
  otpLabel: { fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: 20, textAlign: 'center' },
  otpContainer: { marginBottom: 16 },
  otpBox: {
    width: 48, height: 56, borderRadius: 12,
    borderWidth: 1.5, borderColor: Colors.grayBorder,
    backgroundColor: Colors.white,
  },
  otpBoxFocused: { borderColor: Colors.primary, borderWidth: 2 },
  otpText: { fontSize: 22, fontWeight: '700', color: Colors.text },
  expireText: { textAlign: 'center', fontSize: 13, color: Colors.textLight, marginBottom: 32 },
  expireHighlight: { color: Colors.primary, fontWeight: '600' },
  verifyBtn: { marginBottom: 24 },
  resendRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16 },
  resendText: { fontSize: 14, color: Colors.textLight },
  resendLink: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  countdownText: { fontSize: 14, color: Colors.gray },
  wrongRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  wrongText: { fontSize: 13, color: Colors.gray },
});