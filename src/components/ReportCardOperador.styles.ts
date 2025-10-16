// src/components/ReportCardOperador.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  reportCard: {
    backgroundColor: '#f0f8ff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    borderLeftWidth: 5,
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
    marginBottom: 4,
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
    backgroundColor: '#f44336',
  },
  actionsContainer: {
    justifyContent: 'space-around',
    paddingLeft: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    minWidth: 80,
  },
  revisionButton: {
    backgroundColor: '#ffa500',
  },
  assignButton: {
    backgroundColor: '#2196f3',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});