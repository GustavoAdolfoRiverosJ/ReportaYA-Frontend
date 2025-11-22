// src/screens/GestionReportes/GestionReportes.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, StatusBar, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../../styles/HomeScreen.styles';
import ReportCardOperador from '../../components/ReportCardOperador';
import RejectionModal from '../../components/RejectionModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import CustomToast from '../../components/CustomToast';
import { useGestionReportesController } from './GestionReportes.controller';
import { EstadoReporteType } from '../../types';
import { useNavigation } from '@react-navigation/native';

const GestionReportes = () => {
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
    cambiarEstadoARevision,
    rechazarReporte,
    asignarTecnico,
    auditarReporte,
  } = useGestionReportesController();
  
  const navigation = useNavigation();
  const [rejectionModalVisible, setRejectionModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedReporteId, setSelectedReporteId] = useState<number | null>(null);
  
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    visible: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ visible: true, message, type });
  };

  // Log para debuguear estados
  React.useEffect(() => {
    console.log('📊 GestionReportes - Estados en lista:', reportes.map(r => ({ id: r.id, estado: r.estado })));
  }, [reportes]);

  const handleCambiarEstadoPress = (reporteId: number) => {
    setSelectedReporteId(reporteId);
    setConfirmModalVisible(true);
  };

  const handleConfirmCambiarEstado = async () => {
    if (selectedReporteId) {
      try {
        await cambiarEstadoARevision(selectedReporteId);
        showToast('Estado actualizado a "En Revisión"', 'success');
      } catch (error) {
        showToast('Error al cambiar estado', 'error');
      }
      setConfirmModalVisible(false);
    }
  };

  const handleRechazarPress = (reporteId: number) => {
    setSelectedReporteId(reporteId);
    setRejectionModalVisible(true);
  };

  const handleConfirmRejection = async (motivo: string) => {
    if (selectedReporteId) {
      try {
        await rechazarReporte(selectedReporteId, motivo);
        showToast('Reporte rechazado correctamente', 'success');
      } catch (error) {
        showToast('Error al rechazar reporte', 'error');
      }
    }
  };

  const estados: (EstadoReporteType | 'TODOS')[] = ['TODOS', 'PENDIENTE', 'REVISION', 'PROCESO', 'RESUELTA', 'CERRADA', 'RECHAZADO', 'RECHAZADO_AUDITO'];

  return (
    <LinearGradient colors={['#a27eff', '#6a9fff']} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
             <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerLeft}>
            <Text style={styles.headerText}>Gestión de Reportes</Text>
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
                  color: (filtroEstado === estado || (estado === 'TODOS' && !filtroEstado)) ? '#a27eff' : 'white',
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
              <Text style={styles.emptyText}>No hay reportes disponibles</Text>
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

                  return (
                    <ReportCardOperador
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
                      onCambiarEstado={() => handleCambiarEstadoPress(item.id)}
                      onAsignarTecnico={() => asignarTecnico(item.id)}
                      onAuditar={() => auditarReporte(item.id)}
                      onRechazar={() => handleRechazarPress(item.id)}
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

      <RejectionModal
        visible={rejectionModalVisible}
        onClose={() => setRejectionModalVisible(false)}
        onConfirm={handleConfirmRejection}
      />

      <ConfirmationModal
        visible={confirmModalVisible}
        title="Cambiar Estado"
        message='¿Cambiar el estado del reporte a "EN REVISIÓN"?'
        onConfirm={handleConfirmCambiarEstado}
        onCancel={() => setConfirmModalVisible(false)}
        confirmText="Confirmar"
      />

      <CustomToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </LinearGradient>
  );
};

export default GestionReportes;
