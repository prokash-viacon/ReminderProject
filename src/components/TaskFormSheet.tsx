import React, { memo } from 'react';
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { strings } from '../constants/strings';
import { useSheetAnimation, useTaskForm, type TaskFormValues } from '../hooks';
import type { Reminder } from '../types/reminder';
import type { AppColors } from '../theme/colors';
import { typography } from '../theme/typography';
import { AppButton, AppTextInput, PickerField } from './ui';

type Props = {
  visible: boolean;
  colors: AppColors;
  isDark: boolean;
  reminder?: Reminder | null;
  onClose: () => void;
  onSave: (values: TaskFormValues) => Promise<void>;
};

const SHEET_HEIGHT = Math.min(Dimensions.get('window').height * 0.88, 640);

function TaskFormSheetComponent({
  visible,
  colors,
  isDark,
  reminder,
  onClose,
  onSave,
}: Props) {
  const insets = useSafeAreaInsets();
  const sheet = useSheetAnimation(visible, SHEET_HEIGHT, onClose);
  const form = useTaskForm({
    visible,
    reminder,
    onSave,
    onSaved: sheet.close,
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={sheet.close}
      statusBarTranslucent
    >
      <View style={styles.modalRoot}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              backgroundColor: colors.overlay,
              opacity: sheet.backdrop,
            },
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={sheet.close} />
        </Animated.View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}
        >
          <Animated.View
            style={[
              styles.sheet,
              {
                backgroundColor: colors.background,
                paddingBottom: Math.max(insets.bottom, 16),
                height: SHEET_HEIGHT,
                transform: [{ translateY: sheet.translateY }],
              },
            ]}
          >
            <View style={styles.handleWrap}>
              <View
                style={[styles.handle, { backgroundColor: colors.placeholder }]}
              />
            </View>
            <Text
              style={[
                typography.sheetTitle,
                styles.sheetTitle,
                { color: colors.text },
              ]}
            >
              {form.isEdit ? strings.form.editTitle : strings.form.newTitle}
            </Text>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.formContent}
            >
              <AppTextInput
                colors={colors}
                label={strings.form.titleLabel}
                value={form.title}
                onChangeText={form.setTitle}
                placeholder={strings.form.titlePlaceholder}
              />

              <PickerField
                colors={colors}
                label={strings.form.dateLabel}
                value={form.dateLabel}
                isPlaceholder={!form.dateSet}
                icon={strings.icons.calendar}
                onPress={form.openDatePicker}
              />

              <PickerField
                colors={colors}
                label={strings.form.timeLabel}
                value={form.timeLabel}
                isPlaceholder={!form.timeSet}
                icon={strings.icons.dropdown}
                onPress={form.openTimePicker}
              />

              {form.pickerMode &&
              (Platform.OS === 'ios' || Platform.OS === 'android') ? (
                <View style={styles.pickerWrap}>
                  {Platform.OS === 'ios' ? (
                    <AppButton
                      colors={colors}
                      variant="link"
                      title={strings.form.done}
                      onPress={form.closePicker}
                      style={styles.doneButton}
                    />
                  ) : null}
                  <DateTimePicker
                    value={form.datetime}
                    mode={form.pickerMode}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={form.onPickerChange}
                    minimumDate={
                      form.pickerMode === 'date' ? new Date() : undefined
                    }
                    themeVariant={isDark ? 'dark' : 'light'}
                  />
                </View>
              ) : null}

              {form.validationError ? (
                <Text
                  style={[
                    typography.smallStrong,
                    styles.error,
                    { color: colors.danger },
                  ]}
                >
                  {form.validationError}
                </Text>
              ) : null}
            </ScrollView>

            <View style={styles.actions}>
              <AppButton
                colors={colors}
                title={form.saving ? strings.form.saving : strings.form.save}
                onPress={form.handleSave}
                disabled={form.saving}
                style={styles.actionButton}
              />
              <AppButton
                colors={colors}
                variant="outline"
                title={strings.form.clear}
                onPress={form.clearForm}
                style={styles.actionButton}
              />
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

export const TaskFormSheet = memo(TaskFormSheetComponent);

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  keyboardAvoid: {
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 8,
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    opacity: 0.5,
  },
  sheetTitle: {
    textAlign: 'center',
    marginBottom: 18,
  },
  formContent: {
    paddingBottom: 12,
  },
  pickerWrap: {
    marginTop: 8,
  },
  doneButton: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
  },
  error: {
    marginTop: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 8,
  },
  actionButton: {
    flex: 1,
  },
});
