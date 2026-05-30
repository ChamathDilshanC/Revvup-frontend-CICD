import React, { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BrandLogo } from './BrandLogo';

type AuthBrandHeaderProps = {
  title: string;
  subtitle: string;
  children?: ReactNode;
};

/** Logo + title block — shared left edge for logo and headings. */
export function AuthBrandHeader({ title, subtitle, children }: AuthBrandHeaderProps) {
  return (
    <View style={styles.wrap}>
      <BrandLogo />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignSelf: 'stretch',
    alignItems: 'flex-start',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'left',
    alignSelf: 'stretch',
    includeFontPadding: false,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 15,
    textAlign: 'left',
    alignSelf: 'stretch',
    marginTop: 8,
    lineHeight: 22,
    paddingRight: 20,
    includeFontPadding: false,
  },
});
