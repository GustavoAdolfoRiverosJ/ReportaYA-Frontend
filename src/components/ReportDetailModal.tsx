// src/components/ReportDetailModal.tsx
import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { styles } from './ReportDetailModal.styles';
import { ReporteResponse } from '../types';
import SelectorTecnico from './SelectorTecnico';

interface ReportDetailModalProps {
  visible: boolean;
  reporte: ReporteResponse | null;
  onClose: () => void;
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ visible, reporte, onClose }) => {
  const navigation = useNavigation();
  const [mostrarTecnicos, setMostrarTecnicos] = useState(false);
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState<string>('');

  if (!reporte) return null;

  const handleVerHistorial = () => {
    onClose();
    (navigation as any).navigate('Historial', { reporteId: reporte.id });
  };

  const handleVerTecnicosDisponibles = () => {
    setMostrarTecnicos(true);
  };

  const handleTecnicoSeleccionado = (tecnicoId: string) => {
    setTecnicoSeleccionado(tecnicoId);
    // Aquí puedes agregar lógica para reasignar el técnico si es necesario
    console.log('Técnico seleccionado:', tecnicoId);
  };

  const getStatusStyle = (estado: string) => {
    switch (estado.toUpperCase()) {
      case 'PENDIENTE': return styles.statusPendiente;
      case 'REVISION': return styles.statusRevision;
      case 'PROCESO': return styles.statusProceso;
      case 'FINALIZADO': return styles.statusFinalizado;
      case 'RECHAZADO': return styles.statusRechazado;
      default: return styles.statusPendiente;
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado.toUpperCase()) {
      case 'PENDIENTE': return 'Pendiente';
      case 'REVISION': return 'En Revisión';
      case 'PROCESO': return 'En Proceso';
      case 'FINALIZADO': return 'Finalizado';
      case 'RECHAZADO': return 'Rechazado';
      default: return estado;
    }
  };

  const getPrioridadTexto = (prioridad: string) => {
    switch (prioridad.toUpperCase()) {
      case 'BAJA': return 'Baja';
      case 'MEDIA': return 'Media';
      case 'ALTA': return 'Alta';
      default: return prioridad;
    }
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad.toUpperCase()) {
      case 'BAJA': return '#4caf50';
      case 'MEDIA': return '#ffa500';
      case 'ALTA': return '#ff6b6b';
      default: return '#9e9e9e';
    }
  };

  const ubicacionTexto = reporte.ubicacion?.direccion 
    || (reporte.ubicacion?.latitud && reporte.ubicacion?.longitud 
      ? `${reporte.ubicacion.latitud.toFixed(6)}, ${reporte.ubicacion.longitud.toFixed(6)}`
      : 'Sin ubicación');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Detalles del Reporte</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información General</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Título:</Text>
                <Text style={styles.detailValue}>{reporte.titulo}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Estado:</Text>
                <View style={[styles.statusBadge, getStatusStyle(reporte.estado)]}>
                  <Text style={styles.statusBadgeText}>{getEstadoTexto(reporte.estado)}</Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Prioridad:</Text>
                <View style={[styles.priorityBadge, { backgroundColor: getPrioridadColor(reporte.prioridad) }]}>
                  <Text style={styles.priorityBadgeText}>{getPrioridadTexto(reporte.prioridad)}</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Descripción</Text>
              <Text style={styles.descriptionText}>{reporte.descripcion}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ubicación</Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={20} color="#a27eff" />
                <Text style={styles.locationText}>{ubicacionTexto}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ciudadano</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Nombre:</Text>
                <Text style={styles.detailValue}>{reporte.nombreCiudadano}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={{
                backgroundColor: '#a27eff',
                padding: 12,
                borderRadius: 8,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
                marginBottom: 10
              }}
              onPress={handleVerHistorial}
            >
              <Ionicons name="time-outline" size={20} color="white" style={{ marginRight: 8 }} />
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Ver Historial de Cambios</Text>
            </TouchableOpacity>

            {reporte.estado === 'PROCESO' && (
              <TouchableOpacity 
                style={{
                  backgroundColor: '#4caf50',
                  padding: 12,
                  borderRadius: 8,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 10
                }}
                onPress={handleVerTecnicosDisponibles}
              >
                <Ionicons name="person" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Ver Técnicos Disponibles</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          <TouchableOpacity style={styles.closeButtonBottom} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de Técnicos Disponibles */}
      <Modal
        visible={mostrarTecnicos}
        transparent
        animationType="slide"
        onRequestClose={() => setMostrarTecnicos(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { height: '80%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Técnicos Disponibles</Text>
              <TouchableOpacity 
                onPress={() => setMostrarTecnicos(false)} 
                style={styles.closeButton}
              >
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <SelectorTecnico
                tecnicoSeleccionado={tecnicoSeleccionado}
                onTecnicoSeleccionado={handleTecnicoSeleccionado}
              />
            </ScrollView>

            <TouchableOpacity 
              style={styles.closeButtonBottom}
              onPress={() => setMostrarTecnicos(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

export default ReportDetailModal;
