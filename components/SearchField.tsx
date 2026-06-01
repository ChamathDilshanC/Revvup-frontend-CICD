import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { GlassSurface } from './GlassSurface';
import { useTheme } from '../context/ThemeContext';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchField({
  value,
  onChangeText,
  placeholder = 'Search showrooms…',
}: Props) {
  const { colors } = useTheme();

  return (
    <GlassSurface borderRadius={20} style={{ marginBottom: 12, minHeight: 52 }}>
      <View className="flex-row items-center px-3 py-1">
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          style={{
            flex: 1,
            marginLeft: 8,
            paddingVertical: 10,
            fontSize: 16,
            color: colors.text,
          }}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {value.length > 0 ? (
          <Pressable
            onPress={() => onChangeText('')}
            hitSlop={8}
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </Pressable>
        ) : null}
      </View>
    </GlassSurface>
  );
}
