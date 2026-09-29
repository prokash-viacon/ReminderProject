import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  type Insets,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import type { AppColors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export type AppButtonVariant = 'primary' | 'outline' | 'link';
export type AppButtonSize = 'md' | 'sm';

type Props = {
  colors: AppColors;
  title: string;
  onPress: () => void;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  disabled?: boolean;
  /** Overrides the label color; mainly for `link` buttons on tinted backgrounds. */
  color?: string;
  style?: StyleProp<ViewStyle>;
  hitSlop?: number | Insets;
  accessibilityLabel?: string;
};

export function AppButton({
  colors,
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  color,
  style,
  hitSlop,
  accessibilityLabel,
}: Props) {
  const isLink = variant === 'link';

  const containerStyle: StyleProp<ViewStyle> = [
    !isLink && styles.base,
    !isLink && (size === 'sm' ? styles.sm : styles.md),
    variant === 'primary' && { backgroundColor: colors.primary },
    variant === 'outline' && [styles.outline, { borderColor: colors.primary }],
  ];

  const labelColor =
    color ?? (variant === 'primary' ? colors.primaryContrast : colors.primary);

  let labelTypography = size === 'sm' ? typography.buttonSmall : typography.button;
  if (isLink) {
    labelTypography = typography.link;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop ?? (isLink ? 8 : undefined)}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        containerStyle,
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[labelTypography, { color: labelColor }]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  md: {
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  sm: {
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  outline: {
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.65,
  },
});
