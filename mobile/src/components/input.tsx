import React, { useState } from 'react';
import {
  View, TextInput, Text, StyleSheet,
  TouchableOpacity, TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  isPassword?: boolean;
}

export const Input: React.FC<Props> = ({
  label, error, leftIcon, rightIcon, onRightIconPress,
  isPassword, style, value, ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputWrapper,
        focused && styles.focused,
        error ? styles.errorBorder : null,
      ]}>
        {leftIcon && (
          <Ionicons name={leftIcon} size={20} color={focused ? Colors.primary : Colors.gray} style={styles.leftIcon} />
        )}
        <TextInput
          style={[styles.input, style]}
          value={value ?? ''}
          placeholderTextColor={Colors.gray}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.rightIcon}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.gray} />
          </TouchableOpacity>
        )}
        {rightIcon && !isPassword && (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <Ionicons name={rightIcon} size={20} color={Colors.gray} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.grayBorder,
    paddingHorizontal: 14,
    height: 54,
  },
  focused: { borderColor: Colors.primary, shadowColor: Colors.primary, shadowOpacity: 0.15, shadowRadius: 6, elevation: 2 },
  errorBorder: { borderColor: Colors.error },
  leftIcon: { marginRight: 10 },
  rightIcon: { marginLeft: 10 },
  input: { flex: 1, fontSize: 15, color: Colors.text, height: '100%' },
  error: { fontSize: 12, color: Colors.error, marginTop: 4, marginLeft: 4 },
});