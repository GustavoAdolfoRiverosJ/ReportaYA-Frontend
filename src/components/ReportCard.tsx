// src/components/ReportCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './ReportCard.styles';

interface ReportCardProps {
  id: string;
  titulo: string;
  tipo: string;
  estado: string;
  fecha: string;
  ubicacion: string;
  onPress?: () => void;
  onAtender?: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
  titulo,
  tipo,
  estado,
  fecha,
  ubicacion,
  onPress,
  onAtender,
}) => {
  const getStatusStyle = (estado: string) => {
    switch (estado.toUpperCase()) {
      case 'PENDIENTE': return styles.statusPendiente;
      case 'REVISION': return styles.statusRevision;
      case 'PROCESO': return styles.statusProceso;
      case 'FINALIZADO': return styles.statusFinalizado;
      case 'RECHAZADO': return styles.statusRechazado;
      case 'RESUELTA': return styles.statusFinalizado;
      case 'RECHAZADO_AUDITO': return styles.statusRechazado;
      default: return styles.statusPendiente;
    }
  };

  const getBorderColor = (estado: string) => {
    switch (estado.toUpperCase()) {
      case 'PENDIENTE': return '#ff6b6b';
      case 'REVISION': return '#ffa500';
      case 'PROCESO': return '#2196f3';
      case 'FINALIZADO': return '#4caf50';
      case 'RESUELTA': return '#4caf50';
      case 'RECHAZADO': return '#9e9e9e';
      case 'RECHAZADO_AUDITO': return '#d32f2f';
      default: return '#ddd';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado.toUpperCase()) {
      case 'PENDIENTE': return 'Pendiente';
      case 'REVISION': return 'En Revisión';
      case 'PROCESO': return 'En Proceso';
      case 'FINALIZADO': return 'Finalizado';
      case 'RESUELTA': return 'Resuelta';
      case 'RECHAZADO': return 'Rechazado';
      case 'RECHAZADO_AUDITO': return 'Rechazado Auditoría';
      default: return estado;
    }
  };

  // Mostrar botón "Atender" solo para PROCESO y RECHAZADO_AUDITO
  const mostrarBotonAtender = ['PROCESO', 'RECHAZADO_AUDITO'].includes(estado.toUpperCase());

  const CardContent = (
    <View style={[styles.reportCard, { borderLeftColor: getBorderColor(estado) }]}>
      <View style={styles.reportContent}>
        <Text style={styles.reportTitle}>{titulo}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.reportInfo}>Estado:</Text>
          <View style={[styles.statusBadge, getStatusStyle(estado)]}>
            <Text style={styles.statusBadgeText}>{getEstadoTexto(estado)}</Text>
          </View>
        </View>
        <Text style={styles.reportInfo}>Fecha: {fecha}</Text>
        <Text style={styles.reportInfo}>Ubicación: {ubicacion}</Text>
      </View>
      {mostrarBotonAtender && onAtender && (
        <TouchableOpacity style={styles.buttonAtender} onPress={onAtender}>
          <Ionicons name="checkmark-circle-outline" size={20} color="white" />
          <Text style={styles.buttonAtenderText}>Atender</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return CardContent;
};

export default ReportCard;
