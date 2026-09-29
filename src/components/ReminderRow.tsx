import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { strings } from '../constants/strings';
import type { Reminder } from '../types/reminder';
import type { AppColors } from '../theme/colors';
import { typography } from '../theme/typography';

const ACTION_WIDTH = 84;
const OPEN_THRESHOLD = 44;

type Props = {
  reminder: Reminder;
  colors: AppColors;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
};

function formatDue(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  const weekday = date.toLocaleDateString(undefined, { weekday: 'short' });
  const day = date.getDate();
  const time = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${weekday}, ${day} ${time}`;
}

export function ReminderRow({
  reminder,
  colors,
  onEdit,
  onDelete,
  onToggleComplete,
}: Props) {
  const translateX = useRef(new Animated.Value(0)).current;
  const openOffset = useRef(0);

  const close = () => {
    openOffset.current = 0;
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  };

  const pan = Gesture.Pan()
    .runOnJS(true)
    .activeOffsetX([-12, 12])
    .failOffsetY([-10, 10])
    .onUpdate(event => {
      const next = Math.min(
        ACTION_WIDTH,
        Math.max(-ACTION_WIDTH, openOffset.current + event.translationX),
      );
      translateX.setValue(next);
    })
    .onEnd(event => {
      const current = openOffset.current + event.translationX;
      let toValue = 0;
      if (current < -OPEN_THRESHOLD || event.velocityX < -500) {
        toValue = -ACTION_WIDTH;
      } else if (current > OPEN_THRESHOLD || event.velocityX > 500) {
        toValue = ACTION_WIDTH;
      }
      openOffset.current = toValue;
      Animated.spring(translateX, {
        toValue,
        useNativeDriver: true,
        bounciness: 0,
      }).start();
    });

  const handleCardPress = () => {
    if (openOffset.current !== 0) {
      close();
      return;
    }
    onEdit();
  };

  const completeOpacity = translateX.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const deleteOpacity = translateX.interpolate({
    inputRange: [-1, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.wrapper}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.actionLayer,
          styles.completeLayer,
          { backgroundColor: colors.success, opacity: completeOpacity },
        ]}
      >
        <Pressable
          style={styles.action}
          onPress={() => {
            close();
            onToggleComplete();
          }}
        >
          <Text style={[typography.swipeAction, styles.actionText]}>
            {reminder.completed ? strings.row.undo : strings.row.done}
          </Text>
        </Pressable>
      </Animated.View>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.actionLayer,
          styles.deleteLayer,
          { backgroundColor: colors.danger, opacity: deleteOpacity },
        ]}
      >
        <Pressable
          style={styles.action}
          onPress={() => {
            close();
            onDelete();
          }}
        >
          <Text style={[typography.swipeAction, styles.actionText]}>
            {strings.row.delete}
          </Text>
        </Pressable>
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              shadowColor: colors.shadow,
              transform: [{ translateX }],
              opacity: reminder.completed ? 0.72 : 1,
            },
          ]}
        >
          <Pressable
            onPress={handleCardPress}
            style={styles.cardPress}
            accessibilityRole="button"
          >
            <Text
              style={[
                typography.cardTitle,
                {
                  color: colors.text,
                  textDecorationLine: reminder.completed
                    ? 'line-through'
                    : 'none',
                },
              ]}
              numberOfLines={2}
            >
              {reminder.title}
            </Text>
            <Text style={[typography.caption, { color: colors.textSecondary }]}>
              <Text style={typography.captionStrong}>
                {strings.row.duePrefix}
              </Text>
              {formatDue(reminder.datetime)}
              {reminder.completed ? strings.row.completedSuffix : ''}
            </Text>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginBottom: 14,
    borderRadius: 18,
    overflow: 'hidden',
  },
  actionLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  completeLayer: {
    justifyContent: 'flex-start',
  },
  deleteLayer: {
    justifyContent: 'flex-end',
  },
  action: {
    width: ACTION_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#FFFFFF',
  },
  card: {
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPress: {
    gap: 8,
  },
});
