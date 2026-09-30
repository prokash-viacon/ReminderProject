import React, { memo } from 'react';
import { Pressable, Text } from 'react-native';
import type { AppColors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { fieldStyles } from './fieldStyles';

type Props = {
  colors: AppColors;
  label?: string;
  value: string;
  /** Renders `value` in the placeholder color while nothing is chosen yet. */
  isPlaceholder?: boolean;
  icon?: string;
  onPress: () => void;
};

function PickerFieldComponent({
  colors,
  label,
  value,
  isPlaceholder = false,
  icon,
  onPress,
}: Props) {
  return (
    <>
      {label ? (
        <Text
          style={[typography.label, fieldStyles.label, { color: colors.text }]}
        >
          {label}
        </Text>
      ) : null}
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label ? `${label}: ${value}` : value}
        style={[
          fieldStyles.box,
          { backgroundColor: colors.inputBg, shadowColor: colors.shadow },
        ]}
      >
        <Text
          style={[
            typography.input,
            fieldStyles.value,
            { color: isPlaceholder ? colors.placeholder : colors.inputText },
          ]}
        >
          {value}
        </Text>
        {icon ? (
          <Text
            style={[
              typography.iconSmall,
              fieldStyles.trailingIcon,
              { color: colors.inputText },
            ]}
          >
            {icon}
          </Text>
        ) : null}
      </Pressable>
    </>
  );
}

export const PickerField = memo(PickerFieldComponent);
