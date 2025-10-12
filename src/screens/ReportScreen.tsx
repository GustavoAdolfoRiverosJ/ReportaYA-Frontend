// src/screens/ReportScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, PermissionsAndroid, Platform, Image, Modal, ScrollView, StatusBar } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { launchCamera } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from '../styles/ReportScreen.styles';

interface ReportForm {
  tipo: '' | 'infraestructura' | 'residuos' | 'otros';
  descripcion: string;
  ubicacion: { lat: number; lng: number } | null;
  imagen: string | null;
}

const ReportScreen = () => {
  const [form, setForm] = useState<ReportForm>({ tipo: '', descripcion: '', ubicacion: null, imagen: null });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigation = useNavigation();

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        Alert.alert('Permiso denegado');
      }
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => setForm(prev => ({ ...prev, ubicacion: { lat: position.coords.latitude, lng: position.coords.longitude } })),
      () => Alert.alert('Error', 'No se pudo obtener tu ubicación.'),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const takePhoto = () => {
    launchCamera({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Ocurrió un error');
        return;
      }
      if (response.assets && response.assets[0].uri) {
        setForm(prev => ({ ...prev, imagen: response.assets[0].uri }));
      }
    });
  };

  const handleSubmit = () => {
    if (!form.tipo || !form.ubicacion || form.descripcion.length < 10) {
      Alert.alert('Error', 'Por favor, completa todos los campos requeridos.');
      return;
    }
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      navigation.navigate('Home' as never);
    }, 2000);
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
            <TouchableOpacity style={[styles.option, form.tipo === 'infraestructura' && styles.selectedOption]} onPress={() => setForm(prev => ({ ...prev, tipo: 'infraestructura' }))}>
              <Text style={styles.optionText}>Infraestructura urbana</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.option, form.tipo === 'residuos' && styles.selectedOption]} onPress={() => setForm(prev => ({ ...prev, tipo: 'residuos' }))}>
              <Text style={styles.optionText}>Acumulación de residuos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.option, form.tipo === 'otros' && styles.selectedOption]} onPress={() => setForm(prev => ({ ...prev, tipo: 'otros' }))}>
              <Text style={styles.optionText}>Otro</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Ubicación en el Mapa:</Text>
          <View style={styles.locationContainer}>
            <TouchableOpacity style={styles.locationButton} onPress={requestLocationPermission}>
              <Text style={styles.locationButtonText}>Obtener Ubicación</Text>
            </TouchableOpacity>
            {form.ubicacion && <Text style={styles.locationText}>Lat: {form.ubicacion.lat.toFixed(5)}, Lng: {form.ubicacion.lng.toFixed(5)}</Text>}
          </View>

          <Text style={styles.label}>Descripción detallada:</Text>
          <TextInput style={styles.input} value={form.descripcion} onChangeText={(text) => setForm(prev => ({ ...prev, descripcion: text }))} multiline placeholder="Describa el problema encontrado..." />

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

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Enviar Reporte</Text>
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
