import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/PrimaryButton';
import { ShowroomMap } from '../components/ShowroomMap';
import { hasMapCoordinates } from '../constants/map';
import { openInMaps } from '../lib/openMaps';
import { ScreenBackButton } from '../components/ScreenBackButton';
import { useTheme } from '../context/ThemeContext';
import type { ExploreStackParamList } from '../navigation/ExploreStack';

type Props = NativeStackScreenProps<ExploreStackParamList, 'ShowroomMap'>;

export function ShowroomMapScreen({ navigation, route }: Props) {
  const { showroomName, showroomAddress, latitude, longitude } = route.params;
  const { classes } = useTheme();
  const hasPin = hasMapCoordinates(latitude, longitude);

  return (
    <SafeAreaView className={classes.screen}>
      <View className="px-4 py-2">
        <ScreenBackButton onPress={() => navigation.goBack()} />
      </View>

      <ScrollView className="flex-1 px-4">
        <Text className={classes.titleLg}>{showroomName}</Text>
        {showroomAddress ? <Text className={classes.subtitleMt2}>{showroomAddress}</Text> : null}

        {hasPin ? (
          <>
            <View className="mt-5">
              <ShowroomMap latitude={latitude} longitude={longitude} title={showroomName} height={280} />
            </View>
            <View className="mt-6 pb-8">
              <PrimaryButton
                label="Open in Maps"
                onPress={() => openInMaps(latitude!, longitude!, showroomName)}
              />
            </View>
          </>
        ) : (
          <Text className={`${classes.empty} mt-0`}>
            This showroom has not set a map location yet.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
