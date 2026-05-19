import React from 'react';
import {
  TouchableOpacity, Text, StyleSheet,
  ActivityIndicator, ViewStyle, TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/colors';

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'ghost';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<Props> = ({
  title, onPress, loading, disabled, variant = 'primary', style, textStyle,
}) => {
  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[styles.wrapper, style]}
      >
        <LinearGradient
          colors={isDisabled ? ['#ccc', '#bbb'] : [Colors.primary, Colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={[styles.textPrimary, textStyle]}>{title}</Text>}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.7}
        style={[styles.outline, style]}
      >
        {loading
          ? <ActivityIndicator color={Colors.primary} />
          : <Text style={[styles.textOutline, textStyle]}>{title}</Text>}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} disabled={isDisabled} activeOpacity={0.6} style={style}>
      <Text style={[styles.textGhost, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: { borderRadius: 14, overflow: 'hidden' },
  gradient: { height: 54, justifyContent: 'center', alignItems: 'center' },
  textPrimary: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  outline: {
    height: 54, borderRadius: 14, borderWidth: 1.5,
    borderColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
  },
  textOutline: { color: Colors.primary, fontSize: 16, fontWeight: '600' },
  textGhost: { color: Colors.primary, fontSize: 14, fontWeight: '500' },
});