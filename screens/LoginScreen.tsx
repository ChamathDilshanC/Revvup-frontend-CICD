import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { AuthBrandHeader } from '../components/AuthBrandHeader';
import { AuthScaffold } from '../components/AuthScaffold';
import { AuthTextField } from '../components/AuthTextField';
import { PrimaryButton } from '../components/PrimaryButton';
import type { AuthStackParamList } from '../navigation/AuthStack';
import { useAuth } from '../context/AuthContext';
import { ApiRequestError, apiRequest } from '../services/api';
import { clearPendingOwnerEmail, setTokens } from '../lib/storage';
import type { AuthResponse } from '../types/user';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'> & {
  onAuthenticated: () => void;
};

export function LoginScreen({ navigation, onAuthenticated }: Props) {
  const { setProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const data = await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      });
      if (data.access_token) {
        await setTokens(data.access_token, data.refresh_token);
        await clearPendingOwnerEmail();
      }
      setProfile(data.profile);
      onAuthenticated();
    } catch (e) {
      if (e instanceof ApiRequestError && e.code === 'ACCOUNT_PENDING') {
        Alert.alert(
          'Account pending approval',
          e.message ||
            'Your showroom owner account is still pending. Please wait for approval before signing in.',
        );
        return;
      }
      Alert.alert('Login failed', e instanceof Error ? e.message : 'Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthScaffold scroll={false}>
      <View style={styles.page}>
        <View style={styles.header}>
          <AuthBrandHeader
            title="Sign in"
            subtitle="Premium bikes await. Enter your account details."
          />
        </View>

        <View style={styles.form}>
          <AuthTextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
          <AuthTextField
            ref={passwordRef}
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={() => void handleLogin()}
          />
          <PrimaryButton label="Sign In" onPress={handleLogin} loading={loading} />
          <Pressable onPress={() => navigation.push('Register')} style={styles.linkWrap}>
            <Text style={styles.link}>
              New here? <Text style={styles.linkBold}>Create account</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </AuthScaffold>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    width: '100%',
    paddingTop: 8,
  },
  form: {
    paddingBottom: 12,
  },
  linkWrap: {
    marginTop: 20,
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
