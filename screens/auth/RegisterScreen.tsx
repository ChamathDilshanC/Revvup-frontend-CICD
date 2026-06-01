import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    BackHandler,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { AuthBackButton } from '../components/AuthBackButton';
import { AuthBrandHeader } from '../components/AuthBrandHeader';
import { AuthScaffold } from '../components/AuthScaffold';
import { AuthTextField } from '../components/AuthTextField';
import { PendingOwnerBanner } from '../components/PendingOwnerBanner';
import { PrimaryButton } from '../components/PrimaryButton';
import { useOwnerApprovalWatcher } from '../hooks/useOwnerApprovalWatcher';
import { getPendingOwnerEmail, setPendingOwnerEmail, setTokens } from '../lib/storage';
import type { AuthStackParamList } from '../navigation/AuthStack';
import { ApiRequestError, apiRequest } from '../services/api';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'> & {
  onAuthenticated: () => void;
};

type Role = 'client' | 'showroom_owner';

type AuthResponse = {
  access_token: string | null;
  refresh_token?: string | null;
  profile: { role: string; status: string };
  message?: string;
};

const OWNER_PENDING_ALERT = {
  title: 'Registration pending',
  message:
    'Your showroom owner application is already under review. Please wait until the RevvUp team approves or rejects it. You will receive access to sign in only after approval. If you need help, contact support.',
};

const OWNER_SUBMITTED_ALERT = {
  title: 'Application submitted',
  message:
    'Thank you for registering your showroom. Your account is pending approval — we have notified the RevvUp team by email. Once approved, return here and sign in with the same email and password you just created.',
};

const OWNER_EXISTS_ALERT = {
  title: 'Showroom owner account exists',
  message:
    'This showroom or phone number already has a showroom owner account. Please sign in, or register as a client with a different email.',
};

/** Blocks repeat showroom register while pending (local storage + API). */
const ENFORCE_OWNER_PENDING_LOCK = true;

