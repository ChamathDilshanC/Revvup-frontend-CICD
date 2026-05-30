import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BikeCard } from '../../components/BikeCard';
import { useAuth } from '../../context/AuthContext';
import { bikeImageUrl } from '../../lib/bikes';
import type { ManageStackParamList } from '../../navigation/ManageStack';
import { useTheme } from '../../context/ThemeContext';
import { deleteBike, fetchMyBikes } from '../../services/bikes';
import type { BikeSummary } from '../../types/bike';

type Nav = NativeStackNavigationProp<ManageStackParamList, 'ManageList'>;

export function ManageBikesScreen() {
  const navigation = useNavigation<Nav>();
  const { profile } = useAuth();
  const { classes } = useTheme();
  const [bikes, setBikes] = useState<BikeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await fetchMyBikes();
      setBikes(data);
    } catch (e) {
      Alert.alert('Error', e instanceof Error ? e.message : 'Could not load your bikes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  function confirmDelete(bike: BikeSummary) {
    Alert.alert('Delete bike', `Remove "${bike.name}" from your showroom?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteBike(bike.id);
            setBikes((prev) => prev.filter((b) => b.id !== bike.id));
          } catch (e) {
            Alert.alert('Delete failed', e instanceof Error ? e.message : 'Try again');
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView className={classes.screen}>
      <View className="flex-row items-center justify-between px-4 pb-2 pt-2">
        <View className="flex-1 pr-3">
          <Text className={classes.title}>My showroom</Text>
          <Text className={classes.subtitle}>
            {profile?.showroom_name ?? 'Your listings'} — add, edit, or remove bikes.
          </Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('BikeForm', {})}
          className="h-12 w-12 items-center justify-center rounded-full bg-[#E63946]"
        >
          <Ionicons name="add" size={28} color="#fff" />
        </Pressable>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#E63946" size="large" />
        </View>
      ) : (
        <FlatList
          data={bikes}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#E63946" />
          }
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, flexGrow: 1 }}
          ListEmptyComponent={
            <View className="mt-12 items-center px-4">
              <Text className={classes.bodyCenter}>No bikes yet. Tap + to add your first listing.</Text>
              <Pressable
                onPress={() => navigation.navigate('BikeForm', {})}
                className="mt-6 rounded-xl bg-[#E63946] px-6 py-3"
              >
                <Text className="font-semibold text-white">Add bike</Text>
              </Pressable>
            </View>
          }
          renderItem={({ item }) => (
            <View className="mb-2">
              <BikeCard
                id={item.id}
                name={item.name}
                brand={item.brand}
                price={item.price}
                imageUrl={bikeImageUrl(item.image_url)}
                topSpeed={item.top_speed_mph ?? undefined}
                onPress={() => navigation.navigate('BikeForm', { bikeId: item.id })}
              />
              <View className="-mt-2 mb-4 flex-row justify-end gap-3 px-1">
                <Pressable onPress={() => navigation.navigate('BikeForm', { bikeId: item.id })}>
                  <Text className="text-sm font-semibold text-[#E63946]">Edit</Text>
                </Pressable>
                <Pressable onPress={() => confirmDelete(item)}>
                  <Text className="text-sm font-semibold text-red-400">Delete</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
