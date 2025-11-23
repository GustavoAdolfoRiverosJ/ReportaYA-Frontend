// src/components/ReportCardOperador.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './ReportCardOperador.styles';

interface ReportCardOperadorProps {
  id: string;
  titulo: string;
  tipo: string;
  estado: string;
  fecha: string;
  ubicacion: string;
  onCambiarEstado: () => void;
  onAsignarTecnico: () => void;
  onAuditar?: () => void;
  onRechazar?: () => void;
}

const ReportCardOperador: React.FC<ReportCardOperadorProps> = ({
  titulo,
  tipo,
  estado,
  fecha,
  ubicacion,
  onCambiarEstado,
  onAsignarTecnico,
  onAuditar,
  onRechazar,
}) => {
  const getStatusStyle = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return styles.statusPendiente;
      case 'REVISION': return styles.statusRevision;
      case 'PROCESO': return styles.statusProceso;
      case 'RESUELTA': return styles.statusFinalizado; // Reusing Finalizado style
      case 'CERRADA': return styles.statusFinalizado;
      case 'RECHAZADO': return styles.statusRechazado;
      default: return {};
    }
  };

  const getBorderColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return '#ff6b6b';
      case 'REVISION': return '#ffa500';
      case 'PROCESO': return '#2196f3';
      case 'RESUELTA': return '#4caf50';
      case 'CERRADA': return '#4caf50';
      case 'RECHAZADO': return '#f44336';
      default: return '#ddd';
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return 'Pendiente';
      case 'REVISION': return 'En Revisión';
      case 'PROCESO': return 'En Proceso';
      case 'RESUELTA': return 'Resuelta';
      case 'CERRADA': return 'Cerrada';
      case 'RECHAZADO': return 'Rechazado';
      default: return estado;
    }
  };

  return (
    <View style={[styles.reportCard, { borderLeftColor: getBorderColor(estado) }]}>
      <View style={styles.reportContent}>
        <Text style={styles.reportTitle}>{titulo}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.reportInfo}>Estado:</Text>
          <View style={[styles.statusBadge, getStatusStyle(estado)]}>
            <Text style={styles.statusBadgeText}>{getStatusText(estado)}</Text>
          </View>
        </View>
        <Text style={styles.reportInfo}>Prioridad: {tipo}</Text>
        <Text style={styles.reportInfo}>Fecha: {fecha}</Text>
        <Text style={styles.reportInfo}>Ubicación: {ubicacion}</Text>
      </View>

      <View style={styles.actionsContainer}>
        {estado === 'PENDIENTE' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.revisionButton]}
              onPress={onCambiarEstado}
            >
              <Ionicons name="eye-outline" size={16} color="white" />
              <Text style={styles.actionButtonText}>Revisar</Text>
            </TouchableOpacity>
            {onRechazar && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#f44336', marginLeft: 8 }]}
                onPress={onRechazar}
              >
                <Ionicons name="close-circle-outline" size={16} color="white" />
                <Text style={styles.actionButtonText}>Rechazar</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {estado === 'REVISION' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.assignButton]}
              onPress={onAsignarTecnico}
            >
              <Ionicons name="person-add-outline" size={16} color="white" />
              <Text style={styles.actionButtonText}>Asignar</Text>
            </TouchableOpacity>
            {onRechazar && (
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#f44336', marginLeft: 8 }]}
                onPress={onRechazar}
              >
                <Ionicons name="close-circle-outline" size={16} color="white" />
                <Text style={styles.actionButtonText}>Rechazar</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {estado === 'RESUELTA' && onAuditar && (
          <TouchableOpacity
            style={[
              styles.actionButton, 
              { 
                backgroundColor: '#FF9800',
              }
            ]}
            onPress={onAuditar}
          >
            <Ionicons name="checkmark-done-circle-outline" size={16} color="white" />
            <Text style={styles.actionButtonText}>Auditar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ReportCardOperador;