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
import HomeScreenOperador from '../screens/HomeScreenOperador/HomeScreenOperador';
import GestionReportes from '../screens/GestionReportes/GestionReportes';
import AsignacionTecnicos from '../screens/AsignacionTecnicos/AsignacionTecnicos';
import HistorialScreen from '../screens/Historial/HistorialScreen';
import MapScreen from '../screens/Home/MapScreen';
import ReportDetailScreen from '../screens/reportes/ReportDetailScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  HomeScreenOperador: undefined;
  GestionReportes: undefined;
  AsignacionTecnicos: undefined;
  Historial: undefined;
  ReportDetail: { reporteId: number };
};

export type MainTabParamList = {
  Home: undefined;
  Reportar: undefined;
  Mapa: undefined;
  Historial: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Reportar') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Mapa') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Historial') {
            iconName = focused ? 'time' : 'time-outline';
          }

          return <Ionicons name={iconName as string} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6a9fff',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Reportar" component={ReportScreen} options={{ title: 'Nuevo Reporte' }} />
      <Tab.Screen name="Mapa" component={MapScreen} options={{ title: 'Mapa de Reportes' }} />
      <Tab.Screen name="Historial" component={HistorialScreen} options={{ title: 'Mis Reportes' }} />
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

  const getInitialRoute = () => {
    switch (usuario.tipoCuenta) {
      case 'OPERADOR_MUNICIPAL':
        return 'HomeScreenOperador';
      case 'TECNICO':
        return 'MainTabs';
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
      <Stack.Screen name="GestionReportes" component={GestionReportes} options={{ headerShown: false }} />
      <Stack.Screen name="AsignacionTecnicos" component={AsignacionTecnicos} options={{ title: 'Asignar Técnico' }} />
      <Stack.Screen name="Historial" component={HistorialScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} options={{ title: 'Detalle de Reporte' }} />
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