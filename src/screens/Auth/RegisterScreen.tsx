// src/screens/Auth/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StatusBar, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from '../../styles/RegisterScreen.styles';
import ServicioCuenta from '../../servicios/ServicioCuenta';
import { CrearCuentaRequest } from '../../types/cuenta.types';

const RegisterScreen = () => {
  const [form, setForm] = useState({
    usuario: '',
    nombres: '',
    apellidos: '',
    dni: '',
    telefono: '',
    correo: '',
    contrasena: '',
    repeticion: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validarFormulario = () => {
    const { usuario, nombres, apellidos, dni, telefono, correo, contrasena, repeticion } = form;

    if (!usuario || !nombres || !apellidos || !dni || !telefono || !correo || !contrasena || !repeticion) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return false;
    }

    if (contrasena !== repeticion) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }

    if (contrasena.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (dni.length !== 8) {
      Alert.alert('Error', 'El DNI debe tener 8 dígitos');
      return false;
    }

    if (telefono.length < 9) {
      Alert.alert('Error', 'El teléfono debe tener al menos 9 dígitos');
      return false;
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      Alert.alert('Error', 'Ingresa un correo electrónico válido');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validarFormulario()) return;

    setIsLoading(true);

    try {
      const cuentaData: CrearCuentaRequest = {
        tipoCuenta: 'CIUDADANO',
        usuario: form.usuario,
        contrasena: form.contrasena,
        nombres: form.nombres,
        apellidos: form.apellidos,
        dni: form.dni,
        telefono: form.telefono,
        correo: form.correo,
        activo: true
      };

      const response = await ServicioCuenta.crearCuenta(cuentaData);

      console.log('Cuenta creada exitosamente:', response);

      Alert.alert(
        '¡Registro exitoso!',
        'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login' as never) }]
      );

    } catch (error: any) {
      console.error('Error en registro:', error);

      let mensajeError = 'No se pudo completar el registro.';

      if (error.message.includes('usuario')) {
        mensajeError = 'El nombre de usuario ya está en uso.';
      } else if (error.message.includes('correo')) {
        mensajeError = 'El correo electrónico ya está registrado.';
      } else if (error.message.includes('dni')) {
        mensajeError = 'El DNI ya está registrado.';
      } else if (error.message.includes('telefono')) {
        mensajeError = 'El número de teléfono ya está registrado.';
      }

      Alert.alert('Error en el registro', mensajeError);
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
          <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
            <Text style={styles.tab}>Iniciar Sesión</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[styles.tab, styles.activeTab]}>Registrarse</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Usuario:</Text>
        <TextInput
          value={form.usuario}
          onChangeText={(value) => updateForm('usuario', value)}
          style={styles.input}
          autoCapitalize="none"
          placeholder="Nombre de usuario único"
        />

        <Text style={styles.label}>Nombres:</Text>
        <TextInput
          value={form.nombres}
          onChangeText={(value) => updateForm('nombres', value)}
          style={styles.input}
          placeholder="Tus nombres"
        />

        <Text style={styles.label}>Apellidos:</Text>
        <TextInput
          value={form.apellidos}
          onChangeText={(value) => updateForm('apellidos', value)}
          style={styles.input}
          placeholder="Tus apellidos"
        />

        <Text style={styles.label}>DNI:</Text>
        <TextInput
          value={form.dni}
          onChangeText={(value) => updateForm('dni', value)}
          style={styles.input}
          keyboardType="numeric"
          maxLength={8}
          placeholder="12345678"
        />

        <Text style={styles.label}>Teléfono:</Text>
        <TextInput
          value={form.telefono}
          onChangeText={(value) => updateForm('telefono', value)}
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="987654321"
        />

        <Text style={styles.label}>Correo Electrónico:</Text>
        <TextInput
          value={form.correo}
          onChangeText={(value) => updateForm('correo', value)}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="tu@email.com"
        />

        <Text style={styles.label}>Contraseña:</Text>
        <TextInput
          secureTextEntry
          value={form.contrasena}
          onChangeText={(value) => updateForm('contrasena', value)}
          style={styles.input}
          placeholder="Mínimo 6 caracteres"
        />

        <Text style={styles.label}>Repite tu contraseña:</Text>
        <TextInput
          secureTextEntry
          value={form.repeticion}
          onChangeText={(value) => updateForm('repeticion', value)}
          style={styles.input}
          placeholder="Repite tu contraseña"
        />

        <TouchableOpacity
          onPress={handleRegister}
          style={[styles.registerButton, isLoading && { opacity: 0.6 }]}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.registerButtonText}>Registrarse</Text>
          )}
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default RegisterScreen;
