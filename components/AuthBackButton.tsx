import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

type AuthBackButtonProps = {
  onPress: () => void;
  label?: string;
};

export function AuthBackButton({ onPress, label = 'Back' }: AuthBackButtonProps) {
  return (
    <Pressable onPress={onPress} style={styles.btn} hitSlop={12}>
      <Ionicons name="chevron-back" size={22} color="#F5F5F7" />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 8,
    gap: 2,
  },
  label: {
    color: '#F5F5F7',
    fontSize: 16,
    fontWeight: '500',
  },
});
