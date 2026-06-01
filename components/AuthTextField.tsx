import { Ionicons } from '@expo/vector-icons';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';

/** Glass inputs for Login/Register — always translucent on the dark hero background. */
const AUTH = {
  label: 'rgba(255,255,255,0.75)',
  text: '#F5F5F7',
  placeholder: 'rgba(255,255,255,0.42)',
  fieldBg: 'rgba(255,255,255,0.1)',
  fieldBorder: 'rgba(255,255,255,0.2)',
  icon: 'rgba(255,255,255,0.65)',
} as const;

type AuthTextFieldProps = TextInputProps & {
  label: string;
};

export const AuthTextField = forwardRef<TextInput, AuthTextFieldProps>(function AuthTextField(
  { label, style, editable = true, secureTextEntry, ...props },
  ref,
) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const isPasswordField = secureTextEntry === true;

  useImperativeHandle(ref, () => inputRef.current as TextInput);

  const focusInput = () => {
    if (editable) inputRef.current?.focus();
  };

  return (
    <View style={styles.wrap}>
      <Pressable onPress={focusInput} hitSlop={6}>
        <Text style={styles.label}>{label}</Text>
      </Pressable>
      <View style={styles.inputRow}>
        <TextInput
          ref={inputRef}
          placeholderTextColor={AUTH.placeholder}
          showSoftInputOnFocus
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
              color={AUTH.icon}
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
    color: AUTH.label,
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '500',
  },
  inputRow: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: AUTH.fieldBg,
    borderWidth: 1,
    borderColor: AUTH.fieldBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: AUTH.text,
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
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 4,
    zIndex: 1,
  },
});
