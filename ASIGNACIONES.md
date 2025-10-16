# Servicio de Asignaciones - Sistema de Triaje

## 📝 ¿Qué es el Sistema de Asignaciones?

El sistema de asignaciones permite que los **operadores municipales** asignen **técnicos** a los reportes que están en estado **"REVISIÓN"**. Este proceso se conoce como **"triaje"**.

## 🎯 Flujo de Asignación

```
Reporte creado por Ciudadano
        ↓
Estado: PENDIENTE
        ↓
Operador Municipal lo revisa
        ↓
Estado: REVISIÓN
        ↓
Operador asigna Técnico → Estado: PROCESO
        ↓
Técnico resuelve el reporte
        ↓
Estado: RESUELTO
```

## 📊 Estados del Reporte

- **PENDIENTE**: Reporte recién creado
- **REVISIÓN**: Operador está evaluando el reporte
- **PROCESO**: Técnico asignado está trabajando
- **RESUELTO**: Reporte completado

## 🔧 API de Asignaciones

### Crear Asignación
```typescript
POST /api/asignaciones

// Request
{
  "reporteId": 1,
  "operadorId": 2,
  "tecnicoId": 3
}

// Response
{
  "id": 1,
  "reporteId": 1,
  "operadorId": 2,
  "tecnicoId": 3,
  "reporteTitulo": "Problema de infraestructura urbana",
  "operadorNombre": "Juan Pérez García",
  "tecnicoNombre": "María López Rodríguez",
  "fechaAsignacion": "2025-10-15T14:30:00",
  "fechaCierre": null
}
```

## 🎯 Validaciones del Backend

### ✅ Validaciones Requeridas
- **Reporte existe**: El reporte con `reporteId` debe existir
- **Estado del reporte**: Debe estar en `REVISION`
- **Operador válido**: El `operadorId` debe corresponder a un OperadorMunicipal
- **Técnico válido**: El `tecnicoId` debe corresponder a un Tecnico

### ❌ Validaciones de Error
- Si el reporte no existe: `"Reporte no encontrado con id: {id}"`
- Si el estado no es REVISIÓN: `"El reporte debe estar en estado REVISION..."`
- Si el operador no es válido: `"El usuario con id {id} no es un operador municipal"`
- Si el técnico no es válido: `"El usuario con id {id} no es un técnico"`

## 🔄 Lógica de Asignación

### Asignación Única Activa
- **Solo puede haber UNA asignación activa por reporte**
- Si ya existe una asignación activa, se **cierra automáticamente**
- Se crea la nueva asignación con el técnico asignado

### Cambio de Estado Automático
- Al crear la asignación, el reporte cambia automáticamente a estado **PROCESO**
- La asignación queda registrada en el historial del reporte

## 📱 Uso en Frontend

### Importar el Servicio
```typescript
import ServicioAsignaciones from '../servicios/ServicioAsignaciones';
```

### Crear Asignación
```typescript
const asignacionData = {
  reporteId: 1,
  operadorId: 2,  // ID del operador municipal actual
  tecnicoId: 3    // ID del técnico seleccionado
};

try {
  const asignacionCreada = await ServicioAsignaciones.crearAsignacion(asignacionData);
  console.log('Asignación creada:', asignacionCreada);
} catch (error) {
  console.error('Error:', error.message);
}
```

## 🎨 Tipos TypeScript

### CrearAsignacionRequest
```typescript
interface CrearAsignacionRequest {
  reporteId: number;    // ID del reporte a asignar
  operadorId: number;   // ID del operador que asigna
  tecnicoId: number;    // ID del técnico asignado
}
```

### AsignacionResponse
```typescript
interface AsignacionResponse {
  id: number;
  reporteId: number;
  operadorId: number;
  tecnicoId: number;
  reporteTitulo: string;      // Título del reporte
  operadorNombre: string;     // Nombre completo del operador
  tecnicoNombre: string;      // Nombre completo del técnico
  fechaAsignacion: string;    // Fecha de creación (ISO 8601)
  fechaCierre?: string;       // Fecha de cierre (null si activa)
}
```

## 🔐 Permisos y Seguridad

### Quién puede crear asignaciones
- **Solo Operadores Municipales**
- Deben estar autenticados
- Solo pueden asignar reportes en estado REVISIÓN

### Validación de Roles
- El backend valida que el `operadorId` corresponda a una cuenta de tipo `OPERADOR_MUNICIPAL`
- El backend valida que el `tecnicoId` corresponda a una cuenta de tipo `TECNICO`

## 📋 Consideraciones de UI/UX

### Pantalla de Triaje (para Operadores)
- Lista de reportes en estado **REVISIÓN**
- Selector de técnico disponible
- Botón "Asignar Técnico"
- Confirmación de asignación exitosa

### Estados Visuales
- **Badge verde**: Reporte asignado correctamente
- **Badge amarillo**: Reporte en proceso
- **Badge rojo**: Error en asignación

### Feedback al Usuario
- **Éxito**: "Técnico asignado correctamente al reporte"
- **Error**: Mensaje específico del backend
- **Loading**: Spinner durante la asignación

## 🔄 Integración con Context

Si quieres actualizar el contexto de reportes después de una asignación:

```typescript
import { useReportes } from '../context/ReportesContext';

// En el componente
const { actualizarReporte } = useReportes();

// Después de crear asignación
const asignacion = await ServicioAsignaciones.crearAsignacion(datos);

// Actualizar el reporte en memoria (cambiará estado a PROCESO)
actualizarReporte({
  ...reporteExistente,
  estado: 'PROCESO'
});
```

## 🚀 Próximos Pasos

Para completar el sistema de triaje, necesitarías:

1. **Pantalla de Operador**: Para que los operadores municipales vean reportes en REVISIÓN
2. **Selector de Técnicos**: Lista de técnicos disponibles
3. **Historial de Asignaciones**: Ver asignaciones pasadas de un reporte
4. **Reasignación**: Permitir cambiar de técnico si es necesario
5. **Cierre de Asignación**: Cuando el técnico completa el trabajo

¿Te gustaría que implemente alguna de estas funcionalidades?