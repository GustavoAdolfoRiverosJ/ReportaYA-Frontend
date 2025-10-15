// src/screens/reportes/ReportScreen.controller.ts
import { Alert } from 'react-native';
import servicioReportes from '../../servicios/ServicioReportes';
import { CrearReporteRequest } from '../../types';

export interface ReportFormData {
  tipo: '' | 'infraestructura' | 'residuos' | 'otros';
  descripcion: string;
  ubicacion: { lat: number; lng: number } | null;
  imagen: string | null;
}

class ReportScreenController {
  /**
   * Enviar el reporte a la API
   * @param form - Datos del formulario
   * @returns Promise<boolean> - true si se envió correctamente, false si hubo error
   */
  async enviarReporte(form: ReportFormData): Promise<boolean> {
    try {
      // Validaciones
      if (!form.tipo || !form.ubicacion || form.descripcion.length < 10) {
        Alert.alert('Error', 'Por favor, completa todos los campos requeridos.');
        return false;
      }

      // Mapear el tipo a un título descriptivo
      const tituloMap = {
        infraestructura: 'Problema de infraestructura urbana',
        residuos: 'Acumulación de residuos',
        otros: 'Otro problema',
      };

      // Construir el objeto de reporte según la API
      const reporteData: CrearReporteRequest = {
        titulo: tituloMap[form.tipo] || 'Reporte sin especificar',
        descripcion: form.descripcion,
        cuentaId: 1, // Por ahora ID fijo para pruebas
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
      return true;
    } catch (error: any) {
      console.error('Error al enviar reporte:', error);
      Alert.alert('Error', error.message || 'No se pudo enviar el reporte. Intenta nuevamente.');
      return false;
    }
  }

  /**
   * Validar el formulario antes de enviar
   * @param form - Datos del formulario
   * @returns boolean - true si es válido, false si no
   */
  validarFormulario(form: ReportFormData): boolean {
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
  }
}

export default new ReportScreenController();
