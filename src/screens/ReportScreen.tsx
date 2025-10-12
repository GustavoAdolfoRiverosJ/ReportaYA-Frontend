// src/screens/ReportScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, PermissionsAndroid, Platform, Image, Modal, StyleSheet } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import ImagePicker from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';


// Tipos
interface ReportForm {
  tipo: '' | 'infraestructura' | 'residuos' | 'otros';
  descripcion: string;
  ubicacion: { lat: number; lng: number } | null;
  imagen: string | null;
}

const ReportScreen = () => {
  const [form, setForm] = useState<ReportForm>({
    tipo: '',
    descripcion: '',
    ubicacion: null,
    imagen: null,
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigation = useNavigation();

  // Solicitar permisos de ubicación
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Permiso de Ubicación',
          message: 'ReportaYA necesita acceso a tu ubicación para marcar el incidente.',
          buttonNeutral: 'Preguntar luego',
          buttonNegative: 'Cancelar',
          buttonPositive: 'Aceptar',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        Alert.alert('Permiso denegado', 'No podemos obtener tu ubicación sin permiso.');
      }
    } else {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setForm(prev => ({
          ...prev,
          ubicacion: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        }));
      },
      (error) => {
        Alert.alert('Error', 'No se pudo obtener tu ubicación.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  // Tomar foto
const takePhoto = () => {
  ImagePicker.launchCamera(
    {
      mediaType: 'photo',
      quality: 0.8,
    },
    (response) => {
      if (response.didCancel) {
        console.log('Usuario canceló');
      } else if (response.errorCode) {
        Alert.alert('Error', response.errorMessage || 'Error al tomar foto');
      } else {
        // Extraer uri con tipo explícito
        let uri: string | null = null;
        if (
          response.assets &&
          response.assets[0] &&
          typeof response.assets[0].uri === 'string'
        ) {
          uri = response.assets[0].uri;
        }

        setForm(prev => ({
          ...prev,
          imagen: uri, 
        }));
      }
    }
  );
};


  // Validar y enviar reporte
  const handleSubmit = () => {
    if (!form.tipo) {
      Alert.alert('Error', 'Debes seleccionar un tipo de problema');
      return;
    }

    if (form.descripcion.length < 20) {
      Alert.alert('Error', 'La descripción debe tener al menos 20 caracteres');
      return;
    }

    if (form.descripcion.length > 500) {
      Alert.alert('Error', 'La descripción no puede exceder 500 caracteres');
      return;
    }

    if (!form.ubicacion) {
      Alert.alert('Error', 'Debes obtener tu ubicación');
      return;
    }

    // Simular envío exitoso
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      navigation.navigate('Home' as never);
    }, 2000);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>Reportar Incidencia</Text>

      {/* Tipo de Reporte */}
      <Text>Tipo de Problema:</Text>
      <TouchableOpacity
        onPress={() => setForm(prev => ({ ...prev, tipo: 'infraestructura' }))}
        style={[styles.option, form.tipo === 'infraestructura' && styles.selected]}
      >
        <Text>Infraestructura</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setForm(prev => ({ ...prev, tipo: 'residuos' }))}
        style={[styles.option, form.tipo === 'residuos' && styles.selected]}
      >
        <Text>Residuos</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setForm(prev => ({ ...prev, tipo: 'otros' }))}
        style={[styles.option, form.tipo === 'otros' && styles.selected]}
      >
        <Text>Otros</Text>
      </TouchableOpacity>

      {/* Ubicación */}
      <Text>Ubicación en el Mapa:</Text>
      <TouchableOpacity
        onPress={requestLocationPermission}
        style={styles.button}
      >
        <Text style={{ color: 'white' }}>Obtener Ubicación Actual</Text>
      </TouchableOpacity>
      {form.ubicacion && (
        <Text style={{ marginTop: 10 }}>
          Lat: {form.ubicacion.lat.toFixed(6)} | Lng: {form.ubicacion.lng.toFixed(6)}
        </Text>
      )}

      {/* Descripción */}
      <Text>Descripción detallada:</Text>
      <TextInput
        multiline
        numberOfLines={4}
        value={form.descripcion}
        onChangeText={(text) => setForm(prev => ({ ...prev, descripcion: text }))}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 }}
      />

      {/* Foto */}
      <Text>Agregar Fotos y Videos:</Text>
      <TouchableOpacity
        onPress={takePhoto}
        style={styles.button}
      >
        <Text style={{ color: 'white' }}>Tomar Foto</Text>
      </TouchableOpacity>
      {form.imagen && <Image source={{ uri: form.imagen }} style={{ width: 100, height: 100, marginVertical: 10 }} />}

      {/* Enviar */}
      <TouchableOpacity
        onPress={handleSubmit}
        style={[styles.button, { backgroundColor: '#9c4dff' }]}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Enviar Reporte</Text>
      </TouchableOpacity>

      {/* Pop-up de éxito */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>✅ ¡Reporte creado exitosamente!</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  option: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 5,
    borderRadius: 8,
  },
  selected: {
    backgroundColor: '#e0d0ff',
    borderColor: '#9c4dff',
  },
  button: {
    backgroundColor: '#666',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default ReportScreen;