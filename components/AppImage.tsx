import React from 'react';
import {
  Image,
  type ImageProps,
  type ImageSourcePropType,
  type StyleProp,
  type ImageStyle,
} from 'react-native';

type AppImageProps = Omit<ImageProps, 'source' | 'style'> & {
  source: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
};

/** RN Image wrapper — avoids expo-image native module issues in Expo Go. */
export function AppImage({ source, style, resizeMode = 'cover', ...rest }: AppImageProps) {
  return (
    <Image
      source={source}
      style={style}
      resizeMode={resizeMode}
      fadeDuration={0}
      {...rest}
    />
  );
}
