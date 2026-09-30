import React, { memo, useCallback, useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { strings } from '../constants/strings';
import { EmptyState } from '../components/EmptyState';
import { ErrorBanner } from '../components/ErrorBanner';
import { LoadingState } from '../components/LoadingState';
import { ReminderRow } from '../components/ReminderRow';
import { TaskFormSheet } from '../components/TaskFormSheet';
import { AppTextInput } from '../components/ui';
import { useReminderList } from '../hooks';
import { typography } from '../theme/typography';
import type { Reminder } from '../types/reminder';

const keyExtractor = (item: Reminder) => item.id;

function ReminderListScreenComponent() {
  const insets = useSafeAreaInsets();
  const {
    isDark,
    colors,
    loading,
    error,
    reload,
    scheduleErrorMessage,
    clearScheduleError,
    query,
    setQuery,
    isSearching,
    filteredReminders,
    removeReminder,
    toggleComplete,
    sheetVisible,
    editing,
    openCreate,
    openEdit,
    closeSheet,
    saveTask,
  } = useReminderList();

  const renderItem = useCallback<ListRenderItem<Reminder>>(
    ({ item }) => (
      <ReminderRow
        reminder={item}
        colors={colors}
        onEdit={openEdit}
        onDelete={removeReminder}
        onToggleComplete={toggleComplete}
      />
    ),
    [colors, openEdit, removeReminder, toggleComplete],
  );

  const listContentStyle = useMemo(
    () => [styles.listContent, { paddingBottom: insets.bottom + 100 }],
    [insets.bottom],
  );

  if (loading) {
    return (
      <View
        style={[
          styles.flex,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top,
          },
        ]}
      >
        <LoadingState colors={colors} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.flex,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      <View style={styles.header}>
        <Text style={[typography.screenTitle, { color: colors.text }]}>
          {strings.list.title}
        </Text>
      </View>

      <AppTextInput
        colors={colors}
        variant="search"
        leftIcon={strings.icons.search}
        value={query}
        onChangeText={setQuery}
        placeholder={strings.list.searchPlaceholder}
        containerStyle={styles.searchBar}
      />

      {error ? (
        <ErrorBanner
          colors={colors}
          message={error}
          actionLabel={strings.banners.retry}
          onAction={reload}
        />
      ) : null}
      {scheduleErrorMessage ? (
        <ErrorBanner
          colors={colors}
          message={scheduleErrorMessage}
          onDismiss={clearScheduleError}
        />
      ) : null}

      {filteredReminders.length === 0 ? (
        <EmptyState
          colors={colors}
          title={
            isSearching ? strings.list.noMatchTitle : strings.list.emptyTitle
          }
          subtitle={
            isSearching
              ? strings.list.noMatchSubtitle
              : strings.list.emptySubtitle
          }
          actionLabel={strings.list.createTask}
          onAction={isSearching ? undefined : openCreate}
        />
      ) : (
        <FlatList
          data={filteredReminders}
          keyExtractor={keyExtractor}
          contentContainerStyle={listContentStyle}
          renderItem={renderItem}
        />
      )}

      <Pressable
        onPress={openCreate}
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            bottom: insets.bottom + 24,
            shadowColor: colors.shadow,
          },
        ]}
        accessibilityLabel={strings.list.createTask}
      >
        <Text
          style={[
            typography.fabIcon,
            styles.fabPlus,
            { color: colors.fabIcon },
          ]}
        >
          {strings.icons.add}
        </Text>
      </Pressable>

      <TaskFormSheet
        visible={sheetVisible}
        colors={colors}
        isDark={isDark}
        reminder={editing}
        onClose={closeSheet}
        onSave={saveTask}
      />
    </View>
  );
}

export const ReminderListScreen = memo(ReminderListScreenComponent);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchBar: {
    marginHorizontal: 20,
    marginBottom: 14,
  },
  listContent: {
    paddingTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 22,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  fabPlus: {
    marginTop: -2,
  },
});
