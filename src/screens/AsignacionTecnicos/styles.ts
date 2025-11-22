import { StyleSheet } from 'react-native';

export const prioridadStyles = StyleSheet.create({
  prioridadContainer: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  prioridadLabel: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  prioridadButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  prioridadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  dropdownMenu: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    marginTop: 4,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemSelected: {
    backgroundColor: '#a27eff',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  dropdownItemTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
});
