import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  route?: { params?: { bikeId?: string } };
};

export function AddEditBikeScreen({ route }: Props) {
  const bikeId = route?.params?.bikeId;
  const isEdit = Boolean(bikeId);

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0B] px-4">
      <Text className="mt-6 text-3xl font-bold text-white">
        {isEdit ? 'Edit bike' : 'Add bike'}
      </Text>
      <Text className="mt-2 text-gray-400">
        Form for POST / PUT /api/v1/owner/bikes — owner-isolated CRUD.
      </Text>
    </SafeAreaView>
  );
}
