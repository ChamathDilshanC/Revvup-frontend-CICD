import { LinearGradient } from 'expo-linear-gradient';
import React, { type ReactNode, useEffect, useState } from 'react';
import { AppImage } from './AppImage';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AUTH_HERO_IMAGE } from '../constants/images';
import { AuthFooter } from './AuthFooter';

type AuthScaffoldProps = {
  children: ReactNode;
  scroll?: boolean;
};

const FOOTER_SPACE = 80;
const FOOTER_BOTTOM_OFFSET = 28;

export function AuthScaffold({ children, scroll = true }: AuthScaffoldProps) {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const contentPadding = {
    paddingBottom: keyboardVisible ? 12 : FOOTER_SPACE,
  };

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, contentPadding]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
    >
      <Pressable style={styles.dismissArea} onPress={Keyboard.dismiss}>
        {children}
      </Pressable>
    </ScrollView>
  ) : (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[styles.fillContent, contentPadding]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <Pressable style={styles.dismissArea} onPress={Keyboard.dismiss}>
        {children}
      </Pressable>
    </ScrollView>
  );

  return (
    <View style={styles.root}>
      <AppImage source={AUTH_HERO_IMAGE} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <LinearGradient
        colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0.55)', 'rgba(0,0,0,0.92)', '#000000']}
        locations={[0, 0.35, 0.72, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {body}
        </KeyboardAvoidingView>
        <View
          style={[styles.footerOverlay, keyboardVisible && styles.footerHidden]}
          pointerEvents={keyboardVisible ? 'none' : 'auto'}
        >
          <AuthFooter />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 8,
    justifyContent: 'center',
  },
  fillContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 8,
  },
  dismissArea: {
    flexGrow: 1,
    width: '100%',
  },
  footerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: FOOTER_BOTTOM_OFFSET,
  },
  footerHidden: {
    opacity: 0,
  },
});
