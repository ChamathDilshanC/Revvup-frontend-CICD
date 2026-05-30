import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../../components/PrimaryButton';
import type { ManageStackParamList } from '../../navigation/ManageStack';
import { createBike, fetchBikeDetail, updateBike } from '../../services/bikes';

type Props = NativeStackScreenProps<ManageStackParamList, 'BikeForm'>;

const fieldClass =
  'mb-3 rounded-xl border border-[#2A2A2E] bg-[#141416] px-4 py-3 text-base text-white';

export function BikeFormScreen({ navigation, route }: Props) {
  const bikeId = route.params?.bikeId;
  const isEdit = Boolean(bikeId);

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [topSpeed, setTopSpeed] = useState('');
  const [weight, setWeight] = useState('');
  const [engine, setEngine] = useState('');
  const [horsepower, setHorsepower] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const id = bikeId;
    if (!id) return;
    async function load(editId: string) {
      try {
        const b = await fetchBikeDetail(editId);
        setName(b.name);
        setBrand(b.brand);
        setPrice(String(b.price));
        setImageUrl(b.image_url ?? '');
        setTopSpeed(b.top_speed_mph != null ? String(b.top_speed_mph) : '');
        setWeight(b.weight_lbs != null ? String(b.weight_lbs) : '');
        setEngine(b.engine_cc != null ? String(b.engine_cc) : '');
        setHorsepower(b.horsepower != null ? String(b.horsepower) : '');
        setYear(b.year != null ? String(b.year) : '');
      } catch (e) {
        Alert.alert('Error', e instanceof Error ? e.message : 'Could not load bike');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    }
    void load(id);
  }, [bikeId, navigation]);

  function parseNum(value: string): number | undefined {
    const n = Number(value.trim());
    return Number.isFinite(n) ? n : undefined;
  }

  async function handleSave() {
    if (!name.trim() || !brand.trim() || !price.trim()) {
      Alert.alert('Required fields', 'Name, brand, and price are required.');
      return;
    }
    const priceNum = parseNum(price);
    if (priceNum == null || priceNum < 0) {
      Alert.alert('Invalid price', 'Enter a valid price.');
      return;
    }

    const payload = {
      name: name.trim(),
      brand: brand.trim(),
      price: priceNum,
      image_url: imageUrl.trim() || undefined,
      top_speed_mph: parseNum(topSpeed),
      weight_lbs: parseNum(weight),
      engine_cc: parseNum(engine),
      horsepower: parseNum(horsepower),
      year: parseNum(year),
    };

    setSaving(true);
    try {
      if (isEdit && bikeId) {
        await updateBike(bikeId, payload);
      } else {
        await createBike(payload);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Save failed', e instanceof Error ? e.message : 'Try again');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0A0A0B]">
      <View className="flex-row items-center px-4 py-2">
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} className="flex-row items-center gap-1">
          <Ionicons name="chevron-back" size={24} color="#F5F5F7" />
          <Text className="text-base text-white">Back</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
          <Text className="text-2xl font-bold text-white">{isEdit ? 'Edit bike' : 'Add bike'}</Text>
          <Text className="mt-1 text-gray-400">Listing appears in Explore for all clients.</Text>

          {loading ? (
            <Text className="mt-8 text-gray-400">Loading…</Text>
          ) : (
            <View className="mt-6 pb-8">
              <Field label="Name" value={name} onChangeText={setName} />
              <Field label="Brand" value={brand} onChangeText={setBrand} />
              <Field label="Price (USD)" value={price} onChangeText={setPrice} keyboardType="decimal-pad" />
              <Field label="Image URL (optional)" value={imageUrl} onChangeText={setImageUrl} autoCapitalize="none" />
              <Field label="Top speed (mph)" value={topSpeed} onChangeText={setTopSpeed} keyboardType="number-pad" />
              <Field label="Weight (lbs)" value={weight} onChangeText={setWeight} keyboardType="number-pad" />
              <Field label="Engine (cc)" value={engine} onChangeText={setEngine} keyboardType="number-pad" />
              <Field label="Horsepower" value={horsepower} onChangeText={setHorsepower} keyboardType="number-pad" />
              <Field label="Year" value={year} onChangeText={setYear} keyboardType="number-pad" />
              <PrimaryButton
                label={isEdit ? 'Save changes' : 'Add bike'}
                onPress={handleSave}
                loading={saving}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: 'default' | 'decimal-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences';
}) {
  return (
    <View className="mb-1">
      <Text className="mb-1 text-sm text-gray-400">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#6B7280"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize ?? 'sentences'}
        className={fieldClass}
        placeholder={label}
      />
    </View>
  );
}
