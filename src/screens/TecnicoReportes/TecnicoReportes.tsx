// src/screens/TecnicoReportes/TecnicoReportes.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, StatusBar, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../../styles/HomeScreen.styles';
import ReportCard from '../../components/ReportCard';
import CustomToast from '../../components/CustomToast';
import { useTecnicoReportesController } from './TecnicoReportes.controller';
import { EstadoReporteType } from '../../types';
import { useNavigation } from '@react-navigation/native';

const TecnicoReportes = () => {
  const {
    reportes,
    loading,
    error,
    currentPage,
    totalPages,
    filtroEstado,
    setFiltroEstado,
    cargarReportes,
    recargarPaginaActual,
    nextPage,
    prevPage,
  } = useTecnicoReportesController();
  
  const navigation = useNavigation();
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    visible: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ visible: true, message, type });
  };

  // Solo mostrar estados relevantes para técnicos
  const estados: (EstadoReporteType | 'TODOS')[] = ['PROCESO', 'RESUELTA', 'RECHAZADO_AUDITO'];

  return (
    <LinearGradient colors={['#4CAF50', '#45a049']} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerLeft}>
            <Text style={styles.headerText}>Mis Reportes Asignados</Text>
          </View>
        </View>

        {/* Filtros */}
        <View style={{ height: 50, marginBottom: 10 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10, alignItems: 'center' }}>
            {estados.map((estado) => (
              <TouchableOpacity
                key={estado}
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 8,
                  backgroundColor: (filtroEstado === estado || (estado === 'TODOS' && !filtroEstado)) ? 'white' : 'rgba(255,255,255,0.3)',
                  borderRadius: 20,
                  marginRight: 10,
                }}
                onPress={() => setFiltroEstado(estado === 'TODOS' ? null : estado as EstadoReporteType)}
              >
                <Text style={{
                  color: (filtroEstado === estado || (estado === 'TODOS' && !filtroEstado)) ? '#4CAF50' : 'white',
                  fontWeight: 'bold'
                }}>
                  {estado}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.card}>
          {loading && reportes.length === 0 ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
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
              <Text style={styles.emptyText}>No hay reportes asignados</Text>
            </View>
          ) : (
            <View style={{flex: 1}}>
              <FlatList
                data={reportes}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ flexGrow: 1 }}
                renderItem={({ item }) => {
                  const ubicacionTexto = item.ubicacion?.direccion
                    || (item.ubicacion?.latitud && item.ubicacion?.longitud
                      ? `${item.ubicacion.latitud.toFixed(6)}, ${item.ubicacion.longitud.toFixed(6)}`
                      : 'Sin ubicación');

                  const handleAtender = () => {
                    console.log('Atendiendo reporte:', item.id);
                    // Aquí puedes agregar lógica para atender el reporte
                    // Por ejemplo: navegar a una pantalla de detalles con formulario para completar
                  };

                  return (
                    <ReportCard
                      key={`${item.id}-${item.estado}`}
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
                      onAtender={handleAtender}
                      onPress={() => {
                        // Aquí se puede agregar navegación al detalle del reporte
                        console.log('Reporte presionado:', item.id);
                      }}
                    />
                  );
                }}
                refreshing={loading && reportes.length > 0}
                onRefresh={recargarPaginaActual}
                ListFooterComponent={
                  totalPages > 0 ? (
                    <View style={[styles.paginationContainer, { marginTop: 'auto' }]}>
                      <TouchableOpacity
                        style={[styles.paginationButton, currentPage === 0 && styles.paginationButtonDisabled]}
                        onPress={prevPage}
                        disabled={currentPage === 0 || loading}
                      >
                        <Ionicons name="chevron-back-outline" size={20} color={currentPage === 0 ? '#ccc' : 'white'} />
                        <Text style={[styles.paginationButtonText, currentPage === 0 && styles.paginationButtonTextDisabled]}>Anterior</Text>
                      </TouchableOpacity>
                      <Text style={styles.paginationText}>
                        Página {currentPage + 1} de {totalPages || 1}
                      </Text>
                      <TouchableOpacity
                        style={[styles.paginationButton, currentPage === totalPages - 1 && styles.paginationButtonDisabled]}
                        onPress={nextPage}
                        disabled={currentPage === totalPages - 1 || loading}
                      >
                        <Text style={[styles.paginationButtonText, currentPage === totalPages - 1 && styles.paginationButtonTextDisabled]}>Siguiente</Text>
                        <Ionicons name="chevron-forward-outline" size={20} color={currentPage === totalPages - 1 ? '#ccc' : 'white'} />
                      </TouchableOpacity>
                    </View>
                  ) : null
                }
                ListFooterComponentStyle={{ flex: 1, justifyContent: 'flex-end' }}
              />
            </View>
          )}
        </View>
      </View>

      <CustomToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </LinearGradient>
  );
};

export default TecnicoReportes;
