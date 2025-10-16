// src/components/TecnicoCard.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  tecnicoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  tecnicoContent: {
    flex: 1,
  },
  tecnicoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tecnicoInfo: {
    marginLeft: 12,
    flex: 1,
  },
  tecnicoNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 2,
  },
  tecnicoEspecialidad: {
    fontSize: 14,
    color: '#6c757d',
  },
  assignButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
  },
  assignButtonDisabled: {
    backgroundColor: '#6c757d',
    opacity: 0.6,
  },
  assignButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
});