export function RegisterScreen({ navigation, onAuthenticated }: Props) {
  const [role, setRole] = useState<Role>('client');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showroomName, setShowroomName] = useState('');
  const [showroomAddress, setShowroomAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingOwnerEmail, setPendingOwnerEmailState] = useState<string | null>(null);
  const [ownerExistsLockKey, setOwnerExistsLockKey] = useState<string | null>(null);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const showroomNameRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const allowLeaveRef = useRef(false);

  const hasPendingOwnerLock = ENFORCE_OWNER_PENDING_LOCK && Boolean(pendingOwnerEmail);
  const isOwnerPendingLocked = hasPendingOwnerLock && role === 'showroom_owner';

  const showShowroomFields = role === 'showroom_owner' && !isOwnerPendingLocked;
  const currentOwnerKey = `${showroomName.trim().toLowerCase()}|${phone.trim().toLowerCase()}`;
  const isOwnerExistsLocked =
    role === 'showroom_owner' && Boolean(ownerExistsLockKey) && ownerExistsLockKey === currentOwnerKey;
  const isRegisterDisabled = isOwnerPendingLocked || isOwnerExistsLocked;

  useEffect(() => {
    if (!ENFORCE_OWNER_PENDING_LOCK) return;
    getPendingOwnerEmail().then((stored) => {
      if (stored) {
        setPendingOwnerEmailState(stored);
        setRole('showroom_owner');
        setEmail(stored);
      }
    });
  }, []);

  const goToLogin = useCallback(() => {
    allowLeaveRef.current = true;
    navigation.replace('Login');
  }, [navigation]);

  const handleOwnerApproved = useCallback(() => {
    setPendingOwnerEmailState(null);
    setOwnerExistsLockKey(null);
    setRole('client');
  }, []);

  useOwnerApprovalWatcher({
    email: pendingOwnerEmail ?? email,
    onApproved: handleOwnerApproved,
    navigateToLogin: goToLogin,
  });

  useEffect(() => {
    navigation.setOptions({ gestureEnabled: false, fullScreenGestureEnabled: false });
    const unsub = navigation.addListener('beforeRemove', (event) => {
      if (allowLeaveRef.current) return;
      if (event.data.action.type === 'GO_BACK' || event.data.action.type === 'POP') {
        event.preventDefault();
      }
    });
    return unsub;
  }, [navigation]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      // Keep entered values intact by blocking Android hardware back on this screen.
      return true;
    });
    return () => sub.remove();
  }, []);

  const showOwnerPendingAlert = useCallback(() => {
    Alert.alert(OWNER_PENDING_ALERT.title, OWNER_PENDING_ALERT.message, [
      { text: 'OK' },
      { text: 'Go to Sign in', onPress: goToLogin },
    ]);
  }, [goToLogin]);

  const markOwnerPending = useCallback(async (ownerEmail: string) => {
    const key = ownerEmail.trim().toLowerCase();
    await setPendingOwnerEmail(key);
    setPendingOwnerEmailState(key);
  }, []);

  async function handleRegister() {
    if (isOwnerPendingLocked) {
      showOwnerPendingAlert();
      return;
    }
    if (isOwnerExistsLocked) {
      Alert.alert(OWNER_EXISTS_ALERT.title, OWNER_EXISTS_ALERT.message, [
        { text: 'OK' },
        { text: 'Go to Sign in', onPress: goToLogin },
      ]);
      return;
    }

    if (!fullName.trim() || !email.trim() || password.length < 8) {
      Alert.alert('Check your details', 'Name, email, and password (8+ chars) are required.');
      return;
    }
    if (role === 'showroom_owner' && !showroomName.trim()) {
      Alert.alert('Showroom required', 'Enter your showroom name.');
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim(),
          password,
          full_name: fullName.trim(),
          role,
          showroom_name: role === 'showroom_owner' ? showroomName.trim() : undefined,
          showroom_address: role === 'showroom_owner' ? showroomAddress.trim() : undefined,
          phone: role === 'showroom_owner' ? phone.trim() : undefined,
        }),
      });

      if (data.access_token) {
        await setTokens(data.access_token, data.refresh_token);
        onAuthenticated();
        return;
      }

      if (role === 'showroom_owner') {
        setOwnerExistsLockKey(currentOwnerKey);
        if (ENFORCE_OWNER_PENDING_LOCK) await markOwnerPending(email);
        Alert.alert(OWNER_SUBMITTED_ALERT.title, data.message ?? OWNER_SUBMITTED_ALERT.message, [
          { text: 'OK' },
          { text: 'Go to Sign in', onPress: goToLogin },
        ]);
        return;
      }

      Alert.alert('Registration complete', data.message ?? 'You can sign in now.', [
        { text: 'Sign in', onPress: goToLogin },
      ]);
    } catch (e) {
      if (ENFORCE_OWNER_PENDING_LOCK && e instanceof ApiRequestError && e.code === 'OWNER_PENDING') {
        await markOwnerPending(email);
        showOwnerPendingAlert();
        return;
      }
      if (e instanceof ApiRequestError && e.code === 'OWNER_ALREADY_EXISTS') {
        setOwnerExistsLockKey(currentOwnerKey);
        Alert.alert(OWNER_EXISTS_ALERT.title, e.message || OWNER_EXISTS_ALERT.message, [
          { text: 'OK' },
          { text: 'Go to Sign in', onPress: goToLogin },
        ]);
        return;
      }
      const message = e instanceof Error ? e.message : 'Try again.';
      Alert.alert('Registration failed', message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScaffold scroll={false}>
      <View style={styles.page}>
        <View style={styles.header}>
          <AuthBackButton onPress={goToLogin} />
          <AuthBrandHeader
            title="Create account"
            subtitle="Join as a rider or register your bike showroom."
          >
            <View style={styles.roleRow}>
              <RoleChip
                label="Client"
                active={role === 'client'}
                onPress={() => setRole('client')}
                disabled={false}
              />
              <RoleChip
                label="Showroom owner"
                active={role === 'showroom_owner'}
                onPress={() => !hasPendingOwnerLock && setRole('showroom_owner')}
                disabled={hasPendingOwnerLock}
              />
            </View>
          </AuthBrandHeader>
        </View>

        <View style={styles.form}>
          {isOwnerPendingLocked && pendingOwnerEmail ? (
            <PendingOwnerBanner email={pendingOwnerEmail} />
          ) : null}

          <AuthTextField
            label="Full name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            textContentType="name"
            returnKeyType="next"
            blurOnSubmit={false}
            editable={!isOwnerPendingLocked}
            onSubmitEditing={() => emailRef.current?.focus()}
          />
          <AuthTextField
            ref={emailRef}
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            blurOnSubmit={false}
            editable={!isOwnerPendingLocked}
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
          <AuthTextField
            ref={passwordRef}
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password-new"
            textContentType="newPassword"
            returnKeyType={showShowroomFields ? 'next' : 'go'}
            blurOnSubmit={!showShowroomFields}
            editable={!isOwnerPendingLocked}
            onSubmitEditing={() => {
              if (showShowroomFields) {
                showroomNameRef.current?.focus();
              } else {
                void handleRegister();
              }
            }}
          />

          {showShowroomFields && (
            <>
              <AuthTextField
                ref={showroomNameRef}
                label="Showroom name"
                value={showroomName}
                onChangeText={setShowroomName}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => addressRef.current?.focus()}
              />
              <AuthTextField
                ref={addressRef}
                label="Address"
                value={showroomAddress}
                onChangeText={setShowroomAddress}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => phoneRef.current?.focus()}
              />
              <AuthTextField
                ref={phoneRef}
                label="Phone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                returnKeyType="go"
                onSubmitEditing={() => void handleRegister()}
              />
            </>
          )}

          <PrimaryButton
            label={isRegisterDisabled ? 'Registration unavailable' : 'Register'}
            onPress={handleRegister}
            loading={loading}
            disabled={isRegisterDisabled}
          />
          <Pressable onPress={goToLogin} style={styles.linkWrap}>
            <Text style={styles.link}>
              Already have an account? <Text style={styles.linkBold}>Sign in</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthScaffold>
  );
}

function RoleChip({
  label,
  active,
  onPress,
  disabled,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.chip, active && styles.chipActive, disabled && styles.chipDisabled]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  header: {
    width: '100%',
    paddingTop: 8,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    width: '100%',
    alignSelf: 'stretch',
  },
  chip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
  },
  chipActive: {
    borderColor: '#E63946',
    backgroundColor: 'rgba(230,57,70,0.2)',
  },
  chipDisabled: {
    opacity: 0.5,
  },
  chipText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFF',
  },
  form: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    marginTop: 8,
    paddingBottom: 12,
  },
  linkWrap: {
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  link: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
  },
  linkBold: {
    color: '#E63946',
    fontWeight: '600',
  },
});
