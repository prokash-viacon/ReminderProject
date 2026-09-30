import React, { memo } from 'react';
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

function LoadingStateComponent({
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

export const LoadingState = memo(LoadingStateComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
});
