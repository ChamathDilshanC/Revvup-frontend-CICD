import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { requestLocationWithSettingsPrompt } from '../../lib/locationPermission';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ShowroomMap } from '../../components/ShowroomMap';
import { useAuth } from '../../context/AuthContext';
import { hasMapCoordinates } from '../../constants/map';
import type { ProfileStackParamList } from '../../navigation/ProfileStack';
import { ScreenBackButton } from '../../components/ScreenBackButton';
import { useTheme } from '../../context/ThemeContext';
import { updateMyProfile } from '../../services/profile';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ShowroomSettings'>;

export function ShowroomSettingsScreen({ navigation }: Props) {
  const { profile, setProfile } = useAuth();
  const { classes, colors } = useTheme();
  const [showroomName, setShowroomName] = useState(profile?.showroom_name ?? '');
  const [showroomAddress, setShowroomAddress] = useState(profile?.showroom_address ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [latitude, setLatitude] = useState<number | null>(profile?.latitude ?? null);
  const [longitude, setLongitude] = useState<number | null>(profile?.longitude ?? null);
  const [saving, setSaving] = useState(false);

  async function useCurrentLocation() {
    const granted = await requestLocationWithSettingsPrompt();
    if (!granted) {
      return;
    }
    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    setLatitude(pos.coords.latitude);
    setLongitude(pos.coords.longitude);
  }

  async function handleSave() {
    if (!showroomName.trim()) {
      Alert.alert('Showroom name required', 'Enter your showroom name.');
      return;
    }
    if (!hasMapCoordinates(latitude, longitude)) {
      Alert.alert('Map pin required', 'Tap the map or use current location to set where customers find you.');
      return;
    }

    setSaving(true);
    try {
      const updated = await updateMyProfile({
        showroom_name: showroomName.trim(),
        showroom_address: showroomAddress.trim() || undefined,
        phone: phone.trim() || undefined,
        latitude: latitude!,
        longitude: longitude!,
      });
      setProfile(updated);
      Alert.alert('Saved', 'Showroom details and map location updated.');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Save failed', e instanceof Error ? e.message : 'Try again');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0B]">
      <View className="flex-row items-center px-4 py-2">
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} className="flex-row items-center gap-1">
          <Ionicons name="chevron-back" size={24} color="#F5F5F7" />
          <Text className="text-base text-white">Back</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
          <Text className={classes.titleLg}>Showroom settings</Text>
          <Text className={classes.subtitle}>
            Set your shop details and map pin — clients see this when they select your showroom.
          </Text>

          <View className="mt-5">
            <Field classes={classes} colors={colors} label="Showroom name" value={showroomName} onChangeText={setShowroomName} />
            <Field classes={classes} colors={colors} label="Address" value={showroomAddress} onChangeText={setShowroomAddress} />
            <Field classes={classes} colors={colors} label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>

          <Text className={`${classes.sectionLabel} mt-4`}>Showroom location</Text>
          <ShowroomMap
            latitude={latitude}
            longitude={longitude}
            title={showroomName}
            height={240}
            editable
            onLocationChange={(lat, lng) => {
              setLatitude(lat);
              setLongitude(lng);
            }}
          />

          <Pressable onPress={useCurrentLocation} className="mt-3 flex-row items-center justify-center gap-2 py-2">
            <Ionicons name="locate-outline" size={20} color="#E63946" />
            <Text className="font-semibold text-[#E63946]">Use my current location</Text>
          </Pressable>

          {hasMapCoordinates(latitude, longitude) ? (
            <Text className={`${classes.bodyXs} mt-2 text-center`}>
              Pin: {latitude!.toFixed(5)}, {longitude!.toFixed(5)}
            </Text>
          ) : null}

          <View className="mt-6 pb-10">
            <PrimaryButton label="Save settings" onPress={handleSave} loading={saving} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
  classes,
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: 'default' | 'phone-pad';
  classes: { inputLabel: string; input: string };
  colors: { placeholder: string };
}) {
  return (
    <View className="mb-3">
      <Text className={classes.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor={colors.placeholder}
        className={classes.input}
        placeholder={label}
      />
    </View>
  );
}
