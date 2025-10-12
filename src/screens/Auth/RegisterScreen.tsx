// src/screens/Auth/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from '../../styles/RegisterScreen.styles';

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
    Alert.alert('Éxito', '¡Registro completado!');
    navigation.navigate('Login' as never);
  };

  return (
    <LinearGradient colors={['#a27eff', '#6a9fff']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>ReportaYA</Text>

      <View style={styles.card}>
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
            <Text style={styles.tab}>Iniciar Sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[styles.tab, styles.activeTab]}>Registrarse</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Nombres:</Text>
        <TextInput value={nombres} onChangeText={setNombres} style={styles.input} />

        <Text style={styles.label}>Apellidos:</Text>
        <TextInput value={apellidos} onChangeText={setApellidos} style={styles.input} />

        <Text style={styles.label}>Correo Electrónico:</Text>
        <TextInput value={correo} onChangeText={setCorreo} style={styles.input} keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.label}>Contraseña:</Text>
        <TextInput secureTextEntry value={contrasena} onChangeText={setContrasena} style={styles.input} />

        <Text style={styles.label}>Repite tu contraseña:</Text>
        <TextInput secureTextEntry value={repeticion} onChangeText={setRepeticion} style={styles.input} />

        <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default RegisterScreen;
