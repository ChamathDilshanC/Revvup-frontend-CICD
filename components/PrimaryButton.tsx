import React from 'react';
import { Pressable, Text, ActivityIndicator } from 'react-native';

interface PrimaryButtonProps {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
}

export function PrimaryButton({
  label,
  onPress,
  loading,
  disabled = false,
  variant = 'primary',
}: PrimaryButtonProps) {
  const isOutline = variant === 'outline';
  const isDisabled = loading || disabled;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`rounded-xl px-6 py-4 ${isOutline ? 'border border-[#E63946] bg-transparent' : 'bg-[#E63946]'}`}
      style={isDisabled ? { opacity: 0.45 } : undefined}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? '#E63946' : '#fff'} />
      ) : (
        <Text className={`text-center text-base font-semibold ${isOutline ? 'text-[#E63946]' : 'text-white'}`}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
