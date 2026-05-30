import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, type MapPressEvent, type Region } from 'react-native-maps';
import { DEFAULT_MAP_REGION, hasMapCoordinates } from '../constants/map';

type ShowroomMapProps = {
  latitude?: number | null;
  longitude?: number | null;
  title?: string;
  height?: number;
  /** Tap map / drag marker to pick a new pin (owner settings). */
  editable?: boolean;
  onLocationChange?: (lat: number, lng: number) => void;
};

export function ShowroomMap({
  latitude,
  longitude,
  title,
  height = 220,
  editable = false,
  onLocationChange,
}: ShowroomMapProps) {
  const hasPin = hasMapCoordinates(latitude, longitude);

  const region: Region = useMemo(() => {
    if (hasPin) {
      return {
        latitude: latitude!,
        longitude: longitude!,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      };
    }
    return DEFAULT_MAP_REGION;
  }, [hasPin, latitude, longitude]);

  function handlePress(e: MapPressEvent) {
    if (!editable || !onLocationChange) return;
    const { latitude: lat, longitude: lng } = e.nativeEvent.coordinate;
    onLocationChange(lat, lng);
  }

  function handleDragEnd(coordinate: { latitude: number; longitude: number }) {
    onLocationChange?.(coordinate.latitude, coordinate.longitude);
  }

  return (
    <View style={[styles.wrap, { height }]}>
      <MapView
        style={StyleSheet.absoluteFill}
        region={region}
        onPress={handlePress}
        scrollEnabled={editable}
        zoomEnabled={editable}
        pitchEnabled={false}
        rotateEnabled={false}
      >
        {hasPin ? (
          <Marker
            coordinate={{ latitude: latitude!, longitude: longitude! }}
            title={title}
            draggable={editable}
            onDragEnd={(e) => handleDragEnd(e.nativeEvent.coordinate)}
          />
        ) : null}
      </MapView>
      {editable && !hasPin ? (
        <View style={styles.hint} pointerEvents="none">
          <Text style={styles.hintText}>Tap the map to set your showroom pin</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A2E',
    backgroundColor: '#141416',
  },
  hint: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  hintText: {
    color: '#F5F5F7',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
