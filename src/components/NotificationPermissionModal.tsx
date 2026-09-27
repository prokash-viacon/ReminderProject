import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { strings } from '../constants/strings';
import { useNotificationPermissionGate } from '../hooks';
import { typography } from '../theme/typography';

export function NotificationPermissionModal() {
  const { colors, blocked, openSettings } = useNotificationPermissionGate();

  return (
    <Modal
      visible={blocked}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {}}
    >
      <View style={[styles.backdrop, { backgroundColor: colors.overlay }]}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.background, shadowColor: colors.shadow },
          ]}
        >
          <View style={[styles.iconWrap, { backgroundColor: colors.surface }]}>
            <Text style={[typography.fabIcon, styles.icon]}>
              {strings.icons.notificationsOff}
            </Text>
          </View>
          <Text
            style={[
              typography.sectionTitle,
              styles.center,
              { color: colors.text },
            ]}
          >
            {strings.permission.title}
          </Text>
          <Text
            style={[
              typography.body,
              styles.center,
              { color: colors.textSecondary },
            ]}
          >
            {strings.permission.message}
          </Text>
          <Pressable
            onPress={openSettings}
            style={[styles.button, { backgroundColor: colors.primary }]}
          >
            <Text style={[typography.button, { color: colors.primaryContrast }]}>
              {strings.permission.openSettings}
            </Text>
          </Pressable>
          <Text
            style={[
              typography.caption,
              styles.center,
              { color: colors.placeholder },
            ]}
          >
            {strings.permission.hint}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  card: {
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 20,
    alignItems: 'center',
    gap: 14,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  iconWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    lineHeight: 44,
  },
  center: {
    textAlign: 'center',
  },
  button: {
    alignSelf: 'stretch',
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 6,
  },
});
