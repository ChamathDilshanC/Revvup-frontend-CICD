import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const DEV_NAME = 'Chamath Dilshan';
const DEV_EMAIL = 'dilshancolonne123@gmail.com';

export function AuthFooter() {
  const year = new Date().getFullYear();

  return (
    <View style={styles.wrap}>
      <Text style={styles.copyright}>© {year} RevvUp. All rights reserved.</Text>
      <Text style={styles.dev}>
        Developed by {DEV_NAME} · {DEV_EMAIL}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 12,
    paddingBottom: 4,
    alignItems: 'center',
    gap: 4,
  },
  copyright: {
    fontSize: 11,
    color: '#9CA3AF',
    letterSpacing: 0.3,
  },
  dev: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 14,
    paddingHorizontal: 16,
  },
});
