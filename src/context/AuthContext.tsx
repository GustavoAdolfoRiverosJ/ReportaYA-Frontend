// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import ServicioAuth from '../servicios/ServicioAuth';
import ServicioNotificaciones from '../servicios/ServicioNotificaciones';
import { UsuarioAutenticado, AuthState, AuthContextType, AuthLoginResponse } from '../types/auth.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = '@auth_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  const [estado, setEstado] = useState<AuthState>(AuthState.CHECKING);

  // Verificar autenticación al iniciar la app
  useEffect(() => {
    verificarAutenticacionInicial();
  }, []);

  const registrarTokenFCM = async (cuentaId: number) => {
    try {
      // Solicitar permisos (iOS)
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        // Obtener el token
        const token = await messaging().getToken();
        console.log('FCM Token:', token);

        // Registrar en el backend
        await ServicioNotificaciones.registrarToken({
          cuentaId,
          token
        });
        console.log('Token FCM registrado en backend');
      } else {
        console.log('Permiso de notificaciones denegado');
      }
    } catch (error) {
      console.error('Error al registrar token FCM:', error);
    }
  };

  const verificarAutenticacionInicial = async () => {
    try {
      setEstado(AuthState.CHECKING);

      // Intentar cargar datos del usuario desde AsyncStorage
      const userData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);

      if (userData) {
        const user: UsuarioAutenticado = JSON.parse(userData);

        // Convertir loginTime de string a Date si es necesario
        if (typeof user.loginTime === 'string') {
          user.loginTime = new Date(user.loginTime);
        }

        // Verificar si el login no ha expirado (ejemplo: 24 horas)
        const ahora = new Date();
        const tiempoLogin = user.loginTime;
        const horasTranscurridas = (ahora.getTime() - tiempoLogin.getTime()) / (1000 * 60 * 60);

        if (horasTranscurridas < 24) {
          setUsuario(user);
          setEstado(AuthState.AUTHENTICATED);
          console.log('Usuario cargado desde AsyncStorage:', {
            id: user.id,
            usuario: user.usuario,
            nombre: user.nombre,
            tipoCuenta: user.tipoCuenta
          });
          
          // Registrar token en segundo plano
          registrarTokenFCM(user.id);
          return;
        } else {
          // Login expirado, limpiar datos
          await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
          console.log('Login expirado, datos limpiados');
        }
      }

      setEstado(AuthState.UNAUTHENTICATED);
    } catch (error) {
      console.error('Error al verificar autenticación inicial:', error);
      setEstado(AuthState.UNAUTHENTICATED);
    }
  };

  const login = useCallback(async (usuarioInput: string, password: string): Promise<AuthLoginResponse> => {
    try {
      setEstado(AuthState.CHECKING);

      // Llamar al servicio de autenticación
      const response = await ServicioAuth.login(usuarioInput, password);

      // Crear objeto de usuario autenticado
      const usuarioAutenticado: UsuarioAutenticado = {
        id: response.cuentaId,        // Cambiado de response.id
        usuario: response.usuario,
        nombre: response.nombreCompleto, // Cambiado de response.nombre
        tipoCuenta: response.tipoCuenta,  // Nuevo campo
        loginTime: new Date()
      };

      // Guardar en estado y AsyncStorage
      setUsuario(usuarioAutenticado);
      setEstado(AuthState.AUTHENTICATED);

      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        ...usuarioAutenticado,
        loginTime: usuarioAutenticado.loginTime.toISOString() // Convertir Date a string para JSON
      }));

      console.log('Usuario autenticado y guardado:', {
        id: usuarioAutenticado.id,
        usuario: usuarioAutenticado.usuario,
        nombre: usuarioAutenticado.nombre,
        tipoCuenta: usuarioAutenticado.tipoCuenta
      });

      // Registrar token FCM
      registrarTokenFCM(usuarioAutenticado.id);

      return response;

    } catch (error) {
      setEstado(AuthState.UNAUTHENTICATED);
      throw error; // Re-lanzar el error para que lo maneje el componente
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Limpiar estado
      setUsuario(null);
      setEstado(AuthState.UNAUTHENTICATED);

      // Limpiar AsyncStorage
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);

      console.log('Usuario desconectado exitosamente');
    } catch (error) {
      console.error('Error al hacer logout:', error);
    }
  }, []);

  const value: AuthContextType = {
    usuario,
    estado,
    login,
    logout,
    isAuthenticated: estado === AuthState.AUTHENTICATED,
    isLoading: estado === AuthState.CHECKING,
    // Helpers para roles
    isCiudadano: usuario?.tipoCuenta === 'CIUDADANO',
    isTecnico: usuario?.tipoCuenta === 'TECNICO',
    isOperador: usuario?.tipoCuenta === 'OPERADOR_MUNICIPAL',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};