import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

type AuthTextFieldProps = TextInputProps & {
  label: string;
};

export const AuthTextField = forwardRef<TextInput, AuthTextFieldProps>(function AuthTextField(
  { label, style, editable = true, secureTextEntry, ...props },
  ref,
) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isPasswordField = secureTextEntry === true;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          ref={ref}
          placeholderTextColor="#6B7280"
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
              color="#9CA3AF"
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
  },
  label: {
    color: '#9CA3AF',
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '500',
  },
  inputRow: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#F5F5F7',
    fontSize: 16,
  },
  inputWithToggle: {
    paddingRight: 48,
  },
  inputDisabled: {
    opacity: 0.55,
  },
  toggle: {
    position: 'absolute',
    right: 14,
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
});
