import React, { memo } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import type { AppColors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { fieldStyles } from './fieldStyles';

export type AppTextInputVariant = 'form' | 'search';

type Props = TextInputProps & {
  colors: AppColors;
  label?: string;
  leftIcon?: string;
  rightIcon?: string;
  variant?: AppTextInputVariant;
  containerStyle?: StyleProp<ViewStyle>;
};

function AppTextInputComponent({
  colors,
  label,
  leftIcon,
  rightIcon,
  variant = 'form',
  containerStyle,
  style,
  ...inputProps
}: Props) {
  const isSearch = variant === 'search';
  const textColor = isSearch ? colors.text : colors.inputText;

  return (
    <View style={containerStyle}>
      {label ? (
        <Text
          style={[typography.label, fieldStyles.label, { color: colors.text }]}
        >
          {label}
        </Text>
      ) : null}
      <View
        style={[
          fieldStyles.box,
          isSearch && styles.searchBox,
          {
            backgroundColor: isSearch ? colors.searchBg : colors.inputBg,
            shadowColor: colors.shadow,
          },
        ]}
      >
        {leftIcon ? (
          <Text
            style={[
              isSearch ? typography.searchIcon : typography.iconSmall,
              styles.leftIcon,
              { color: colors.placeholder },
            ]}
          >
            {leftIcon}
          </Text>
        ) : null}
        <TextInput
          placeholderTextColor={colors.placeholder}
          {...inputProps}
          style={[
            isSearch ? typography.searchInput : typography.input,
            fieldStyles.value,
            { color: textColor },
            style,
          ]}
        />
        {rightIcon ? (
          <Text
            style={[
              typography.icon,
              fieldStyles.trailingIcon,
              { color: textColor },
            ]}
          >
            {rightIcon}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export const AppTextInput = memo(AppTextInputComponent);

const styles = StyleSheet.create({
  searchBox: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  leftIcon: {
    marginRight: 8,
  },
});
