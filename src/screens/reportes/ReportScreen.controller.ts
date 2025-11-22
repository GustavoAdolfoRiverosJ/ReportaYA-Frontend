// src/screens/reportes/ReportScreen.controller.ts
import { useCallback } from 'react';
import { Alert } from 'react-native';
import servicioReportes from '../../servicios/ServicioReportes';
import { CrearReporteRequest, ReporteResponse } from '../../types/index';
import { useAuth } from '../../context/AuthContext';

export interface ReportFormData {
  tipo: '' | 'infraestructura' | 'residuos' | 'otros';
  descripcion: string;
  ubicacion: { lat: number; lng: number } | null;
  imagen: string | null;
}

export const useReportController = () => {
  const { usuario } = useAuth();

  /**
   * Enviar el reporte a la API
   * @param form - Datos del formulario
   * @param agregarReporteCallback - Callback para agregar el reporte al contexto
   * @returns Promise<ReporteResponse | null> - El reporte creado o null si hubo error
   */
  const enviarReporte = useCallback(async (
    form: ReportFormData,
    agregarReporteCallback?: (reporte: ReporteResponse) => void
  ): Promise<ReporteResponse | null> => {
    try {
      // Validaciones
      if (!form.tipo || !form.ubicacion || form.descripcion.length < 10) {
        Alert.alert('Error', 'Por favor, completa todos los campos requeridos.');
        return null;
      }

      if (!usuario?.id) {
        console.error('Usuario no autenticado:', { usuario, id: usuario?.id });
        Alert.alert('Error', 'Usuario no autenticado. Por favor, inicia sesión nuevamente.');
        return null;
      }

      console.log('Creando reporte con usuario ID:', usuario.id);

      // Mapear el tipo a un título descriptivo
      const tituloMap = {
        infraestructura: 'Problema de infraestructura urbana',
        residuos: 'Acumulación de residuos',
        otros: 'Otro problema',
      };

      // Mapear el tipo local al enum del backend
      const tipoProblemaMap = {
        infraestructura: 'INFRAESTRUCTURA',
        residuos: 'RESIDUOS',
        otros: 'OTROS',
      } as const;

      // Construir el objeto de reporte según la API
      const reporteData: CrearReporteRequest = {
        titulo: tituloMap[form.tipo] || 'Reporte sin especificar',
        descripcion: form.descripcion,
        cuentaId: usuario.id, // Usar ID del usuario autenticado
        tipoProblema: tipoProblemaMap[form.tipo] as any, // Enviar el tipo de problema
        ubicacion: {
          latitud: form.ubicacion.lat,
          longitud: form.ubicacion.lng,
          direccion: undefined, // Opcional, se puede omitir
        },
        // prioridad: 'MEDIA', // Opcional - El backend asigna MEDIA por defecto
      };

      // Llamar al servicio para crear el reporte
      const respuesta = await servicioReportes.crearReporte(reporteData);

      console.log('Reporte creado exitosamente:', respuesta);

      // ✨ Agregar el reporte al contexto para que aparezca en HomeScreen
      if (agregarReporteCallback) {
        agregarReporteCallback(respuesta);
      }

      return respuesta;
    } catch (error: any) {
      console.error('Error al enviar reporte:', error);
      Alert.alert('Error', error.message || 'No se pudo enviar el reporte. Intenta nuevamente.');
      return null;
    }
  }, [usuario?.id]);

  /**
   * Validar el formulario antes de enviar
   * @param form - Datos del formulario
   * @returns boolean - true si es válido, false si no
   */
  const validarFormulario = useCallback((form: ReportFormData): boolean => {
    if (!form.tipo) {
      Alert.alert('Error', 'Por favor, selecciona un tipo de problema.');
      return false;
    }

    if (!form.ubicacion) {
      Alert.alert('Error', 'Por favor, obtén tu ubicación.');
      return false;
    }

    if (form.descripcion.length < 10) {
      Alert.alert('Error', 'La descripción debe tener al menos 10 caracteres.');
      return false;
    }

    return true;
  }, []);

  return {
    enviarReporte,
    validarFormulario,
    usuarioId: usuario?.id,
    usuarioAutenticado: !!usuario,
  };
};
