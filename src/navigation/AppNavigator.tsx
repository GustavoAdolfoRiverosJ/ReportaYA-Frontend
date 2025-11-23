// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import ReportScreen from '../screens/reportes/ReportScreen';
import MapScreen from '../screens/Map/MapScreen';
import HomeScreenOperador from '../screens/HomeScreenOperador/HomeScreenOperador';
import HomeScreenTecnico from '../screens/HomeScreenTecnico/HomeScreenTecnico';
import GestionReportes from '../screens/GestionReportes/GestionReportes';
import TecnicoReportes from '../screens/TecnicoReportes/TecnicoReportes';
import AsignacionTecnicos from '../screens/AsignacionTecnicos/AsignacionTecnicos';
import AuditarReporte from '../screens/AuditarReporte/AuditarReporte';
import HistorialScreen from '../screens/Historial/HistorialScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  HomeScreenOperador: undefined;
  HomeScreenTecnico: undefined;
  GestionReportes: undefined;
  TecnicoReportes: undefined;
  AsignacionTecnicos: { reporteId: number };
  AuditarReporte: { reporteId: number };
  Historial: { reporteId: number };
};

type MainTabParamList = {
  Home: undefined;
  Map: undefined;
  Report: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Mis Reportes', tabBarIcon: ({ color }) => <Ionicons name="home" color={color} size={20} /> }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ title: 'Mapa', tabBarIcon: ({ color }) => <Ionicons name="map" color={color} size={20} /> }}
      />
      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{ title: 'Crear Reporte', tabBarIcon: ({ color }) => <Ionicons name="add-circle" color={color} size={24} /> }}
      />
    </Tab.Navigator>
  );
}

function AppNavigatorContent() {
  const { isAuthenticated, isLoading, usuario } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#a27eff" />
      </View>
    );
  }

  if (!isAuthenticated || !usuario) {
    return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }

  // Navegación condicional basada en el tipo de cuenta
  const getInitialRoute = () => {
    switch (usuario.tipoCuenta) {
      case 'OPERADOR_MUNICIPAL':
        return 'HomeScreenOperador';
      case 'TECNICO':
        return 'HomeScreenTecnico';
      case 'CIUDADANO':
      default:
        return 'MainTabs';
    }
  };

  return (
    <Stack.Navigator initialRouteName={getInitialRoute()}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="HomeScreenOperador" component={HomeScreenOperador} options={{ headerShown: false }} />
      <Stack.Screen name="HomeScreenTecnico" component={HomeScreenTecnico} options={{ headerShown: false }} />
      <Stack.Screen name="GestionReportes" component={GestionReportes} options={{ headerShown: false }} />
      <Stack.Screen name="TecnicoReportes" component={TecnicoReportes} options={{ headerShown: false }} />
      <Stack.Screen name="AsignacionTecnicos" component={AsignacionTecnicos} options={{ title: 'Asignar Técnico' }} />
      <Stack.Screen name="AuditarReporte" component={AuditarReporte} options={{ title: 'Auditar Reporte' }} />
      <Stack.Screen name="Historial" component={HistorialScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <AppNavigatorContent />
    </NavigationContainer>
  );
}