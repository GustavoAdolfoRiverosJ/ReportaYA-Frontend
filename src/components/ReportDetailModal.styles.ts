// src/components/ReportDetailModal.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    padding: 20,
    maxHeight: 500,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a27eff',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
    marginRight: 8,
    minWidth: 100,
  },
  detailValue: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  descriptionText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    textAlign: 'justify',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
  priorityBadge: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  priorityBadgeText: {
    color: 'white',
    fontSize: 13,
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
  closeButtonBottom: {
    backgroundColor: '#a27eff',
    padding: 15,
    margin: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
