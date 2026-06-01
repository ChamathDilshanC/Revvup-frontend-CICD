import { useFocusEffect, useNavigation } from '@react-navigation/native';

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import React, { useCallback, useMemo, useState } from 'react';

import {

  ActivityIndicator,

  Pressable,

  RefreshControl,

  SectionList,

  Text,

  View,

} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { hasMapCoordinates } from '../constants/map';

import { SafeAreaView } from 'react-native-safe-area-context';

import { ExploreMeshBackground } from '../components/ExploreMeshBackground';

import { GlassSurface } from '../components/GlassSurface';

import { SearchField } from '../components/SearchField';

import { ShowroomBikeSpotlight } from '../components/ShowroomBikeSpotlight';

import { ProvinceFilterBar } from '../components/ProvinceFilterBar';

import { useClientProvinceFilter } from '../hooks/useClientProvinceFilter';

import { groupBikesByShowroom } from '../lib/bikes';

import { filterShowroomGroups } from '../lib/filterShowrooms';

import type { ExploreStackParamList } from '../navigation/ExploreStack';

import { useTheme } from '../context/ThemeContext';

import { fetchCatalog } from '../services/bikes';

import type { BikeSummary } from '../types/bike';



type Nav = NativeStackNavigationProp<ExploreStackParamList, 'ExploreHome'>;



export function ExploreScreen() {

  const navigation = useNavigation<Nav>();

  const { classes, colors, isDark } = useTheme();

  const [bikes, setBikes] = useState<BikeSummary[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');

  const {
    selectedProvince,
    setSelectedProvince,
    provinceCounts,
    filteredBikes,
    detectFromGps,
    locating,
  } = useClientProvinceFilter(bikes);

  const load = useCallback(async (isRefresh = false) => {

    if (isRefresh) setRefreshing(true);

    else setLoading(true);

    setError(null);

    try {

      const data = await fetchCatalog();

      setBikes(data);

    } catch (e) {

      setError(e instanceof Error ? e.message : 'Could not load bikes');

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



  const sections = useMemo(() => {
    const filtered = filterShowroomGroups(groupBikesByShowroom(filteredBikes), searchQuery);

    return filtered.map((g) => ({
      key: g.key,
      title: g.showroomName,
      address: g.showroomAddress,
      province: g.showroomProvince,
      latitude: g.showroomLatitude,
      longitude: g.showroomLongitude,
      bikeCount: g.bikes.length,
      data: [{ key: g.key, bikes: g.bikes }],
    }));
  }, [filteredBikes, searchQuery]);



  return (

    <View className="flex-1">

      <ExploreMeshBackground />



      <SafeAreaView className="flex-1" style={{ backgroundColor: 'transparent' }}>

        <View className="px-4 pb-3 pt-2">
          <Text className={classes.title}>Explore</Text>
          <Text className={classes.subtitle}>
            {selectedProvince
              ? `Showrooms in ${selectedProvince} Province — tap a bike for details.`
              : 'Premium listings from verified showrooms — tap a bike for full details.'}
          </Text>
        </View>



        {loading && !refreshing ? (

          <View className="flex-1 items-center justify-center">

            <ActivityIndicator color="#E63946" size="large" />

          </View>

        ) : error ? (

          <View className="flex-1 items-center justify-center px-6">

            <GlassSurface borderRadius={20}>

              <Text className={`${classes.bodyCenter} px-4 py-6`}>{error}</Text>

            </GlassSurface>

          </View>

        ) : (

          <SectionList

            sections={sections}

            keyExtractor={(item) => item.key}

            refreshControl={

              <RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor="#E63946" />

            }

            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}

            stickySectionHeadersEnabled={false}

            ListHeaderComponent={
              <>
                <ProvinceFilterBar
                  selectedProvince={selectedProvince}
                  onSelectProvince={setSelectedProvince}
                  provinceCounts={provinceCounts}
                  onUseMyLocation={() => void detectFromGps()}
                  locating={locating}
                />
                <SearchField
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search showrooms or bikes…"
                />
              </>
            }

            ListEmptyComponent={

              <GlassSurface borderRadius={20}>

                <Text className={`${classes.empty} px-4 py-8`}>

                  {searchQuery.trim()
                    ? 'No showrooms match your search.'
                    : selectedProvince
                      ? `No showrooms in ${selectedProvince} Province yet. Try All or another province.`
                      : 'No bikes listed yet. Check back soon.'}

                </Text>

              </GlassSurface>

            }

            renderSectionHeader={({ section }) => {

              const canMap = hasMapCoordinates(section.latitude, section.longitude);

              return (

                <Pressable

                  disabled={!canMap}

                  onPress={() =>

                    canMap &&

                    navigation.navigate('ShowroomMap', {

                      showroomName: section.title,

                      showroomAddress: section.address,

                      latitude: section.latitude!,

                      longitude: section.longitude!,

                    })

                  }

                  className="mb-2 mt-4 active:opacity-90"

                >

                  <GlassSurface borderRadius={18} intensity={isDark ? 36 : 48}>

                    <View className="flex-row items-start justify-between px-4 py-3">

                      <View className="flex-1 pr-2">

                        <Text className={classes.heading}>{section.title}</Text>

                        {section.province ? (
                          <Text className={`${classes.bodyXs} mt-1 font-medium`} style={{ opacity: 0.85 }}>
                            {section.province} Province
                          </Text>
                        ) : null}

                        {section.address ? (
                          <Text className={`${classes.bodySm} mt-1`}>{section.address}</Text>
                        ) : null}

                        <Text className={`${classes.bodyXs} mt-1`}>

                          {section.bikeCount} bike{section.bikeCount === 1 ? '' : 's'}

                          {section.bikeCount > 1 ? ' · spotlight rotates' : ''}

                        </Text>

                      </View>

                      {canMap ? (

                        <View

                          className="flex-row items-center gap-1 rounded-full px-2.5 py-1.5"

                          style={{

                            backgroundColor: isDark

                              ? 'rgba(230,57,70,0.18)'

                              : 'rgba(230,57,70,0.1)',

                          }}

                        >

                          <Ionicons name="map-outline" size={16} color={colors.primary} />

                          <Text className="text-xs font-semibold" style={{ color: colors.primary }}>

                            Map

                          </Text>

                        </View>

                      ) : null}

                    </View>

                  </GlassSurface>

                </Pressable>

              );

            }}

            renderItem={({ item }) => (

              <ShowroomBikeSpotlight

                bikes={item.bikes}

                onPress={(id) => navigation.navigate('BikeDetail', { bikeId: id })}

              />

            )}

          />

        )}

      </SafeAreaView>

    </View>

  );

}


