// src/screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from '../../styles/LoginScreen.styles';

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
      navigation.navigate('MainTabs' as never);
    } else {
      Alert.alert('Error', 'Correo o contraseña inválidos');
    }
  };

  return (
    <LinearGradient colors={['#a27eff', '#6a9fff']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>ReportaYA</Text>

      <View style={styles.card}>
        <View style={styles.tabContainer}>
          <TouchableOpacity>
            <Text style={[styles.tab, styles.activeTab]}>Iniciar Sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
            <Text style={styles.tab}>Registrarse</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Correo Electronico:</Text>
        <TextInput
          value={correo}
          onChangeText={setCorreo}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Contraseña:</Text>
        <TextInput
          secureTextEntry
          value={contrasena}
          onChangeText={setContrasena}
          style={styles.input}
        />

        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Alert.alert('Recuperación', 'Función no implementada aún')}
          style={styles.forgotButton}
        >
          <Text style={styles.forgotButtonText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default LoginScreen;
