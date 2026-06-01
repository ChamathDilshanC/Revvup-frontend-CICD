import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BikePhotoPicker, type PickedBikeImage } from '../../components/BikePhotoPicker';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ScreenBackButton } from '../../components/ScreenBackButton';
import { useTheme } from '../../context/ThemeContext';
import type { ManageStackParamList } from '../../navigation/ManageStack';
import {
  createBike,
  fetchBikeDetail,
  updateBike,
  uploadBikeImage,
} from '../../services/bikes';

type Props = NativeStackScreenProps<ManageStackParamList, 'BikeForm'>;

export function BikeFormScreen({ navigation, route }: Props) {
  const { classes, colors } = useTheme();
  const bikeId = route.params?.bikeId;
  const isEdit = Boolean(bikeId);

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [pickedImage, setPickedImage] = useState<PickedBikeImage | null>(null);
  const [topSpeed, setTopSpeed] = useState('');
  const [weight, setWeight] = useState('');
  const [engine, setEngine] = useState('');
  const [horsepower, setHorsepower] = useState('');
  const [year, setYear] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isRentable, setIsRentable] = useState(false);
  const [rentPerHour, setRentPerHour] = useState('');
  const [rentPerDay, setRentPerDay] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  const previewUri = pickedImage?.uri ?? existingImageUrl;

  useEffect(() => {
    const id = bikeId;
    if (!id) return;
    async function load(editId: string) {
      try {
        const b = await fetchBikeDetail(editId);
        setName(b.name);
        setBrand(b.brand);
        setPrice(String(b.price));
        setExistingImageUrl(b.image_url ?? null);
        setTopSpeed(b.top_speed_mph != null ? String(b.top_speed_mph) : '');
        setWeight(b.weight_lbs != null ? String(b.weight_lbs) : '');
        setEngine(b.engine_cc != null ? String(b.engine_cc) : '');
        setHorsepower(b.horsepower != null ? String(b.horsepower) : '');
        setYear(b.year != null ? String(b.year) : '');
        setIsAvailable(b.is_available !== false);
        setIsRentable(b.is_rentable === true);
        setRentPerHour(b.rent_per_hour != null ? String(b.rent_per_hour) : '');
        setRentPerDay(b.rent_per_day != null ? String(b.rent_per_day) : '');
        setSecurityDeposit(b.security_deposit != null ? String(b.security_deposit) : '');
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

  function handleImageChange(image: PickedBikeImage | null) {
    setPickedImage(image);
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
      top_speed_mph: parseNum(topSpeed),
      weight_lbs: parseNum(weight),
      engine_cc: parseNum(engine),
      horsepower: parseNum(horsepower),
      year: parseNum(year),
      is_available: isAvailable,
      is_rentable: isRentable,
      rent_per_hour: isRentable ? parseNum(rentPerHour) : undefined,
      rent_per_day: isRentable ? parseNum(rentPerDay) : undefined,
      security_deposit: isRentable ? parseNum(securityDeposit) : undefined,
    };

    setSaving(true);
    try {
      let savedId = bikeId;
      if (isEdit && bikeId) {
        await updateBike(bikeId, payload);
      } else {
        const created = await createBike(payload);
        savedId = created.id;
      }

      if (pickedImage && savedId) {
        try {
          await uploadBikeImage(savedId, pickedImage);
        } catch (uploadErr) {
          Alert.alert(
            'Photo not uploaded',
            uploadErr instanceof Error
              ? uploadErr.message
              : 'Bike was saved, but the photo could not be uploaded. Tap Save again or edit the bike to retry.',
          );
          return;
        }
      }

      navigation.goBack();
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : 'Try again';
      Alert.alert('Save failed', message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView className={classes.screen}>
      <View className="px-4 py-2">
        <ScreenBackButton onPress={() => navigation.goBack()} />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
          <Text className={classes.titleLg}>{isEdit ? 'Edit bike' : 'Add bike'}</Text>
          <Text className={classes.subtitle}>Listing appears in Explore for all clients.</Text>

          {loading ? (
            <Text className={`${classes.body} mt-8`}>Loading…</Text>
          ) : (
            <View className="mt-6 pb-8">
              <BikePhotoPicker
                previewUri={previewUri}
                showRemove={Boolean(pickedImage)}
                onImageChange={handleImageChange}
              />
              <Field classes={classes} colors={colors} label="Name" value={name} onChangeText={setName} />
              <Field classes={classes} colors={colors} label="Brand" value={brand} onChangeText={setBrand} />
              <Field classes={classes} colors={colors} label="Price (USD)" value={price} onChangeText={setPrice} keyboardType="decimal-pad" />
              <Field
                classes={classes}
                colors={colors}
                label="Top speed (mph)"
                value={topSpeed}
                onChangeText={setTopSpeed}
                keyboardType="number-pad"
                placeholder="e.g. 115"
              />
              <Field
                classes={classes}
                colors={colors}
                label="Weight (lbs) — shown in Explore"
                value={weight}
                onChangeText={setWeight}
                keyboardType="number-pad"
                placeholder="e.g. 180"
              />
              <Field
                classes={classes}
                colors={colors}
                label="Engine (cc) — shown in Explore"
                value={engine}
                onChangeText={setEngine}
                keyboardType="number-pad"
                placeholder="e.g. 150"
              />
              <Field classes={classes} colors={colors} label="Horsepower" value={horsepower} onChangeText={setHorsepower} keyboardType="number-pad" />
              <Field classes={classes} colors={colors} label="Year" value={year} onChangeText={setYear} keyboardType="number-pad" />

              <View
                className={`${classes.card} mb-4 flex-row items-center justify-between px-4 py-3`}
              >
                <View className="flex-1 pr-3">
                  <Text className={classes.textBold}>Available for clients</Text>
                  <Text className={`${classes.bodySm} mt-1`}>
                    Turn off when sold or not for sale — clients see &quot;Not available&quot; in Explore.
                  </Text>
                </View>
                <Switch
                  value={isAvailable}
                  onValueChange={setIsAvailable}
                  trackColor={{ false: '#9CA3AF', true: '#E63946' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View
                className={`${classes.card} mb-4 flex-row items-center justify-between px-4 py-3`}
              >
                <View className="flex-1 pr-3">
                  <Text className={classes.textBold}>Available for rent</Text>
                  <Text className={`${classes.bodySm} mt-1`}>
                    Clients can book this bike from Explore. Leave rates empty to use defaults.
                  </Text>
                </View>
                <Switch
                  value={isRentable}
                  onValueChange={setIsRentable}
                  trackColor={{ false: '#9CA3AF', true: '#E63946' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {isRentable ? (
                <>
                  <Field
                    classes={classes}
                    colors={colors}
                    label="Rent per hour (LKR)"
                    value={rentPerHour}
                    onChangeText={setRentPerHour}
                    keyboardType="number-pad"
                    placeholder="Default 1,500"
                  />
                  <Field
                    classes={classes}
                    colors={colors}
                    label="Rent per day (LKR)"
                    value={rentPerDay}
                    onChangeText={setRentPerDay}
                    keyboardType="number-pad"
                    placeholder="Default 15,000"
                  />
                  <Field
                    classes={classes}
                    colors={colors}
                    label="Security deposit (LKR)"
                    value={securityDeposit}
                    onChangeText={setSecurityDeposit}
                    keyboardType="number-pad"
                    placeholder="Default 5,000"
                  />
                </>
              ) : null}

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
  placeholder,
  classes,
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  keyboardType?: 'default' | 'decimal-pad' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences';
  placeholder?: string;
  classes: { inputLabel: string; inputMb: string };
  colors: { placeholder: string };
}) {
  return (
    <View className="mb-1">
      <Text className={classes.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={colors.placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize ?? 'sentences'}
        className={classes.inputMb}
        placeholder={placeholder ?? label}
      />
    </View>
  );
}
