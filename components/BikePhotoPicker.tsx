import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import type { BikeImageUpload } from '../services/bikes';
import { AppImage } from './AppImage';

export type PickedBikeImage = BikeImageUpload;

type Props = {
  previewUri: string | null;
  showRemove?: boolean;
  onImageChange: (image: PickedBikeImage | null) => void;
};

export function BikePhotoPicker({ previewUri, showRemove, onImageChange }: Props) {
  const { classes, colors } = useTheme();

  async function ensureLibraryPermission(): Promise<boolean> {
    const current = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (current.granted) return true;
    const requested = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (requested.granted) return true;
    Alert.alert(
      'Photos access needed',
      'Allow photo access in Settings to choose a bike image from your gallery.',
    );
    return false;
  }

  async function ensureCameraPermission(): Promise<boolean> {
    const current = await ImagePicker.getCameraPermissionsAsync();
    if (current.granted) return true;
    const requested = await ImagePicker.requestCameraPermissionsAsync();
    if (requested.granted) return true;
    Alert.alert(
      'Camera access needed',
      'Allow camera access in Settings to take a photo of your bike.',
    );
    return false;
  }

  function applyAsset(asset: ImagePicker.ImagePickerAsset) {
    onImageChange({
      uri: asset.uri,
      mimeType: asset.mimeType ?? 'image/jpeg',
      fileName: asset.fileName ?? undefined,
    });
  }

  async function pickFromGallery() {
    if (!(await ensureLibraryPermission())) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });
    if (result.canceled || !result.assets?.[0]) return;
    applyAsset(result.assets[0]);
  }

  async function takePhoto() {
    if (!(await ensureCameraPermission())) return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });
    if (result.canceled || !result.assets?.[0]) return;
    applyAsset(result.assets[0]);
  }

  return (
    <View className="mb-4">
      <Text className={classes.inputLabel}>Bike photo</Text>

      <Pressable onPress={pickFromGallery} className={classes.photoPicker}>
        {previewUri ? (
          <View>
            <AppImage source={{ uri: previewUri }} style={{ width: '100%', height: 200 }} />
            <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-center gap-2 bg-black/50 py-2">
              <Ionicons name="images-outline" size={18} color="#F5F5F7" />
              <Text className="text-sm font-medium text-white">Tap to change photo</Text>
            </View>
          </View>
        ) : (
          <View className="items-center justify-center px-6 py-10">
            <View className={`${classes.photoPickerInner} mb-3`}>
              <Ionicons name="camera-outline" size={28} color={colors.textSecondary} />
            </View>
            <Text className={classes.textBold}>Add a photo</Text>
            <Text className={`${classes.bodySm} mt-1 text-center`}>Gallery or camera — no URL needed</Text>
          </View>
        )}
      </Pressable>

      <View className="mt-3 flex-row gap-2">
        <ActionChip
          classes={classes}
          colors={colors}
          icon="images-outline"
          label="Gallery"
          onPress={pickFromGallery}
        />
        <ActionChip
          classes={classes}
          colors={colors}
          icon="camera-outline"
          label="Camera"
          onPress={takePhoto}
        />
        {showRemove ? (
          <ActionChip
            classes={classes}
            colors={colors}
            icon="close-outline"
            label="Clear"
            onPress={() => onImageChange(null)}
            destructive
          />
        ) : null}
      </View>
    </View>
  );
}

function ActionChip({
  icon,
  label,
  onPress,
  destructive,
  classes,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  destructive?: boolean;
  classes: { photoChip: string; photoChipText: string };
  colors: { textSecondary: string };
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`${classes.photoChip} ${destructive ? 'border-red-300 bg-red-50 dark:border-red-900/50 dark:bg-red-950/30' : ''}`}
    >
      <Ionicons
        name={icon}
        size={18}
        color={destructive ? '#EF4444' : colors.textSecondary}
      />
      <Text
        className={`${classes.photoChipText} ${destructive ? 'text-red-600 dark:text-red-300' : ''}`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
