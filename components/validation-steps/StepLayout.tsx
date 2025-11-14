import React, { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StepLayoutProps {
  children: ReactNode;
  footer: ReactNode;
  style?: ViewStyle;
}


export default function StepLayout({ children, footer, style }: StepLayoutProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrapper, style]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        {footer}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: '#EFF1F5' },
  scroll: { flex: 1 },
  contentContainer: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24 },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#fff',
  },
});
