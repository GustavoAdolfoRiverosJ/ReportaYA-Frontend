// src/screens/AuditarReporte/AuditarReporte.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../../styles/HomeScreen.styles';
import CustomToast from '../../components/CustomToast';
import { useAuditarReporteController } from './AuditarReporte.controller';
import { auditStyles } from './styles';
import { FotoAuditoria } from '../../types';

const AuditarReporte = () => {
  const navigation = useNavigation();
  const {
    reporteId,
    reporte,
    loading,
    error,
    aceptando,
    rechazando,
    comentarioRechazo,
    setComentarioRechazo,
    comentarioCierre,
    setComentarioCierre,
    mostrarModalCierre,
    setMostrarModalCierre,
    mostrarModalRechazo,
    setMostrarModalRechazo,
    cargarReporte,
    aceptarAuditoria,
    rechazarAuditoria,
  } = useAuditarReporteController();

  const [selectedFoto, setSelectedFoto] = useState<FotoAuditoria | null>(null);
  const [fotoModalVisible, setFotoModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleAceptar = async () => {
    setMostrarModalCierre(true);
  };

  const handleConfirmarCierre = async () => {
    await aceptarAuditoria();
    setSuccessMessage('Reporte cerrado exitosamente');
  };

  const handleRechazar = async () => {
    await rechazarAuditoria(comentarioRechazo);
    setSuccessMessage('Reporte rechazado, vuelve a PROCESO');
  };

  const renderFoto = (foto: FotoAuditoria, index: number) => {
    const tipoColors = {
      INICIAL: '#FF6B6B',
      PROCESO: '#FFA500',
      FINAL: '#4CAF50',
    };

    return (
      <TouchableOpacity
        key={index}
        style={auditStyles.fotoContainer}
        onPress={() => {
          setSelectedFoto(foto);
          setFotoModalVisible(true);
        }}
      >
        <View style={[auditStyles.fotoHeader, { borderLeftColor: tipoColors[foto.tipo] }]}>
          <Ionicons name="image-outline" size={24} color={tipoColors[foto.tipo]} />
        </View>
        {foto.archivoBase64 && (
          <Image
            source={{ uri: `data:image/png;base64,${foto.archivoBase64}` }}
            style={auditStyles.fotoThumbnail}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#a27eff', '#6a9fff']} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerText}>Auditar Reporte</Text>
            <Text style={styles.userName}>Reporte #{reporteId}</Text>
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.card}>
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#a27eff" />
              <Text style={styles.loadingText}>Cargando información...</Text>
            </View>
          </View>
        ) : error ? (
          <View style={styles.card}>
            <View style={styles.centerContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={auditStyles.retryButton}
                onPress={cargarReporte}
              >
                <Text style={auditStyles.retryButtonText}>Reintentar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : reporte ? (
          <ScrollView style={styles.card} showsVerticalScrollIndicator={false}>
            {/* Información General del Reporte */}
            <View style={auditStyles.section}>
              <Text style={auditStyles.sectionTitle}>📋 Información del Reporte</Text>
              <View style={auditStyles.infoBox}>
                <Text style={auditStyles.infoLabel}>Título:</Text>
                <Text style={auditStyles.infoValue}>{reporte.titulo}</Text>
              </View>
              <View style={auditStyles.infoBox}>
                <Text style={auditStyles.infoLabel}>Ubicación:</Text>
                <Text style={auditStyles.infoValue}>
                  {reporte.ubicacion?.direccion || 'No especificada'}
                </Text>
              </View>
              <View style={auditStyles.infoBox}>
                <Text style={auditStyles.infoLabel}>Prioridad:</Text>
                <Text style={[auditStyles.infoValue, auditStyles.prioridad]}>
                  {reporte.prioridad}
                </Text>
              </View>
              <View style={auditStyles.infoBox}>
                <Text style={auditStyles.infoLabel}>Técnico Asignado:</Text>
                <Text style={auditStyles.infoValue}>{reporte.tecnicoNombre}</Text>
              </View>
              <View style={auditStyles.infoBox}>
                <Text style={auditStyles.infoLabel}>Rechazos de Auditoría:</Text>
                <View
                  style={[
                    auditStyles.contadorRechazosBadge,
                    {
                      backgroundColor:
                        reporte.contadorRechazos >= 3
                          ? '#FF6B6B'
                          : reporte.contadorRechazos > 0
                            ? '#FFA500'
                            : '#4CAF50',
                    },
                  ]}
                >
                  <Text style={auditStyles.contadorRechazosText}>
                    {reporte.contadorRechazos}/3
                  </Text>
                </View>
              </View>
            </View>

            {/* Comentario de Resolución */}
            <View style={auditStyles.section}>
              <Text style={auditStyles.sectionTitle}>💬 Comentario de Resolución</Text>
              <View style={auditStyles.comentarioBox}>
                <Text style={auditStyles.comentarioText}>
                  {reporte.comentarioResolucion || 'Sin comentario'}
                </Text>
              </View>
            </View>

            {/* Fotos Adjuntadas */}
            <View style={auditStyles.section}>
              <Text style={auditStyles.sectionTitle}>📸 Fotos Adjuntadas</Text>
              {reporte.fotos.length === 0 ? (
                <Text style={auditStyles.noFotosText}>No hay fotos adjuntadas</Text>
              ) : (
                <View style={auditStyles.fotosGrid}>
                  {reporte.fotos.slice(0, 3).map((foto, index) => renderFoto(foto, index))}
                </View>
              )}
            </View>

            {/* Botones de Acción */}
            <View style={auditStyles.actionButtons}>
              {/* Botón Aceptar */}
              <TouchableOpacity
                style={[
                  auditStyles.button,
                  auditStyles.buttonAceptar,
                  aceptando && auditStyles.buttonDisabled,
                ]}
                onPress={handleAceptar}
                disabled={aceptando || rechazando}
              >
                {aceptando ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                    <Text style={auditStyles.buttonText}>Aceptar y Cerrar</Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Botón Rechazar */}
              <TouchableOpacity
                style={[
                  auditStyles.button,
                  auditStyles.buttonRechazar,
                  rechazando && auditStyles.buttonDisabled,
                ]}
                onPress={() => setMostrarModalRechazo(true)}
                disabled={aceptando || rechazando}
              >
                {rechazando ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <Ionicons name="close-circle-outline" size={20} color="white" />
                    <Text style={auditStyles.buttonText}>Rechazar</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Espacio al final */}
            <View style={{ height: 20 }} />
          </ScrollView>
        ) : (
          <View style={styles.card}>
            <Text style={styles.emptyText}>No se encontró el reporte</Text>
          </View>
        )}
      </View>

      {/* Modal para ver foto completa */}
      <Modal
        visible={fotoModalVisible}
        transparent
        onRequestClose={() => setFotoModalVisible(false)}
      >
        <View style={auditStyles.fotoModalContainer}>
          <TouchableOpacity
            style={auditStyles.fotoModalBackdrop}
            onPress={() => setFotoModalVisible(false)}
          />
          <View style={auditStyles.fotoModalContent}>
            <TouchableOpacity
              style={auditStyles.fotoModalClose}
              onPress={() => setFotoModalVisible(false)}
            >
              <Ionicons name="close-outline" size={28} color="white" />
            </TouchableOpacity>

            {selectedFoto?.archivoBase64 && (
              <Image
                source={{ uri: `data:image/png;base64,${selectedFoto.archivoBase64}` }}
                style={auditStyles.fotoModalImage}
              />
            )}
            <Text style={auditStyles.fotoModalDescripcion}>{selectedFoto?.descripcion}</Text>
          </View>
        </View>
      </Modal>

      {/* Modal para rechazar con comentario */}
      <Modal
        visible={mostrarModalRechazo}
        transparent
        animationType="slide"
        onRequestClose={() => setMostrarModalRechazo(false)}
      >
        <View style={auditStyles.rechazarModalContainer}>
          <View style={auditStyles.rechazarModalContent}>
            <Text style={auditStyles.rechazarModalTitle}>
              Comentario de Rechazo
            </Text>

            <TextInput
              style={auditStyles.rechazarTextInput}
              placeholder="Escribe el comentario de rechazo..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={comentarioRechazo}
              onChangeText={setComentarioRechazo}
            />

            <View style={auditStyles.rechazarModalButtons}>
              <TouchableOpacity
                style={[auditStyles.rechazarButton, auditStyles.rechazarButtonCancel]}
                onPress={() => {
                  setMostrarModalRechazo(false);
                  setComentarioRechazo('');
                }}
              >
                <Text style={auditStyles.rechazarButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  auditStyles.rechazarButton,
                  auditStyles.rechazarButtonConfirm,
                  !comentarioRechazo.trim() && auditStyles.rechazarButtonDisabled,
                ]}
                onPress={handleRechazar}
                disabled={!comentarioRechazo.trim() || rechazando}
              >
                {rechazando ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={auditStyles.rechazarButtonText}>Confirmar Rechazo</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para comentario de cierre */}
      <Modal
        visible={mostrarModalCierre}
        transparent
        animationType="slide"
        onRequestClose={() => setMostrarModalCierre(false)}
      >
        <View style={auditStyles.rechazarModalContainer}>
          <View style={auditStyles.rechazarModalContent}>
            <Text style={auditStyles.rechazarModalTitle}>
              Comentario de Cierre
            </Text>

            <TextInput
              style={auditStyles.rechazarTextInput}
              placeholder="Escribe el comentario de cierre..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              value={comentarioCierre}
              onChangeText={setComentarioCierre}
            />

            <View style={auditStyles.rechazarModalButtons}>
              <TouchableOpacity
                style={[auditStyles.rechazarButton, auditStyles.rechazarButtonCancel]}
                onPress={() => {
                  setMostrarModalCierre(false);
                  setComentarioCierre('');
                }}
              >
                <Text style={auditStyles.rechazarButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  auditStyles.rechazarButton,
                  auditStyles.rechazarButtonConfirm,
                  !comentarioCierre.trim() && auditStyles.rechazarButtonDisabled,
                ]}
                onPress={handleConfirmarCierre}
                disabled={!comentarioCierre.trim() || aceptando}
              >
                {aceptando ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={auditStyles.rechazarButtonText}>Confirmar Cierre</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CustomToast
        visible={!!successMessage}
        message={successMessage}
        type="success"
        onClose={() => setSuccessMessage('')}
      />
    </LinearGradient>
  );
};

// auditStyles moved to ./styles.ts

export default AuditarReporte;
