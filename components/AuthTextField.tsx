import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

type AuthTextFieldProps = TextInputProps & {
  label: string;
};

export const AuthTextField = forwardRef<TextInput, AuthTextFieldProps>(function AuthTextField(
  { label, style, editable = true, secureTextEntry, ...props },
  ref,
) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPasswordField = secureTextEntry === true;
  const { colors, isDark } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrap: { marginBottom: 14 },
        label: {
          color: colors.textSecondary,
          fontSize: 13,
          marginBottom: 6,
          fontWeight: '500',
        },
        inputRow: {
          position: 'relative',
          justifyContent: 'center',
        },
        input: {
          backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.92)',
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 14,
          color: isDark ? colors.text : '#111827',
          fontSize: 16,
        },
        inputWithToggle: { paddingRight: 48 },
        inputDisabled: { opacity: 0.55 },
        toggle: {
          position: 'absolute',
          right: 14,
          height: '100%',
          justifyContent: 'center',
          paddingHorizontal: 4,
        },
      }),
    [colors, isDark],
  );

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          ref={ref}
          placeholderTextColor={colors.placeholder}
          style={[
            styles.input,
            isPasswordField && styles.inputWithToggle,
            !editable && styles.inputDisabled,
            style,
          ]}
          editable={editable}
          secureTextEntry={isPasswordField ? !passwordVisible : secureTextEntry}
          {...props}
        />
        {isPasswordField ? (
          <Pressable
            style={styles.toggle}
            onPress={() => setPasswordVisible((v) => !v)}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}
          >
            <Ionicons
              name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={colors.textSecondary}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
});
