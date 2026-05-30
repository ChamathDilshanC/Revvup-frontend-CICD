import React from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';

type ProfileScreenProps = {
  onSignedOut?: () => void;
};

export function ProfileScreen({ onSignedOut }: ProfileScreenProps) {
  const { profile, isOwner, signOut } = useAuth();

  async function handleSignOut() {
    Alert.alert('Sign out', 'Leave RevvUp on this device?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          onSignedOut?.();
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
    <SafeAreaView className="flex-1 bg-[#0A0A0B]">
      <View className="flex-1 px-4 pt-4">
        <Text className="text-3xl font-bold text-white">Profile</Text>
        <Text className="mt-2 text-gray-400">Your RevvUp account</Text>

        <View className="mt-8 rounded-2xl border border-[#2A2A2E] bg-[#141416] p-5">
          <Row label="Name" value={profile?.full_name ?? '—'} />
          <Row label="Email" value={profile?.email ?? '—'} />
          <Row label="Role" value={roleLabel} />
          {isOwner && profile?.showroom_name ? (
            <Row label="Showroom" value={profile.showroom_name} />
          ) : null}
          {isOwner && profile?.showroom_address ? (
            <Row label="Address" value={profile.showroom_address} />
          ) : null}
          {isOwner && profile?.phone ? <Row label="Phone" value={profile.phone} /> : null}
        </View>

        {isOwner ? (
          <Text className="mt-6 text-sm text-gray-500">
            Use the My bikes tab to add, edit, or delete listings in your showroom.
          </Text>
        ) : (
          <Text className="mt-6 text-sm text-gray-500">
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="mb-4 border-b border-[#2A2A2E] pb-4 last:mb-0 last:border-0 last:pb-0">
      <Text className="text-xs uppercase tracking-wide text-gray-500">{label}</Text>
      <Text className="mt-1 text-base font-medium text-white">{value}</Text>
    </View>
  );
}
