// src/components/TecnicoCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './TecnicoCard.styles';

interface TecnicoCardProps {
  id: string;
  nombre: string;
  especialidad: string;
  onAsignar: () => void;
  asignando: boolean;
}

const TecnicoCard: React.FC<TecnicoCardProps> = ({
  nombre,
  especialidad,
  onAsignar,
  asignando,
}) => {
  return (
    <View style={styles.tecnicoCard}>
      <View style={styles.tecnicoContent}>
        <View style={styles.tecnicoHeader}>
          <Ionicons name="person-circle-outline" size={40} color="#2196f3" />
          <View style={styles.tecnicoInfo}>
            <Text style={styles.tecnicoNombre}>{nombre}</Text>
            <Text style={styles.tecnicoEspecialidad}>{especialidad}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.assignButton, asignando && styles.assignButtonDisabled]}
        onPress={onAsignar}
        disabled={asignando}
      >
        {asignando ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <>
            <Ionicons name="checkmark-circle-outline" size={16} color="white" />
            <Text style={styles.assignButtonText}>Asignar</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TecnicoCard;