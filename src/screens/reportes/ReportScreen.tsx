// src/screens/reportes/ReportScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, PermissionsAndroid, Platform, Image, ScrollView, StatusBar } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { launchCamera } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../../styles/ReportScreen.styles';
import { useReportController, ReportFormData } from './ReportScreen.controller';
import { useReportes } from '../../context/ReportesContext';
import CustomToast from '../../components/CustomToast';
import LocationPickerModal from '../../components/LocationPickerModal';

const ReportScreen = () => {
  const [form, setForm] = useState<ReportFormData>({ tipo: '', descripcion: '', ubicacion: null, imagen: null });
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    visible: false,
    message: '',
    type: 'success',
  });

  const navigation = useNavigation();
  const { agregarReporte } = useReportes();
  const { enviarReporte, usuarioAutenticado, usuarioId } = useReportController();

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ visible: true, message, type });
  };

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
          showToast('Permiso de ubicación denegado', 'error');
        }
      } catch (err) {
        console.warn('Error al solicitar permiso:', err);
        showToast('Error al solicitar permiso de ubicación', 'error');
      }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    showToast('Obteniendo ubicación...', 'info');

    Geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        if (!form.ubicacion) {
          setForm(prev => ({ ...prev, ubicacion: currentLocation }));
        }

        setShowLocationPicker(true);
      },
      (error) => {
        console.error('Error:', error);
        const defaultLocation = { lat: -12.046374, lng: -77.042793 };
        if (!form.ubicacion) {
          setForm(prev => ({ ...prev, ubicacion: defaultLocation }));
        }
        setShowLocationPicker(true);
        showToast('Usando ubicación por defecto. Ajusta el marcador.', 'info');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const handleLocationConfirm = async (location: { lat: number; lng: number }) => {
    setShowLocationPicker(false);
    showToast('Obteniendo dirección...', 'info');

    try {
      const ServicioGeocoding = (await import('../../servicios/ServicioGeocoding')).default;
      const direccion = await ServicioGeocoding.obtenerDireccion(location.lat, location.lng);

      setForm(prev => ({
        ...prev,
        ubicacion: {
          lat: location.lat,
          lng: location.lng,
          // Campos separados para mejor consulta en backend
          calle: direccion.calle,
          distrito: direccion.distrito,
          ciudad: direccion.ciudad,
          departamento: direccion.departamento,
          pais: direccion.pais,
          // Dirección completa para mostrar en UI
          direccion: direccion.direccionCompleta
        }
      }));

      showToast(`Ubicación: ${direccion.distrito}, ${direccion.departamento}`, 'success');
    } catch (error) {
      setForm(prev => ({ ...prev, ubicacion: location }));
      showToast('Ubicación seleccionada correctamente', 'success');
    }
  };

  const handleLocationCancel = () => {
    setShowLocationPicker(false);
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
          showToast('Permiso de cámara denegado', 'error');
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
        showToast(response.errorMessage || 'Error al tomar foto', 'error');
        return;
      }

      if (response.assets && response.assets[0]?.uri) {
        setForm(prev => ({ ...prev, imagen: response.assets![0].uri || null }));
      }
    } catch (error) {
      showToast('No se pudo acceder a la cámara', 'error');
    }
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    // Verificar que el usuario esté autenticado
    if (!usuarioAutenticado || !usuarioId) {
      showToast('Debes iniciar sesión para crear un reporte', 'error');
      return;
    }

    setIsLoading(true);

    // ✨ Pasar el callback para agregar el reporte a la memoria
    const reporteCreado = await enviarReporte(form, async (reporte) => {
      await agregarReporte(reporte, usuarioId);
    });

    setIsLoading(false);

    if (reporteCreado) {
      showToast('¡Reporte creado exitosamente!', 'success');
      setTimeout(() => {
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
          {!form.ubicacion ? (
            <View style={styles.locationContainer}>
              <TouchableOpacity style={styles.locationButton} onPress={requestLocationPermission}>
                <Text style={styles.locationButtonText}>Obtener Ubicación</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.mapThumbnailContainer}
              onPress={requestLocationPermission}
              activeOpacity={0.7}
            >
              <View style={styles.mapThumbnail}>
                <View style={styles.mapPlaceholder}>
                  <Text style={styles.mapIcon}>🗺️</Text>
                  <View style={styles.markerOverlay}>
                    <Text style={styles.markerIcon}>📍</Text>
                  </View>
                </View>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationLabel}>
                    {form.ubicacion.direccion || 'Ubicación seleccionada'}
                  </Text>
                  <Text style={styles.coordinatesSmall}>
                    {form.ubicacion.lat.toFixed(5)}, {form.ubicacion.lng.toFixed(5)}
                  </Text>
                </View>
              </View>
              <Text style={styles.editLocationText}>Toca para cambiar ubicación</Text>
            </TouchableOpacity>
          )}

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

      <CustomToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />

      <LocationPickerModal
        visible={showLocationPicker}
        initialLocation={form.ubicacion || { lat: -12.046374, lng: -77.042793 }}
        onConfirm={handleLocationConfirm}
        onCancel={handleLocationCancel}
      />
    </LinearGradient>
  );
};

export default ReportScreen;
