// src/screens/Home/HomeScreen.tsx
import React from 'react';
import { View, Text, FlatList, StatusBar, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from '../../styles/HomeScreen.styles';
import ReportCard from '../../components/ReportCard';
import { useHomeController } from './HomeScreen.controller';

const HomeScreen = () => {
  const { reportes, loading, error, cargarReportes } = useHomeController();

  return (
    <LinearGradient colors={['#a27eff', '#6a9fff']} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Mis Reportes</Text>
        </View>

        <View style={styles.card}>
          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#a27eff" />
              <Text style={styles.loadingText}>Cargando reportes...</Text>
            </View>
          ) : error ? (
            <View style={styles.centerContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Text style={styles.retryText} onPress={cargarReportes}>
                Toca para reintentar
              </Text>
            </View>
          ) : reportes.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>No tienes reportes aún</Text>
            </View>
          ) : (
            <FlatList
              data={reportes}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                const ubicacionTexto = item.ubicacion?.direccion 
                  || (item.ubicacion?.latitud && item.ubicacion?.longitud 
                    ? `${item.ubicacion.latitud.toFixed(6)}, ${item.ubicacion.longitud.toFixed(6)}`
                    : 'Sin ubicación');
                
                return (
                  <ReportCard
                    id={item.id.toString()}
                    titulo={item.titulo}
                    tipo={item.prioridad}
                    estado={item.estado}
                    fecha={new Date(item.fechaCreacion).toLocaleDateString('es-PE', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                    ubicacion={ubicacionTexto}
                  />
                );
              }}
              refreshing={loading}
              onRefresh={cargarReportes}
            />
          )}
        </View>
      </View>
    </LinearGradient>
  );
};

export default HomeScreen;
