import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { strings } from '../constants/strings';
import type { AppColors } from '../theme/colors';
import { typography } from '../theme/typography';

type Props = {
  colors: AppColors;
  visible: boolean;
};

export function PermissionBanner({ colors, visible }: Props) {
  if (!visible) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bannerBg }]}>
      <Text style={[typography.small, { color: colors.bannerText }]}>
        {strings.banners.permissionOff}
      </Text>
      <Pressable
        onPress={() => {
          Linking.openSettings();
        }}
        hitSlop={8}
      >
        <Text style={[typography.smallStrong, { color: colors.bannerText }]}>
          {strings.banners.openSettings}
        </Text>
      </Pressable>
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
});
