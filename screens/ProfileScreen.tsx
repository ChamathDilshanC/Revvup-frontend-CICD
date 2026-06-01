import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { hasMapCoordinates } from '../constants/map';
import type { ProfileStackParamList } from '../navigation/ProfileStack';
import type { UserRole, UserStatus } from '../types/user';

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

  const displayName = profile?.full_name?.trim() || 'RevvUp user';
  const email = profile?.email ?? '—';
  const role = profile?.role ?? 'client';
  const status = profile?.status ?? 'active';

  return (
    <SafeAreaView className={classes.screen} edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-10 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <Text className={classes.title}>Profile</Text>
        <Text className={classes.subtitle}>Your account and showroom details</Text>

        <View className={`${classes.card} mt-6 overflow-hidden`}>
          <View className="items-center px-5 pb-5 pt-6">
            <View
              className="mb-4 h-20 w-20 items-center justify-center rounded-full border-2"
              style={{ borderColor: colors.primary, backgroundColor: isDark ? '#1E1E22' : '#F3F4F6' }}
            >
              <Text className="text-2xl font-bold" style={{ color: colors.primary }}>
                {initials(profile?.full_name, email)}
              </Text>
            </View>
            <Text className={classes.textBoldLg}>{displayName}</Text>
            <Text className={`${classes.bodySm} mt-1`}>{email}</Text>
            <View className="mt-4 flex-row flex-wrap items-center justify-center gap-2">
              <RoleBadge role={role} />
              <StatusBadge status={status} />
            </View>
          </View>
        </View>

        <SectionTitle title="Account details" />
        <View className={classes.cardPadded}>
          <DetailRow
            icon="person-outline"
            label="Full name"
            value={profile?.full_name?.trim() || 'Not set'}
            colors={colors}
          />
          <DetailRow icon="mail-outline" label="Email" value={email} colors={colors} />
          <DetailRow icon="shield-checkmark-outline" label="Account type" value={roleLabel(role)} colors={colors} />
          <DetailRow
            icon="checkmark-circle-outline"
            label="Account status"
            value={statusLabel(status)}
            colors={colors}
            isLast
          />
        </View>

        {isOwner ? (
          <>
            <SectionTitle title="Showroom details" />
            <View className={classes.cardPadded}>
              <DetailRow
                icon="storefront-outline"
                label="Showroom name"
                value={profile?.showroom_name?.trim() || 'Not set'}
                colors={colors}
              />
              <DetailRow
                icon="location-outline"
                label="Address"
                value={profile?.showroom_address?.trim() || 'Not set'}
                colors={colors}
              />
              <DetailRow
                icon="call-outline"
                label="Phone"
                value={profile?.phone?.trim() || 'Not set'}
                colors={colors}
                isLast
              />
            </View>

            <SectionTitle title="Map location" />
            <View className={classes.cardPadded}>
              <View className="flex-row items-start gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: isDark ? '#1E1E22' : '#F3F4F6' }}
                >
                  <Ionicons
                    name={hasMapCoordinates(profile?.latitude, profile?.longitude) ? 'map' : 'map-outline'}
                    size={20}
                    color={
                      hasMapCoordinates(profile?.latitude, profile?.longitude) ? colors.primary : colors.textMuted
                    }
                  />
                </View>
                <View className="flex-1">
                  <Text className={classes.rowLabel}>Showroom pin</Text>
                  {hasMapCoordinates(profile?.latitude, profile?.longitude) ? (
                    <>
                      <Text className={`${classes.rowValue} mt-1`}>Location saved</Text>
                      <Text className={`${classes.bodyXsMuted} mt-1`}>
                        {formatCoord(profile?.latitude)}, {formatCoord(profile?.longitude)}
                      </Text>
                    </>
                  ) : (
                    <Text className="mt-1 text-sm text-amber-600 dark:text-amber-400">
                      Not set — add a pin so clients can find your showroom
                    </Text>
                  )}
                </View>
              </View>
            </View>

            <View className="mt-4">
              <PrimaryButton
                label="Edit showroom & map"
                onPress={() => navigation.navigate('ShowroomSettings')}
              />
            </View>
          </>
        ) : (
          <View className={`${classes.cardPadded} mt-5`}>
            <Text className={classes.bodySm}>
              Browse showrooms from Explore, rent from the Rent tab, and track active bookings under My rentals.
            </Text>
          </View>
        )}

        <SectionTitle title="Preferences" />
        <Pressable
          onPress={() => navigation.navigate('Settings')}
          className={`${classes.card} flex-row items-center px-5 py-4 active:opacity-90`}
        >
          <View
            className="mr-3 h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: isDark ? '#1E1E22' : '#F3F4F6' }}
          >
            <Ionicons name={isDark ? 'moon-outline' : 'sunny-outline'} size={22} color={colors.primary} />
          </View>
          <View className="flex-1">
            <Text className={classes.textBold}>App settings</Text>
            <Text className={`${classes.bodySm} mt-0.5`}>Dark mode and light mode</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>

        <View className="mt-8">
          <PrimaryButton label="Sign out" onPress={handleSignOut} variant="outline" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <Text className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{title}</Text>;
}

function DetailRow({
  icon,
  label,
  value,
  colors,
  isLast = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  colors: { primary: string; textMuted: string };
  isLast?: boolean;
}) {
  return (
    <View className={`flex-row items-start gap-3 ${isLast ? '' : 'mb-4 border-b border-gray-200 pb-4 dark:border-[#2A2A2E]'}`}>
      <View className="mt-0.5 h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-[#1E1E22]">
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View className="flex-1">
        <Text className="text-xs uppercase tracking-wide text-gray-500">{label}</Text>
        <Text className="mt-1 text-base font-medium text-gray-900 dark:text-white">{value}</Text>
      </View>
    </View>
  );
}

function RoleBadge({ role }: { role: UserRole }) {
  const config: Record<UserRole, { label: string; bg: string; text: string }> = {
    client: { label: 'Client', bg: 'rgba(59,130,246,0.15)', text: '#60A5FA' },
    showroom_owner: { label: 'Showroom owner', bg: 'rgba(230,57,70,0.15)', text: '#E63946' },
    admin: { label: 'Admin', bg: 'rgba(168,85,247,0.15)', text: '#C084FC' },
  };
  const item = config[role];
  return (
    <View className="rounded-full px-3 py-1" style={{ backgroundColor: item.bg }}>
      <Text className="text-xs font-semibold" style={{ color: item.text }}>
        {item.label}
      </Text>
    </View>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  const config: Record<UserStatus, { label: string; bg: string; text: string }> = {
    active: { label: 'Active', bg: 'rgba(34,197,94,0.15)', text: '#22C55E' },
    pending: { label: 'Pending approval', bg: 'rgba(234,179,8,0.15)', text: '#EAB308' },
    rejected: { label: 'Rejected', bg: 'rgba(239,68,68,0.15)', text: '#EF4444' },
  };
  const item = config[status];
  return (
    <View className="rounded-full px-3 py-1" style={{ backgroundColor: item.bg }}>
      <Text className="text-xs font-semibold" style={{ color: item.text }}>
        {item.label}
      </Text>
    </View>
  );
}

function roleLabel(role: UserRole): string {
  if (role === 'showroom_owner') return 'Showroom owner';
  if (role === 'admin') return 'Admin';
  return 'Client (rider)';
}

function statusLabel(status: UserStatus): string {
  if (status === 'pending') return 'Pending approval';
  if (status === 'rejected') return 'Rejected';
  return 'Active';
}

function initials(name: string | null | undefined, email: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

function formatCoord(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return '—';
  return value.toFixed(5);
}
