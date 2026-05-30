import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenBackButton } from '../components/ScreenBackButton';
import { useTheme } from '../context/ThemeContext';
import type { ProfileStackParamList } from '../navigation/ProfileStack';
type Props = NativeStackScreenProps<ProfileStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const { preference, setPreference, colors, classes } = useTheme();

  return (
    <SafeAreaView className={classes.screen}>
      <View className="px-4 py-2">
        <ScreenBackButton onPress={() => navigation.goBack()} />
      </View>

      <View className="flex-1 px-4 pt-2">
        <Text className={classes.title}>Settings</Text>
        <Text className={classes.subtitle}>App preferences on this device</Text>

        <View className={`${classes.cardPadded} mt-8`}>
          <Text className={classes.sectionLabel}>Appearance</Text>
          <Text className={`${classes.bodySm} mb-4`}>
            Dark mode is the default RevvUp look. Switch to light for a brighter interface.
          </Text>

          <ThemeOption
            icon="moon"
            label="Dark mode"
            description="Premium dark theme (default)"
            selected={preference === 'dark'}
            onPress={() => void setPreference('dark')}
            colors={colors}
          />
          <View className="my-3 h-px bg-gray-200 dark:bg-[#2A2A2E]" />
          <ThemeOption
            icon="sunny"
            label="Light mode"
            description="Clean light backgrounds"
            selected={preference === 'light'}
            onPress={() => void setPreference('light')}
            colors={colors}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function ThemeOption({
  icon,
  label,
  description,
  selected,
  onPress,
  colors,
}: {
  icon: 'moon' | 'sunny';
  label: string;
  description: string;
  selected: boolean;
  onPress: () => void;
  colors: { primary: string; text: string; textSecondary: string; border: string; surface: string };
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center rounded-xl border px-4 py-3.5 ${
        selected ? 'border-[#E63946] bg-[#E63946]/10' : 'border-transparent bg-transparent'
      }`}
    >
      <View
        className="mr-3 h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: selected ? 'rgba(230,57,70,0.15)' : colors.surface }}
      >
        <Ionicons
          name={icon}
          size={22}
          color={selected ? colors.primary : colors.textSecondary}
        />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900 dark:text-white">{label}</Text>
        <Text className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{description}</Text>
      </View>
      {selected ? (
        <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
      ) : (
        <View
          className="h-6 w-6 rounded-full border-2"
          style={{ borderColor: colors.border }}
        />
      )}
    </Pressable>
  );
}
