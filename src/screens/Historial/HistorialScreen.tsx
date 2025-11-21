import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useHistorialController } from './HistorialScreen.controller';
import { HistorialEstado } from '../../types/historial.types';

const HistorialScreen = () => {
  const { historial, loading, error, recargar } = useHistorialController();
  const navigation = useNavigation();

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return '#FFC107';
      case 'REVISION': return '#2196F3';
      case 'PROCESO': return '#9C27B0';
      case 'RESUELTA': return '#4CAF50';
      case 'CERRADA': return '#607D8B';
      case 'RECHAZADO': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const renderItem = ({ item, index }: { item: HistorialEstado, index: number }) => {
    const isLast = index === historial.length - 1;
    const date = new Date(item.fechaCambio);
    
    // Si el estado anterior es null, significa que es la creación del reporte.
    // El usuario pidió "No coloques cambio a pendiente, porque ese es el estado de original de creacion"
    // Podemos mostrar "Reporte Creado" en lugar de "Cambio a PENDIENTE"
    
    const isCreation = item.estadoAnterior === null && item.estadoNuevo === 'PENDIENTE';
    const titleText = isCreation ? 'Reporte Creado' : `Cambio a ${item.estadoNuevo}`;
    const statusColor = getStatusColor(item.estadoNuevo);

    return (
      <View style={styles.timelineItem}>
        <View style={styles.timelineLeft}>
          <View style={[styles.dot, { backgroundColor: statusColor }]} />
          {!isLast && <View style={styles.line} />}
        </View>
        <View style={styles.timelineContent}>
          <Text style={styles.dateText}>
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </Text>
          <Text style={styles.statusTitle}>
            {isCreation ? (
               <Text style={{ color: statusColor, fontWeight: 'bold' }}>Reporte Creado</Text>
            ) : (
               <>Cambio a <Text style={{ color: statusColor, fontWeight: 'bold' }}>{item.estadoNuevo}</Text></>
            )}
          </Text>
          {item.estadoAnterior && (
            <Text style={styles.prevStatusText}>
              Anterior: {item.estadoAnterior}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient colors={['#a27eff', '#6a9fff']} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Historial de Cambios</Text>
        </View>

        <View style={styles.card}>
          {loading && historial.length === 0 ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#a27eff" />
              <Text style={styles.loadingText}>Cargando historial...</Text>
            </View>
          ) : error ? (
            <View style={styles.centerContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={recargar}>
                <Text style={styles.retryText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          ) : historial.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>No hay historial disponible</Text>
            </View>
          ) : (
            <FlatList
              data={historial}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              refreshing={loading}
              onRefresh={recargar}
            />
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorText: {
    color: '#ff6b6b',
    marginBottom: 10,
  },
  retryText: {
    color: '#a27eff',
    textDecorationLine: 'underline',
  },
  emptyText: {
    color: '#999',
  },
  listContent: {
    paddingVertical: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 15,
    width: 20,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    zIndex: 1,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#e0e0e0',
    marginTop: -2,
    marginBottom: -10,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 5,
  },
  statusTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  prevStatusText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default HistorialScreen;
