// src/screens/Auth/RegisterScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { styles } from '../../styles/RegisterScreen.styles';
import ServicioCuenta from '../../servicios/ServicioCuenta';
import { CrearCuentaRequest } from '../../types/cuenta.types';
import CustomToast from '../../components/CustomToast';

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
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    visible: false,
    message: '',
    type: 'success',
  });

  const navigation = useNavigation();

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ visible: true, message, type });
  };

  const updateForm = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validarFormulario = () => {
    const { usuario, nombres, apellidos, dni, telefono, correo, contrasena, repeticion } = form;

    if (!usuario || !nombres || !apellidos || !dni || !telefono || !correo || !contrasena || !repeticion) {
      showToast('Todos los campos son obligatorios', 'error');
      return false;
    }

    if (contrasena !== repeticion) {
      showToast('Las contraseñas no coinciden', 'error');
      return false;
    }

    if (contrasena.length < 6) {
      showToast('La contraseña debe tener al menos 6 caracteres', 'error');
      return false;
    }

    if (dni.length !== 8) {
      showToast('El DNI debe tener 8 dígitos', 'error');
      return false;
    }

    if (telefono.length < 9) {
      showToast('El teléfono debe tener al menos 9 dígitos', 'error');
      return false;
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      showToast('Ingresa un correo electrónico válido', 'error');
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

      showToast('¡Registro exitoso! Iniciando sesión...', 'success');
      
      setTimeout(() => {
        navigation.navigate('Login' as never);
      }, 2000);

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

      showToast(mensajeError, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#a27eff', '#6a9fff']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
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
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Nombres:</Text>
        <TextInput
          value={form.nombres}
          onChangeText={(value) => updateForm('nombres', value)}
          style={styles.input}
          placeholder="Tus nombres"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Apellidos:</Text>
        <TextInput
          value={form.apellidos}
          onChangeText={(value) => updateForm('apellidos', value)}
          style={styles.input}
          placeholder="Tus apellidos"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>DNI:</Text>
        <TextInput
          value={form.dni}
          onChangeText={(value) => updateForm('dni', value)}
          style={styles.input}
          keyboardType="numeric"
          maxLength={8}
          placeholder="12345678"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Teléfono:</Text>
        <TextInput
          value={form.telefono}
          onChangeText={(value) => updateForm('telefono', value)}
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="987654321"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Correo Electrónico:</Text>
        <TextInput
          value={form.correo}
          onChangeText={(value) => updateForm('correo', value)}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="tu@email.com"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Contraseña:</Text>
        <TextInput
          secureTextEntry
          value={form.contrasena}
          onChangeText={(value) => updateForm('contrasena', value)}
          style={styles.input}
          placeholder="Mínimo 6 caracteres"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Repite tu contraseña:</Text>
        <TextInput
          secureTextEntry
          value={form.repeticion}
          onChangeText={(value) => updateForm('repeticion', value)}
          style={styles.input}
          placeholder="Repite tu contraseña"
          placeholderTextColor="#999"
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
      </ScrollView>

      <CustomToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </LinearGradient>
  );
};

export default RegisterScreen;
