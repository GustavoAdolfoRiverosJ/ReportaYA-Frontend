// src/components/ReportCard.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './ReportCard.styles';

interface ReportCardProps {
  id: string;
  titulo: string;
  tipo: string;
  estado: string;
  fecha: string;
  ubicacion: string;
}

const ReportCard: React.FC<ReportCardProps> = ({
  titulo,
  tipo,
  estado,
  fecha,
  ubicacion,
}) => {
  const getStatusStyle = (estado: string) => {
    switch (estado) {
      case 'Pendiente': return styles.statusPendiente;
      case 'En proceso': return styles.statusProceso;
      case 'Resuelto': return styles.statusResuelto;
      default: return {};
    }
  };

  const getBorderColor = (estado: string) => {
    switch (estado) {
      case 'Pendiente': return '#ff6b6b';
      case 'En proceso': return '#ffa500';
      case 'Resuelto': return '#4caf50';
      default: return '#ddd';
    }
  };

  return (
    <View style={[styles.reportCard, { borderLeftColor: getBorderColor(estado) }]}>
      <View style={styles.reportContent}>
        <Text style={styles.reportTitle}>{titulo}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.reportInfo}>Estado:</Text>
          <View style={[styles.statusBadge, getStatusStyle(estado)]}>
            <Text style={styles.statusBadgeText}>{estado}</Text>
          </View>
        </View>
        <Text style={styles.reportInfo}>Fecha: {fecha}</Text>
        <Text style={styles.reportInfo}>Ubicación: {ubicacion}</Text>
      </View>
    </View>
  );
};

export default ReportCard;
