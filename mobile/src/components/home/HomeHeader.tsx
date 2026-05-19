import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

interface HomeHeaderProps {
  userName: string;
  isAuthenticated: boolean;
  onProfilePress: () => void;
  onLoginPress: () => void;
  onLogoutPress: () => void;
}

export function HomeHeader({
  userName,
  isAuthenticated,
  onProfilePress,
  onLoginPress,
  onLogoutPress,
}: HomeHeaderProps) {
  return (
    <LinearGradient colors={[Colors.primaryDark, Colors.primary]} style={styles.header}>
      <View style={styles.topRow}>
        <TouchableOpacity onPress={onProfilePress} activeOpacity={0.8} style={styles.profileButton}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person-outline" size={20} color={Colors.primaryDark} />
          </View>
          <View>
            <Text style={styles.eyebrow}>Tài khoản</Text>
            <Text style={styles.userName} numberOfLines={1}>
              {userName}
            </Text>
          </View>
        </TouchableOpacity>

        {isAuthenticated ? (
          <TouchableOpacity onPress={onLogoutPress} activeOpacity={0.8} style={styles.actionButton}>
            <Ionicons name="log-out-outline" size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onLoginPress} activeOpacity={0.8} style={styles.loginButton}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.heroBlock}>
        <Text style={styles.heroTitle}>Món ngon theo đúng nhịp của bạn</Text>
        <Text style={styles.heroSubtitle}>
          Tìm nhanh món ăn, lọc theo nhu cầu và mở rộng thành các khu vực riêng khi cần.
        </Text>
      </View>

      <TouchableOpacity activeOpacity={0.9} style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color={Colors.gray} />
        <Text style={styles.searchPlaceholder}>Tìm kiếm món ăn...</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 58,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  profileButton: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  eyebrow: { fontSize: 11, color: 'rgba(255,255,255,0.72)', marginBottom: 1, textTransform: 'uppercase' },
  userName: { fontSize: 18, fontWeight: '800', color: '#fff', maxWidth: 220 },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  loginText: { color: '#fff', fontWeight: '700' },
  heroBlock: { marginBottom: 16 },
  heroTitle: { fontSize: 24, lineHeight: 30, fontWeight: '900', color: '#fff', marginBottom: 8 },
  heroSubtitle: { fontSize: 13, lineHeight: 19, color: 'rgba(255,255,255,0.82)' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  searchPlaceholder: { color: Colors.gray, fontSize: 15 },
});
