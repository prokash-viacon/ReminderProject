import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { strings } from '../constants/strings';
import type { AppColors } from '../theme/colors';
import { typography } from '../theme/typography';

type Props = {
  colors: AppColors;
  message?: string;
  style?: ViewStyle;
};

export function LoadingState({
  colors,
  message = strings.loading.reminders,
  style,
}: Props) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[typography.body, { color: colors.textSecondary }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
});
