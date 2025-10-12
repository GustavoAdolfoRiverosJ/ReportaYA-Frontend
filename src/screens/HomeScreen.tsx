// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, FlatList, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from '../styles/HomeScreen.styles';

const mockReports = [
  { id: '1', titulo: 'Bache en Av. Principal', tipo: 'infraestructura', estado: 'Pendiente', fecha: '28 jun 2025', ubicacion: 'Av. Principal 123' },
  { id: '2', titulo: 'Poste en mal estado', tipo: 'infraestructura', estado: 'Resuelto', fecha: '02 mayo 2025', ubicacion: 'Av. Republica 234' },
  { id: '3', titulo: 'Basura en Parque Kennedy', tipo: 'residuos', estado: 'En proceso', fecha: '15 jul 2025', ubicacion: 'Parque Kennedy' },
  { id: '4', titulo: 'Semáforo malogrado', tipo: 'otros', estado: 'Pendiente', fecha: '01 ago 2025', ubicacion: 'Cruce de Av. Arequipa' },
];

const HomeScreen = () => {
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
    <LinearGradient colors={['#a27eff', '#6a9fff']} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Mis Reportes</Text>
        </View>

        <View style={styles.card}>
          <FlatList
            data={mockReports}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.reportCard, { borderLeftColor: getBorderColor(item.estado) }]}>
                <View style={styles.reportContent}>
                  <Text style={styles.reportTitle}>{item.titulo}</Text>
                  <View style={styles.statusContainer}>
                    <Text style={styles.reportInfo}>Estado:</Text>
                    <View style={[styles.statusBadge, getStatusStyle(item.estado)]}>
                      <Text style={styles.statusBadgeText}>{item.estado}</Text>
                    </View>
                  </View>
                  <Text style={styles.reportInfo}>Fecha: {item.fecha}</Text>
                  <Text style={styles.reportInfo}>Ubicación: {item.ubicacion}</Text>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

export default HomeScreen;
