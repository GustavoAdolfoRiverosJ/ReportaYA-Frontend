// src/screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    if (!correo || !contrasena) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    // Simulación de login exitoso
    if (correo === 'user@example.com' && contrasena === 'password') {
      Alert.alert('Éxito', '¡Inicio de sesión exitoso!');
      // Aquí iría la lógica real (API, JWT, etc.)
      navigation.navigate('MainTabs' as never);
    } else {
      Alert.alert('Error', 'Correo o contraseña inválidos');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>ReportaYA</Text>

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

      <TouchableOpacity
        onPress={handleLogin}
        style={{ backgroundColor: '#9c4dff', padding: 15, borderRadius: 8, alignItems: 'center' }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Register' as never)}
        style={{ marginTop: 10, alignItems: 'center' }}
      >
        <Text style={{ color: '#666' }}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => Alert.alert('Recuperación', 'Función no implementada aún')}
        style={{ marginTop: 10, alignItems: 'center' }}
      >
        <Text style={{ color: '#666' }}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;