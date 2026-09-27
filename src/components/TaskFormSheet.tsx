import React from 'react';
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
  TextInput,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { strings } from '../constants/strings';
import { useSheetAnimation, useTaskForm, type TaskFormValues } from '../hooks';
import type { Reminder } from '../types/reminder';
import type { AppColors } from '../theme/colors';
import { typography } from '../theme/typography';

type Props = {
  visible: boolean;
  colors: AppColors;
  isDark: boolean;
  reminder?: Reminder | null;
  onClose: () => void;
  onSave: (values: TaskFormValues) => Promise<void>;
};

const SHEET_HEIGHT = Math.min(Dimensions.get('window').height * 0.88, 640);

export function TaskFormSheet({
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

  const inputTextColor = isDark ? '#1A1814' : colors.text;

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
              <Text
                style={[typography.label, styles.label, { color: colors.text }]}
              >
                {strings.form.titleLabel}
              </Text>
              <TextInput
                value={form.title}
                onChangeText={form.setTitle}
                placeholder={strings.form.titlePlaceholder}
                placeholderTextColor={colors.placeholder}
                style={[
                  typography.input,
                  styles.input,
                  {
                    backgroundColor: colors.inputBg,
                    color: inputTextColor,
                    shadowColor: colors.shadow,
                  },
                ]}
              />

              <Text
                style={[typography.label, styles.label, { color: colors.text }]}
              >
                {strings.form.dateLabel}
              </Text>
              <Pressable
                onPress={() => form.openPicker('date')}
                style={[
                  styles.input,
                  styles.rowInput,
                  {
                    backgroundColor: colors.inputBg,
                    shadowColor: colors.shadow,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.input,
                    styles.fieldValue,
                    {
                      color: form.dateSet ? inputTextColor : colors.placeholder,
                    },
                  ]}
                >
                  {form.dateLabel}
                </Text>
                <Text
                  style={[
                    typography.iconSmall,
                    styles.fieldIcon,
                    { color: inputTextColor },
                  ]}
                >
                  {strings.icons.calendar}
                </Text>
              </Pressable>

              <Text
                style={[typography.label, styles.label, { color: colors.text }]}
              >
                {strings.form.timeLabel}
              </Text>
              <Pressable
                onPress={() => form.openPicker('time')}
                style={[
                  styles.input,
                  styles.rowInput,
                  {
                    backgroundColor: colors.inputBg,
                    shadowColor: colors.shadow,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.input,
                    styles.fieldValue,
                    {
                      color: form.timeSet ? inputTextColor : colors.placeholder,
                    },
                  ]}
                >
                  {form.timeLabel}
                </Text>
                <Text
                  style={[
                    typography.iconSmall,
                    styles.fieldIcon,
                    { color: inputTextColor },
                  ]}
                >
                  {strings.icons.dropdown}
                </Text>
              </Pressable>

              {form.pickerMode &&
              (Platform.OS === 'ios' || Platform.OS === 'android') ? (
                <View style={styles.pickerWrap}>
                  {Platform.OS === 'ios' ? (
                    <Pressable
                      onPress={form.closePicker}
                      style={styles.doneRow}
                    >
                      <Text
                        style={[typography.link, { color: colors.primary }]}
                      >
                        {strings.form.done}
                      </Text>
                    </Pressable>
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
              <Pressable
                onPress={form.handleSave}
                disabled={form.saving}
                style={[
                  styles.actionBtn,
                  { backgroundColor: colors.primary },
                  form.saving && styles.disabled,
                ]}
              >
                <Text style={[typography.button, styles.saveText]}>
                  {form.saving ? strings.form.saving : strings.form.save}
                </Text>
              </Pressable>
              <Pressable
                onPress={form.clearForm}
                style={[
                  styles.actionBtn,
                  styles.clearBtn,
                  { borderColor: colors.primary },
                ]}
              >
                <Text style={[typography.button, { color: colors.primary }]}>
                  {strings.form.clear}
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

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
    gap: 0,
  },
  label: {
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldValue: {
    flex: 1,
  },
  fieldIcon: {
    marginLeft: 8,
  },
  pickerWrap: {
    marginTop: 8,
  },
  doneRow: {
    alignItems: 'flex-end',
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
  actionBtn: {
    flex: 1,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearBtn: {
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
  },
  saveText: {
    color: '#FFFFFF',
  },
  disabled: {
    opacity: 0.65,
  },
});
