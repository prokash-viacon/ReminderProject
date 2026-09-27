/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('react-native-gesture-handler', () => {
  const ReactNative = require('react-native');
  return {
    GestureHandlerRootView: ({ children }: { children: React.ReactNode }) =>
      children,
    GestureDetector: ({ children }: { children: React.ReactNode }) => children,
    Gesture: {
      Pan: () => ({
        activeOffsetX: () => ({
          failOffsetY: () => ({
            onUpdate: () => ({
              onEnd: () => ({}),
            }),
          }),
        }),
      }),
    },
    RectButton: ReactNative.Pressable,
    Swipeable: ReactNative.View,
  };
});

jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    requestPermission: jest.fn(async () => ({ authorizationStatus: 1 })),
    getNotificationSettings: jest.fn(async () => ({ authorizationStatus: 1 })),
    createChannel: jest.fn(async () => 'reminders'),
    createTriggerNotification: jest.fn(async () => 'id'),
    cancelTriggerNotification: jest.fn(async () => undefined),
    cancelNotification: jest.fn(async () => undefined),
    getTriggerNotificationIds: jest.fn(async () => []),
    onForegroundEvent: jest.fn(() => jest.fn()),
    onBackgroundEvent: jest.fn(),
    getInitialNotification: jest.fn(async () => null),
    openNotificationSettings: jest.fn(async () => undefined),
  },
  AndroidImportance: { HIGH: 4 },
  AuthorizationStatus: {
    AUTHORIZED: 1,
    DENIED: 0,
    NOT_DETERMINED: -1,
    PROVISIONAL: 2,
  },
  EventType: { PRESS: 1 },
  TriggerType: { TIMESTAMP: 0 },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);

import notifee from '@notifee/react-native';
import App from '../App';
import { strings } from '../src/constants/strings';

function hasText(root: ReactTestRenderer.ReactTestInstance, text: string) {
  return root.findAll(node => node.props.children === text).length > 0;
}

test('renders correctly', async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  expect(hasText(renderer.root, strings.permission.title)).toBe(false);
});

test('blocks the app when notification permission is denied', async () => {
  (notifee.requestPermission as jest.Mock).mockResolvedValueOnce({
    authorizationStatus: 0,
  });
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  expect(hasText(renderer.root, strings.permission.title)).toBe(true);
});
