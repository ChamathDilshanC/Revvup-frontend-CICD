import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { hasMapCoordinates } from '../constants/map';
import type { ProfileStackParamList } from '../navigation/ProfileStack';

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList, 'ProfileHome'>>();
  const { profile, isOwner, signOut } = useAuth();
  const { classes, colors, isDark } = useTheme();

  async function handleSignOut() {
    Alert.alert('Sign out', 'Leave RevvUp on this device?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  }

  const roleLabel =
    profile?.role === 'showroom_owner'
      ? 'Showroom owner'
      : profile?.role === 'admin'
        ? 'Admin'
        : 'Client';

  return (
    <SafeAreaView className={classes.screen}>
      <View className="flex-1 px-4 pt-4">
        <Text className={classes.title}>Profile</Text>
        <Text className={classes.subtitle}>Your RevvUp account</Text>

        <View className={`${classes.cardPadded} mt-8`}>
          <Row classes={classes} label="Name" value={profile?.full_name ?? '—'} />
          <Row classes={classes} label="Email" value={profile?.email ?? '—'} />
          <Row classes={classes} label="Role" value={roleLabel} />
          {isOwner && profile?.showroom_name ? (
            <Row classes={classes} label="Showroom" value={profile.showroom_name} />
          ) : null}
          {isOwner && profile?.showroom_address ? (
            <Row classes={classes} label="Address" value={profile.showroom_address} />
          ) : null}
          {isOwner && profile?.phone ? <Row classes={classes} label="Phone" value={profile.phone} /> : null}
        </View>

        <Pressable
          onPress={() => navigation.navigate('Settings')}
          className={`${classes.card} mt-6 flex-row items-center px-5 py-4 active:opacity-90`}
        >
          <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-[#1E1E22]">
            <Ionicons name={isDark ? 'moon-outline' : 'sunny-outline'} size={22} color={colors.primary} />
          </View>
          <View className="flex-1">
            <Text className={classes.textBold}>App settings</Text>
            <Text className={`${classes.bodySm} mt-0.5`}>Dark mode & light mode</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>

        {isOwner ? (
          <>
            <View className="mt-6">
              <PrimaryButton
                label="Showroom settings & map"
                onPress={() => navigation.navigate('ShowroomSettings')}
              />
            </View>
            <Text className={`${classes.bodySm} mt-4`}>
              Set your map pin so clients can find your showroom. Use My bikes to manage listings.
            </Text>
            {hasMapCoordinates(profile?.latitude, profile?.longitude) ? (
              <Text className={classes.bodyXsMuted}>Location saved on map</Text>
            ) : (
              <Text className="mt-2 text-xs text-amber-600 dark:text-amber-500/90">Map location not set yet</Text>
            )}
          </>
        ) : (
          <Text className={`${classes.bodySm} mt-6`}>
            Browse every showroom and full bike specs from the Explore tab.
          </Text>
        )}

        <View className="mt-10">
          <PrimaryButton label="Sign out" onPress={handleSignOut} variant="outline" />
        </View>
      </View>
    </SafeAreaView>
  );
}

function Row({
  label,
  value,
  classes,
}: {
  label: string;
  value: string;
  classes: { row: string; rowLabel: string; rowValue: string };
}) {
  return (
    <View className={classes.row}>
      <Text className={classes.rowLabel}>{label}</Text>
      <Text className={classes.rowValue}>{value}</Text>
    </View>
  );
}
