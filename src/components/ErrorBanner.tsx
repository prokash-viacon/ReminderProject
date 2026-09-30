import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { strings } from '../constants/strings';
import type { AppColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { AppButton } from './ui';

type Props = {
  colors: AppColors;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
};

function ErrorBannerComponent({
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
          <AppButton
            colors={colors}
            variant="link"
            title={actionLabel}
            onPress={onAction}
            color={colors.errorText}
          />
        ) : null}
        {onDismiss ? (
          <AppButton
            colors={colors}
            variant="link"
            title={strings.banners.dismiss}
            onPress={onDismiss}
            color={colors.errorText}
          />
        ) : null}
      </View>
    </View>
  );
}

export const ErrorBanner = memo(ErrorBannerComponent);

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
