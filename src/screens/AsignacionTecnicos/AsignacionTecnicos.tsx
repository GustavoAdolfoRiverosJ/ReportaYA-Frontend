// src/screens/AsignacionTecnicos/AsignacionTecnicos.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, StatusBar, ActivityIndicator, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../../styles/HomeScreen.styles';
import TecnicoCard from '../../components/TecnicoCard';
import CustomToast from '../../components/CustomToast';
import ConfirmationModal from '../../components/ConfirmationModal';
import { useAsignacionTecnicosController } from './AsignacionTecnicos.controller';
import { Prioridad } from '../../types/enums';
import { PrioridadType } from '../../types';
import { prioridadStyles } from './styles';

const prioridadOptions: { label: string; value: PrioridadType }[] = [
  { label: '🟢 Baja', value: Prioridad.BAJA },
  { label: '🟡 Media', value: Prioridad.MEDIA },
  { label: '🔴 Alta', value: Prioridad.ALTA },
];

const AsignacionTecnicos = () => {
  const navigation = useNavigation();
  const {
    tecnicos,
    loading,
    error,
    tecnicoAsignandoId,
    reporteId,
    currentPage,
    totalPages,
    showSuccess,
    setShowSuccess,
    prioridad,
    setPrioridad,
    cargarTecnicos,
    recargarPaginaActual,
    nextPage,
    prevPage,
    asignarTecnico,
  } = useAsignacionTecnicosController();

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedTecnico, setSelectedTecnico] = useState<{id: number, nombre: string} | null>(null);
  const [prioridadDropdownVisible, setPrioridadDropdownVisible] = useState(false);

  const handleAsignarPress = (tecnicoId: number, tecnicoNombre: string) => {
    setSelectedTecnico({ id: tecnicoId, nombre: tecnicoNombre });
    setConfirmModalVisible(true);
  };

  const handleConfirmAsignacion = () => {
    if (selectedTecnico) {
      asignarTecnico(selectedTecnico.id);
      setConfirmModalVisible(false);
    }
  };

  return (
    <LinearGradient colors={['#a27eff', '#6a9fff']} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerText}>Asignar Técnico</Text>
            <Text style={styles.userName}>Reporte #{reporteId}</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => (navigation as any).goBack()}
          >
            <Ionicons name="arrow-back-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Selector de Prioridad */}
        <View style={prioridadStyles.prioridadContainer}>
          <Text style={prioridadStyles.prioridadLabel}>Selecciona Prioridad:</Text>
          <TouchableOpacity
            style={prioridadStyles.prioridadButton}
            onPress={() => setPrioridadDropdownVisible(!prioridadDropdownVisible)}
          >
            <Text style={prioridadStyles.prioridadButtonText}>
              {prioridadOptions.find(p => p.value === prioridad)?.label || 'Seleccionar'}
            </Text>
            <Ionicons 
              name={prioridadDropdownVisible ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="white" 
            />
          </TouchableOpacity>

          {prioridadDropdownVisible && (
            <View style={prioridadStyles.dropdownMenu}>
              {prioridadOptions.map((opcion) => (
                <TouchableOpacity
                  key={opcion.value}
                  style={[
                    prioridadStyles.dropdownItem,
                    prioridad === opcion.value && prioridadStyles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    setPrioridad(opcion.value);
                    setPrioridadDropdownVisible(false);
                  }}
                >
                  <Text
                    style={[
                      prioridadStyles.dropdownItemText,
                      prioridad === opcion.value && prioridadStyles.dropdownItemTextSelected,
                    ]}
                  >
                    {opcion.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.card}>
          {loading && tecnicos.length === 0 ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#a27eff" />
              <Text style={styles.loadingText}>Cargando técnicos...</Text>
            </View>
          ) : error ? (
            <View style={styles.centerContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Text style={styles.retryText} onPress={cargarTecnicos}>
                Toca para reintentar
              </Text>
            </View>
          ) : tecnicos.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text style={styles.emptyText}>No hay técnicos disponibles</Text>
            </View>
          ) : (
            <View style={{flex: 1}}>
              <FlatList
                data={tecnicos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TecnicoCard
                    id={item.id.toString()}
                    nombre={`${item.nombres} ${item.apellidos}`}
                    especialidad="Técnico Municipal"
                    onAsignar={() => handleAsignarPress(item.id, `${item.nombres} ${item.apellidos}`)}
                    asignando={tecnicoAsignandoId === item.id}
                  />
                )}
                refreshing={loading && tecnicos.length > 0}
                onRefresh={recargarPaginaActual}
              />
              {totalPages > 0 && (
                <View style={styles.paginationContainer}>
                  <TouchableOpacity
                    style={[styles.paginationButton, currentPage === 0 && styles.paginationButtonDisabled]}
                    onPress={prevPage}
                    disabled={currentPage === 0 || loading}
                  >
                    <Ionicons name="chevron-back-outline" size={20} color={currentPage === 0 ? '#ccc' : 'white'} />
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
                    <Ionicons name="chevron-forward-outline" size={20} color={currentPage === totalPages - 1 ? '#ccc' : 'white'} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      <ConfirmationModal
        visible={confirmModalVisible}
        title="Confirmar Asignación"
        message={`¿Asignar el reporte #${reporteId} al técnico ${selectedTecnico?.nombre}?`}
        onConfirm={handleConfirmAsignacion}
        onCancel={() => setConfirmModalVisible(false)}
        confirmText="Asignar"
      />

      <CustomToast
        visible={showSuccess}
        message="Técnico asignado correctamente"
        type="success"
        onClose={() => setShowSuccess(false)}
      />
    </LinearGradient>
  );
};

// prioridadStyles moved to ./styles.ts

export default AsignacionTecnicos;