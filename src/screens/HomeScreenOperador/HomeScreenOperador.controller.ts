// src/screens/HomeScreenOperador/HomeScreenOperador.controller.ts
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { Alert } from 'react-native';

export const useHomeScreenOperadorController = () => {
  const navigation = useNavigation();
  const { usuario, logout } = useAuth();

  const navigateToGestionReportes = () => {
    (navigation as any).navigate('GestionReportes');
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', style: 'destructive', onPress: logout }
      ]
    );
  };

  return {
    usuario,
    navigateToGestionReportes,
    handleLogout
  };
};