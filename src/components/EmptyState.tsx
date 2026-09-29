import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { strings } from '../constants/strings';
import type { AppColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { AppButton } from './ui';

type Props = {
  colors: AppColors;
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  colors,
  title = strings.emptyState.title,
  subtitle = strings.emptyState.subtitle,
  actionLabel = strings.emptyState.action,
  onAction,
}: Props) {
  return (
    <View style={styles.container}>
      <Text
        style={[
          typography.sectionTitle,
          styles.centered,
          { color: colors.text },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          typography.body,
          styles.centered,
          { color: colors.textSecondary },
        ]}
      >
        {subtitle}
      </Text>
      {onAction ? (
        <AppButton
          colors={colors}
          size="sm"
          title={actionLabel}
          onPress={onAction}
          style={styles.button}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 10,
  },
  centered: {
    textAlign: 'center',
  },
  button: {
    marginTop: 12,
  },
});
