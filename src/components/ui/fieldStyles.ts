import { StyleSheet } from 'react-native';

export const fieldStyles = StyleSheet.create({
  label: {
    marginBottom: 8,
    marginTop: 12,
  },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  value: {
    flex: 1,
    padding: 0,
  },
  trailingIcon: {
    marginLeft: 8,
  },
});
