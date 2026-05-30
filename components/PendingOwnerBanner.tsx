import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type PendingOwnerBannerProps = {
  email: string;
};

export function PendingOwnerBanner({ email }: PendingOwnerBannerProps) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Registration pending approval</Text>
      <Text style={styles.body}>
        Your showroom owner application for <Text style={styles.email}>{email}</Text> is waiting
        for RevvUp team approval. You cannot submit again until a decision is made. Once approved,
        sign in with the same email and password.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: 'rgba(234, 179, 8, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(234, 179, 8, 0.35)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  title: {
    color: '#EAB308',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  body: {
    color: '#D1D5DB',
    fontSize: 13,
    lineHeight: 19,
  },
  email: {
    color: '#F5F5F7',
    fontWeight: '600',
  },
});
