// src/screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StatusBar, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from '../../styles/LoginScreen.styles';
import { useAuth } from '../../context/AuthContext';

const LoginScreen = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { login, usuario: usuarioAutenticado } = useAuth();

  const handleLogin = async () => {
    if (!usuario || !password) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(usuario, password);

      console.log('Login exitoso, respuesta:', response);
      console.log('Usuario autenticado:', usuarioAutenticado);

      // Determinar a dónde navegar según el tipo de cuenta
      const getNavigationTarget = () => {
        if (usuarioAutenticado?.tipoCuenta === 'OPERADOR_MUNICIPAL') {
          return 'HomeScreenOperador';
        }
        return 'MainTabs'; // CIUDADANO, TECNICO o por defecto
      };

      const navigationTarget = getNavigationTarget();
      console.log('Navegando a:', navigationTarget);

      Alert.alert(
        'Éxito',
        response.message || '¡Inicio de sesión exitoso!',
        [{ text: 'OK', onPress: () => navigation.navigate(navigationTarget as never) }]
      );
    } catch (error: any) {
      console.error('Error en login:', error);
      Alert.alert('Error', error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
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

        <Text style={styles.label}>Usuario:</Text>
        <TextInput
          value={usuario}
          onChangeText={setUsuario}
          style={styles.input}
          autoCapitalize="none"
          placeholder="Ingresa tu usuario"
        />

        <Text style={styles.label}>Contraseña:</Text>
        <TextInput
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholder="Ingresa tu contraseña"
        />

        <TouchableOpacity
          onPress={handleLogin}
          style={[styles.loginButton, isLoading && { opacity: 0.6 }]}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          )}
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
