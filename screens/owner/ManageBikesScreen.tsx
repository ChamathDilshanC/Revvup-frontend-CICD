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

import { ExploreMeshBackground } from '../../components/ExploreMeshBackground';

import { GlassIconButton } from '../../components/GlassIconButton';

import { GlassSurface } from '../../components/GlassSurface';

import { ManageBikeCard } from '../../components/ManageBikeCard';

import { useAuth } from '../../context/AuthContext';

import { bikeImageUrl, isBikeAvailable } from '../../lib/bikes';

import type { ManageStackParamList } from '../../navigation/ManageStack';

import { useTheme } from '../../context/ThemeContext';

import { deleteBike, fetchMyBikes } from '../../services/bikes';

import type { BikeSummary } from '../../types/bike';



type Nav = NativeStackNavigationProp<ManageStackParamList, 'ManageList'>;



export function ManageBikesScreen() {

  const navigation = useNavigation<Nav>();

  const { profile } = useAuth();

  const { classes, colors, isDark } = useTheme();

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

    <View className="flex-1">

      <ExploreMeshBackground />



      <SafeAreaView className="flex-1" style={{ backgroundColor: 'transparent' }}>

        <View className="flex-row items-start justify-between px-4 pb-2 pt-2">
          <View className="flex-1 pr-3">
            <Text className={classes.title}>My showroom</Text>
            <Text className={classes.subtitle}>
              {profile?.showroom_name ?? 'Your listings'} — add, edit, or remove bikes.
            </Text>
          </View>

          <GlassIconButton
            icon="add"
            variant="filled"
            size={28}
            accessibilityLabel="Add bike"
            onPress={() => navigation.navigate('BikeForm', {})}
            style={{ marginTop: 8, width: 52, height: 52, borderRadius: 26 }}
          />

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

              <GlassSurface borderRadius={24}>

                <View className="items-center px-6 py-10">

                  <Ionicons name="bicycle-outline" size={48} color={colors.textSecondary} />

                  <Text className={`${classes.bodyCenter} mt-4`}>

                    No bikes yet. Tap + to add your first listing.

                  </Text>

                  <Pressable

                    onPress={() => navigation.navigate('BikeForm', {})}

                    className="mt-6 flex-row items-center gap-2 rounded-full bg-[#E63946] px-6 py-3"

                  >

                    <Ionicons name="add-circle-outline" size={22} color="#fff" />

                    <Text className="font-semibold text-white">Add bike</Text>

                  </Pressable>

                </View>

              </GlassSurface>

            }

            renderItem={({ item }) => (

              <ManageBikeCard
                name={item.name}

                brand={item.brand}

                priceUsd={item.price}

                imageUrl={bikeImageUrl(item.image_url)}

                topSpeedMph={item.top_speed_mph}
                isAvailable={isBikeAvailable(item)}
                onEdit={() => navigation.navigate('BikeForm', { bikeId: item.id })}

                onDelete={() => confirmDelete(item)}

              />

            )}

          />

        )}

      </SafeAreaView>

    </View>

  );

}


