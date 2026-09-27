import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { strings } from '../constants/strings';
import type { AppColors } from '../theme/colors';
import { typography } from '../theme/typography';

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
        <Pressable
          onPress={onAction}
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <Text style={[typography.buttonSmall, styles.buttonText]}>
            {actionLabel}
          </Text>
        </Pressable>
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
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
  },
  buttonText: {
    color: '#FFFFFF',
  },
});
