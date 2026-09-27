import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { strings } from '../constants/strings';
import type { AppColors } from '../theme/colors';
import { typography } from '../theme/typography';

type Props = {
  colors: AppColors;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
};

export function ErrorBanner({
  colors,
  message,
  actionLabel,
  onAction,
  onDismiss,
}: Props) {
  return (
    <View style={[styles.container, { backgroundColor: colors.errorBg }]}>
      <Text style={[typography.small, { color: colors.errorText }]}>
        {message}
      </Text>
      <View style={styles.actions}>
        {onAction && actionLabel ? (
          <Pressable onPress={onAction} hitSlop={8}>
            <Text style={[typography.smallStrong, { color: colors.errorText }]}>
              {actionLabel}
            </Text>
          </Pressable>
        ) : null}
        {onDismiss ? (
          <Pressable onPress={onDismiss} hitSlop={8}>
            <Text style={[typography.smallStrong, { color: colors.errorText }]}>
              {strings.banners.dismiss}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    gap: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
});
