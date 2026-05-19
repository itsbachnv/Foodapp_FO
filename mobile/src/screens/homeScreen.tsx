import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { HomeHeader } from '@/components/home/HomeHeader';
import { QuickOptionChips, QuickOptionItem } from '@/components/home/QuickOptionChips';

const categories = [
  { icon: '🍔', name: 'Burger' },
  { icon: '🍕', name: 'Pizza' },
  { icon: '🍜', name: 'Mì' },
  { icon: '🍣', name: 'Sushi' },
  { icon: '🍗', name: 'Gà rán' },
  { icon: '🥗', name: 'Salad' },
];

const featured = [
  { emoji: '🍔', name: 'Burger Bò Phô Mai', shop: 'Burger House', price: '65.000đ', rating: '4.8', time: '25 phút' },
  { emoji: '🍕', name: 'Pizza Hải Sản', shop: 'Pizza Palace', price: '120.000đ', rating: '4.9', time: '35 phút' },
  { emoji: '🍜', name: 'Phở Bò Đặc Biệt', shop: 'Phở Hà Nội', price: '55.000đ', rating: '4.7', time: '20 phút' },
];

const quickOptions: QuickOptionItem[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'fast', label: 'Giao nhanh' },
  { id: 'promo', label: 'Khuyến mãi' },
  { id: 'healthy', label: 'Món nhẹ' },
  { id: 'favorite', label: 'Ưa thích' },
];

export default function HomeScreen() {
  const { user, logout, isAuthenticated, loadFromStorage } = useAuthStore();
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState('all');

  useEffect(() => {
    void loadFromStorage();
  }, [loadFromStorage]);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <HomeHeader
        userName={user?.firstName || user?.email?.split('@')[0] || 'Foodie'}
        isAuthenticated={isAuthenticated}
        onProfilePress={() => router.push('/(tabs)/profile')}
        onLoginPress={() => router.push('/login')}
        onLogoutPress={handleLogout}
      />

      <QuickOptionChips
        title="Tùy chọn nhanh"
        options={quickOptions}
        selectedId={selectedOption}
        onSelect={setSelectedOption}
      />

      {/* Banner */}
      <View style={styles.bannerWrap}>
        <LinearGradient
          colors={['#FFF3E8', '#FFE2C8', '#FFD2A8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          <View style={styles.bannerTextCol}>
            <Text style={styles.bannerTag}>Hôm nay ăn gì?</Text>
            <Text style={styles.bannerTitle}>Món ngon nóng hổi, giao nhanh tận cửa</Text>
            <Text style={styles.bannerSub}>
              {selectedOption === 'fast'
                ? 'Ưu tiên các món giao nhanh, phù hợp khi bạn đang cần đặt gấp.'
                : selectedOption === 'promo'
                  ? 'Xem các món đang có ưu đãi để tối ưu chi phí đặt hàng.'
                  : selectedOption === 'healthy'
                    ? 'Gợi ý các món nhẹ nhàng hơn cho bữa ăn cân bằng.'
                    : selectedOption === 'favorite'
                      ? 'Truy cập nhanh các món bạn hay quay lại đặt.'
                      : 'Khám phá burger, pizza, mì và sushi đang được đặt nhiều nhất.'}
            </Text>
          </View>

          <View style={styles.bannerArt}>
            <View style={styles.bannerPlate}>
              <Text style={styles.bannerEmoji}>🍱</Text>
            </View>
            <View style={styles.bannerPillsRow}>
              <View style={styles.bannerPill}><Text style={styles.bannerPillText}>🍔 Burger</Text></View>
              <View style={styles.bannerPill}><Text style={styles.bannerPillText}>🍕 Pizza</Text></View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <View style={styles.sectionHeadingRow}>
          <Text style={styles.sectionTitle}>Danh mục</Text>
          <Text style={styles.sectionMeta}>Có thể tái sử dụng ở các screen khác</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
          {categories.map((c, i) => (
            <TouchableOpacity key={i} style={styles.categoryItem}>
              <View style={styles.categoryIcon}><Text style={styles.categoryEmoji}>{c.icon}</Text></View>
              <Text style={styles.categoryName}>{c.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured */}
      <View style={styles.section}>
        <View style={styles.sectionHeadingRow}>
          <Text style={styles.sectionTitle}>Món nổi bật 🔥</Text>
          <Text style={styles.sectionMeta}>Lọc UI bằng selectedOption sau này</Text>
        </View>
        {featured.map((item, i) => (
          <TouchableOpacity key={i} style={styles.foodCard}>
            <View style={styles.foodEmoji}><Text style={{ fontSize: 40 }}>{item.emoji}</Text></View>
            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodShop}>{item.shop}</Text>
              <View style={styles.foodMeta}>
                <Text style={styles.foodRating}>⭐ {item.rating}</Text>
                <Text style={styles.foodDot}>·</Text>
                <Text style={styles.foodTime}>🕐 {item.time}</Text>
              </View>
            </View>
            <Text style={styles.foodPrice}>{item.price}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  bannerWrap: { paddingHorizontal: 20, marginTop: -10 },
  banner: {
    borderRadius: 24,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  bannerTextCol: { flex: 1, paddingRight: 14 },
  bannerTag: { fontSize: 12, fontWeight: '800', color: Colors.primary, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  bannerTitle: { fontSize: 18, lineHeight: 24, fontWeight: '800', color: Colors.text, marginBottom: 6 },
  bannerSub: { fontSize: 13, lineHeight: 18, color: Colors.textLight },
  bannerArt: { alignItems: 'center' },
  bannerPlate: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: 'rgba(255,255,255,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  bannerEmoji: { fontSize: 40 },
  bannerPillsRow: { flexDirection: 'row', gap: 8, maxWidth: 118, flexWrap: 'wrap', justifyContent: 'center' },
  bannerPill: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 6,
  },
  bannerPillText: { fontSize: 11, fontWeight: '700', color: Colors.text },
  section: { padding: 20, paddingBottom: 0 },
  sectionHeadingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 16 },
  sectionMeta: { fontSize: 12, color: Colors.textLight },
  categoryList: { marginHorizontal: -20, paddingHorizontal: 20 },
  categoryItem: { alignItems: 'center', marginRight: 16 },
  categoryIcon: {
    width: 60, height: 60, borderRadius: 16, backgroundColor: Colors.white,
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  categoryEmoji: { fontSize: 28 },
  categoryName: { fontSize: 12, color: Colors.text, fontWeight: '500' },
  foodCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    borderRadius: 16, padding: 14, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  foodEmoji: {
    width: 64, height: 64, borderRadius: 14, backgroundColor: Colors.grayLight,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  foodInfo: { flex: 1 },
  foodName: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: 3 },
  foodShop: { fontSize: 13, color: Colors.textLight, marginBottom: 6 },
  foodMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  foodRating: { fontSize: 12, color: Colors.text },
  foodDot: { color: Colors.gray },
  foodTime: { fontSize: 12, color: Colors.textLight },
  foodPrice: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  heroCta: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroCtaText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  heroSecondaryCta: {
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  heroSecondaryCtaText: { color: Colors.primary, fontSize: 16, fontWeight: '800' },
});