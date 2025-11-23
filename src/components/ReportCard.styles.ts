// src/components/ReportCard.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  reportCard: {
    backgroundColor: '#f0f8ff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    borderLeftWidth: 5,
    alignItems: 'center',
  },
  reportContent: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  reportInfo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginLeft: 5,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusPendiente: {
    backgroundColor: '#ff6b6b',
  },
  statusRevision: {
    backgroundColor: '#ffa500',
  },
  statusProceso: {
    backgroundColor: '#2196f3',
  },
  statusFinalizado: {
    backgroundColor: '#4caf50',
  },
  statusRechazado: {
    backgroundColor: '#9e9e9e',
  },
  buttonAtender: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  buttonAtenderText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 14,
  },
});
