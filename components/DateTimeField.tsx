import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { formatDobDisplay } from '../lib/sriLankaId';
import { formatDisplayDateTime } from '../lib/rentalFormat';
import { useTheme } from '../context/ThemeContext';

type Props = {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
  mode?: 'date' | 'datetime';
};

export function DateTimeField({
  label,
  value,
  onChange,
  minimumDate,
  maximumDate,
  mode = 'datetime',
}: Props) {
  const { classes, colors } = useTheme();
  const [show, setShow] = useState(false);

  const displayText =
    mode === 'date'
      ? formatDobDisplay(
          `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`,
        )
      : formatDisplayDateTime(value.toISOString());

  const trailingIcon = show
    ? 'chevron-up'
    : mode === 'date'
      ? 'calendar-outline'
      : 'time-outline';

  function togglePicker() {
    setShow((open) => !open);
  }

  function onPickerChange(event: DateTimePickerEvent, selected?: Date) {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (event.type === 'dismissed') {
      setShow(false);
      return;
    }
    if (selected) {
      onChange(selected);
    }
  }

  return (
    <View className="mb-4">
      <Text className={classes.inputLabel}>{label}</Text>
      <Pressable
        onPress={togglePicker}
        className={`${classes.inputMb} flex-row items-center justify-between py-3`}
        accessibilityRole="button"
        accessibilityState={{ expanded: show }}
        accessibilityLabel={`${label}, ${displayText}`}
      >
        <Text className={`${classes.text} flex-1 pr-3`} numberOfLines={2}>
          {displayText}
        </Text>
        <View
          className="h-9 w-9 items-center justify-center rounded-lg"
          style={{ backgroundColor: show ? 'rgba(230,57,70,0.15)' : 'transparent' }}
        >
          <Ionicons name={trailingIcon} size={22} color={show ? colors.primary : colors.textSecondary} />
        </View>
      </Pressable>
      {show ? (
        <View className="overflow-hidden rounded-xl border border-gray-200 dark:border-[#2A2A2E]">
          <DateTimePicker
            value={value}
            mode={mode}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            onChange={onPickerChange}
          />
          {Platform.OS === 'ios' ? (
            <Pressable
              onPress={() => setShow(false)}
              className="border-t border-gray-200 bg-white py-3 dark:border-[#2A2A2E] dark:bg-[#141416]"
            >
              <Text className="text-center text-base font-semibold text-[#E63946]">Done</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
