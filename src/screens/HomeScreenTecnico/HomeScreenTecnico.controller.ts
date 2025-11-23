// src/screens/HomeScreenTecnico/HomeScreenTecnico.controller.ts
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { Alert } from 'react-native';

export const useHomeScreenTecnicoController = () => {
  const navigation = useNavigation();
  const { usuario, logout } = useAuth();

  const navigateToReportes = () => {
    (navigation as any).navigate('TecnicoReportes');
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
    navigateToReportes,
    handleLogout
  };
};
