import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type Props = {
  onPress: () => void;
};

export function ScreenBackButton({ onPress }: Props) {
  const { colors, classes } = useTheme();
  return (
    <Pressable onPress={onPress} hitSlop={12} className="flex-row items-center gap-1">
      <Ionicons name="chevron-back" size={24} color={colors.text} />
      <Text className={classes.back}>Back</Text>
    </Pressable>
  );
}
