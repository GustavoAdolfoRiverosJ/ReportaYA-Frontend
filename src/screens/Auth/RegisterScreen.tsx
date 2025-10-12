// src/screens/Auth/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [repeticion, setRepeticion] = useState('');
  const navigation = useNavigation();

  const handleRegister = () => {
    if (!nombres || !apellidos || !correo || !contrasena || !repeticion) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (contrasena !== repeticion) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (contrasena.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Simulación de registro exitoso
    Alert.alert('Éxito', '¡Registro completado!');
    navigation.navigate('Login' as never);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>ReportaYA</Text>

      <TextInput
        placeholder="Nombres"
        value={nombres}
        onChangeText={setNombres}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Apellidos"
        value={apellidos}
        onChangeText={setApellidos}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Correo Electrónico"
        value={correo}
        onChangeText={setCorreo}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Repite tu contraseña"
        secureTextEntry
        value={repeticion}
        onChangeText={setRepeticion}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 }}
      />

      <TouchableOpacity
        onPress={handleRegister}
        style={{ backgroundColor: '#9c4dff', padding: 15, borderRadius: 8, alignItems: 'center' }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Registrarse</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Login' as never)}
        style={{ marginTop: 10, alignItems: 'center' }}
      >
        <Text style={{ color: '#666' }}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;