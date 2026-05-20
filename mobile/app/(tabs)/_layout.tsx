import React from 'react';
import * as Router from 'expo-router';
const Tabs: any = (Router as any).Tabs;
import { Colors } from '@/constants/colors';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          height: 72,
          paddingTop: 8,
          paddingBottom: 10,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          borderTopWidth: 0,
          backgroundColor: Colors.white,
          position: 'absolute',
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 20,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarItemStyle: {
          paddingTop: 2,
          paddingBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ focused }: { focused: boolean }) => <TabBarIcon icon="home-outline" label="Trang chủ" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Đơn hàng',
          tabBarIcon: ({ focused }: { focused: boolean }) => <TabBarIcon icon="receipt-outline" label="Đơn hàng" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="vouchers"
        options={{
          title: 'Ưu đãi',
          tabBarIcon: ({ focused }: { focused: boolean }) => <TabBarIcon icon="ticket-outline" label="Ưu đãi" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Thông báo',
          tabBarIcon: ({ focused }: { focused: boolean }) => <TabBarIcon icon="notifications-outline" label="Thông báo" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Tài khoản',
          tabBarIcon: ({ focused }: { focused: boolean }) => <TabBarIcon icon="person-outline"  label="Tài khoản"focused={focused} />,
        }}
      />
    </Tabs>
  );
}
