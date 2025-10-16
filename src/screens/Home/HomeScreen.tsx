// src/screens/Home/HomeScreen.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, StatusBar, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../../styles/HomeScreen.styles';
import ReportCard from '../../components/ReportCard';
import ReportDetailModal from '../../components/ReportDetailModal';
import { useHomeController } from './HomeScreen.controller';
import { useAuth } from '../../context/AuthContext';
import { ReporteResponse } from '../../types';

const HomeScreen = () => {
  const { reportes, loading, error, currentPage, totalPages, cargarReportes, nextPage, prevPage } = useHomeController();
  const { usuario, logout } = useAuth();
  const [selectedReporte, setSelectedReporte] = useState<ReporteResponse | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleReportPress = (reporte: ReporteResponse) => {
    setSelectedReporte(reporte);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedReporte(null);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // La navegación se manejará automáticamente por el estado de autenticación
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
            }
          }
        }
      ]
    );
  };

  return (
    <LinearGradient colors={['#a27eff', '#6a9fff']} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerText}>Mis Reportes</Text>
            {usuario && (
              <Text style={styles.userName}>
              Hola, {usuario.nombre}
              {usuario.tipoCuenta && ` (${usuario.tipoCuenta})`}
            </Text>
            )}
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="white" />
          </TouchableOpacity>
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
            <View>
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
                      onPress={() => handleReportPress(item)}
                    />
                  );
                }}
                refreshing={loading}
                onRefresh={cargarReportes}
              />
              {totalPages > 0 && (
                <View style={styles.paginationContainer}>
                  <TouchableOpacity
                    style={[styles.paginationButton, currentPage === 0 && styles.paginationButtonDisabled]}
                    onPress={prevPage}
                    disabled={currentPage === 0 || loading}
                  >
                    <Ionicons name="chevron-back-outline" size={20} color={currentPage === 0 ? '#ccc' : '#a27eff'} />
                    <Text style={[styles.paginationButtonText, currentPage === 0 && styles.paginationButtonTextDisabled]}>Anterior</Text>
                  </TouchableOpacity>
                  <Text style={styles.paginationText}>
                    Página {currentPage + 1} de {totalPages}
                  </Text>
                  <TouchableOpacity
                    style={[styles.paginationButton, currentPage === totalPages - 1 && styles.paginationButtonDisabled]}
                    onPress={nextPage}
                    disabled={currentPage === totalPages - 1 || loading}
                  >
                    <Text style={[styles.paginationButtonText, currentPage === totalPages - 1 && styles.paginationButtonTextDisabled]}>Siguiente</Text>
                    <Ionicons name="chevron-forward-outline" size={20} color={currentPage === totalPages - 1 ? '#ccc' : '#a27eff'} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      <ReportDetailModal
        visible={modalVisible}
        reporte={selectedReporte}
        onClose={handleCloseModal}
      />
    </LinearGradient>
  );
};

export default HomeScreen;
