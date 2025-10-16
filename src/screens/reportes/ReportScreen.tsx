// src/screens/reportes/ReportScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, PermissionsAndroid, Platform, Image, Modal, ScrollView, StatusBar } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { launchCamera } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../../styles/ReportScreen.styles';
import { useReportController, ReportFormData } from './ReportScreen.controller';
import { useReportes } from '../../context/ReportesContext';

const ReportScreen = () => {
  const [form, setForm] = useState<ReportFormData>({ tipo: '', descripcion: '', ubicacion: null, imagen: null });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { agregarReporte } = useReportes();
  const { enviarReporte, usuarioAutenticado, usuarioId } = useReportController();

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permiso de Ubicación',
            message: 'ReportaYA necesita acceso a tu ubicación para registrar el lugar del reporte.',
            buttonNeutral: 'Preguntar después',
            buttonNegative: 'Cancelar',
            buttonPositive: 'Aceptar',
          }
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permiso de ubicación concedido');
          getCurrentLocation();
        } else {
          Alert.alert(
            'Permiso denegado',
            'Necesitamos acceso a tu ubicación para crear el reporte. Por favor, habilita el permiso en la configuración de la app.',
            [{ text: 'OK' }]
          );
        }
      } catch (err) {
        console.warn('Error al solicitar permiso:', err);
        Alert.alert('Error', 'Ocurrió un error al solicitar el permiso de ubicación');
      }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    Alert.alert('Obteniendo ubicación', 'Por favor espera...');
    
    Geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setForm(prev => ({ ...prev, ubicacion: { lat, lng } }));
        Alert.alert(
          'Ubicación obtenida ✓',
          `Lat: ${lat.toFixed(6)}\nLng: ${lng.toFixed(6)}`,
          [{ text: 'OK' }]
        );
        console.log('Ubicación obtenida:', { lat, lng });
      },
      (error) => {
        console.error('Error al obtener ubicación:', error);
        let mensaje = 'No se pudo obtener tu ubicación.';
        
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            mensaje = 'Permiso de ubicación denegado. Por favor habilítalo en configuración.';
            break;
          case 2: // POSITION_UNAVAILABLE
            mensaje = 'Ubicación no disponible. Verifica que el GPS esté activado.';
            break;
          case 3: // TIMEOUT
            mensaje = 'Tiempo de espera agotado. Intenta nuevamente en un lugar con mejor señal.';
            break;
        }
        
        Alert.alert(
          'Error de ubicación',
          mensaje,
          [
            { text: 'Reintentar', onPress: () => getCurrentLocation() },
            { text: 'Cancelar', style: 'cancel' }
          ]
        );
      },
      { 
        enableHighAccuracy: false,  // Cambiado a false para ser más rápido
        timeout: 30000,              // Aumentado a 30 segundos
        maximumAge: 10000            // Permite usar ubicación de hace 10 segundos
      }
    );
  };

  const takePhoto = async () => {
    try {
      // Pedir permiso de cámara en Android
      if (Platform.OS === 'android') {
        const cameraPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Permiso de Cámara',
            message: 'ReportaYA necesita acceso a tu cámara para tomar fotos del reporte.',
            buttonNeutral: 'Preguntar después',
            buttonNegative: 'Cancelar',
            buttonPositive: 'Aceptar',
          }
        );
        
        if (cameraPermission !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permiso denegado',
            'Necesitamos acceso a tu cámara para tomar fotos.',
            [{ text: 'OK' }]
          );
          return;
        }
      }

      const response = await launchCamera({ 
        mediaType: 'photo', 
        quality: 0.8,
        saveToPhotos: false 
      });
      
      if (response.didCancel) {
        return;
      }
      
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Ocurrió un error');
        return;
      }
      
      if (response.assets && response.assets[0]?.uri) {
        setForm(prev => ({ ...prev, imagen: response.assets![0].uri || null }));
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo acceder a la cámara');
    }
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    // Verificar que el usuario esté autenticado
    if (!usuarioAutenticado || !usuarioId) {
      Alert.alert('Error', 'Debes iniciar sesión para crear un reporte');
      return;
    }

    setIsLoading(true);
    
    // ✨ Pasar el callback para agregar el reporte a la memoria
    const reporteCreado = await enviarReporte(form, async (reporte) => {
      await agregarReporte(reporte, usuarioId);
    });
    
    setIsLoading(false);

    if (reporteCreado) {
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.navigate('Home' as never);
      }, 2000);
    }
  };

  return (
    <LinearGradient colors={['#a27eff', '#6a9fff']} style={styles.gradient}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Reportar Incidencia</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Tipo de Problema:</Text>
          <View style={styles.optionContainer}>
            <TouchableOpacity 
              style={[styles.option, form.tipo === 'infraestructura' && styles.selectedOption]} 
              onPress={() => setForm(prev => ({ ...prev, tipo: 'infraestructura' }))}
            >
              <Text style={styles.optionText}>Infraestructura urbana</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.option, form.tipo === 'residuos' && styles.selectedOption]} 
              onPress={() => setForm(prev => ({ ...prev, tipo: 'residuos' }))}
            >
              <Text style={styles.optionText}>Acumulación de residuos</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.option, form.tipo === 'otros' && styles.selectedOption]} 
              onPress={() => setForm(prev => ({ ...prev, tipo: 'otros' }))}
            >
              <Text style={styles.optionText}>Otro</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Ubicación en el Mapa:</Text>
          <View style={styles.locationContainer}>
            <TouchableOpacity style={styles.locationButton} onPress={requestLocationPermission}>
              <Text style={styles.locationButtonText}>Obtener Ubicación</Text>
            </TouchableOpacity>
            {form.ubicacion && (
              <Text style={styles.locationText}>
                Lat: {form.ubicacion.lat.toFixed(5)}, Lng: {form.ubicacion.lng.toFixed(5)}
              </Text>
            )}
          </View>

          <Text style={styles.label}>Descripción detallada:</Text>
          <TextInput 
            style={styles.input} 
            value={form.descripcion} 
            onChangeText={(text) => setForm(prev => ({ ...prev, descripcion: text }))} 
            multiline 
            placeholder="Describa el problema encontrado..." 
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Adjuntar fotos:</Text>
          {form.imagen ? (
            <TouchableOpacity onPress={takePhoto}>
              <Image source={{ uri: form.imagen }} style={styles.imagePreview} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
              <Ionicons name="camera" size={24} color="#555" />
              <Text style={styles.photoButtonText}>Adjuntar Fotos</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.submitButton, isLoading && { opacity: 0.6 }]} 
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Enviando...' : 'Enviar Reporte'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>✅ ¡Reporte creado exitosamente!</Text>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default ReportScreen;
