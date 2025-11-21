// src/screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from '../../styles/LoginScreen.styles';
import { useAuth } from '../../context/AuthContext';
import CustomToast from '../../components/CustomToast';

const LoginScreen = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    visible: false,
    message: '',
    type: 'success',
  });

  const navigation = useNavigation();
  const { login, usuario: usuarioAutenticado } = useAuth();

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ visible: true, message, type });
  };

  const handleLogin = async () => {
    if (!usuario || !password) {
      showToast('Todos los campos son obligatorios', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(usuario, password);

      console.log('Login exitoso, respuesta:', response);
      console.log('Usuario autenticado:', usuarioAutenticado);

      // Determinar a dónde navegar según el tipo de cuenta
      const getNavigationTarget = () => {
        if (response.tipoCuenta === 'OPERADOR_MUNICIPAL') {
          return 'HomeScreenOperador';
        }
        return 'MainTabs'; // CIUDADANO, TECNICO o por defecto
      };

      const navigationTarget = getNavigationTarget();
      console.log('Navegando a:', navigationTarget);

      showToast(response.message || '¡Inicio de sesión exitoso!', 'success');
      
      setTimeout(() => {
        navigation.navigate(navigationTarget as never);
      }, 1000);

    } catch (error: any) {
      console.error('Error en login:', error);
      showToast(error.message || 'Error al iniciar sesión', 'error');
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
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Contraseña:</Text>
        <TextInput
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholder="Ingresa tu contraseña"
          placeholderTextColor="#999"
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
          onPress={() => showToast('Función no implementada aún', 'info')}
          style={styles.forgotButton}
        >
          <Text style={styles.forgotButtonText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>

      <CustomToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </LinearGradient>
  );
};

export default LoginScreen;
