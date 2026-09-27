import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export function useSheetAnimation(
  visible: boolean,
  height: number,
  onClosed: () => void,
) {
  const translateY = useRef(new Animated.Value(height)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 18,
          stiffness: 160,
        }),
      ]).start();
    } else {
      translateY.setValue(height);
      backdrop.setValue(0);
    }
  }, [visible, height, backdrop, translateY]);

  const close = () => {
    Animated.parallel([
      Animated.timing(backdrop, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: height,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        onClosed();
      }
    });
  };

  return { translateY, backdrop, close };
}
