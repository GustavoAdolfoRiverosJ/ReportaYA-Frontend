# 📱 Servicios Frontend - Operador

**Actualizado:** 21 de noviembre de 2025  
**Status:** ✅ Sincronizado con Backend

---

## 👨‍💼 Operador - ServicioOperador

### Métodos disponibles

```typescript
// Obtener reportes para auditoría
obtenerReportesParaAuditoria(estado?: string, page?: number): Promise<Page<ReporteResponse>>

// Cerrar (APROBAR) un reporte
cerrarReporte(reporteId: number, operadorId: number, comentarioCierre: string): Promise<ReporteResponse>

// Rechazar un reporte con lógica inteligente
rechazarAudito(reporteId: number, operadorId: number, comentarioRechazo: string): Promise<ReporteResponse>
```

---

## 📊 Ejemplos de uso

### 1. Obtener reportes pendientes de auditoría

```typescript
import ServicioOperador from '../servicios/ServicioOperador';

try {
  const reportes = await ServicioOperador.obtenerReportesParaAuditoria('RESUELTA', 0);
  console.log(reportes.content); // Array de reportes
  console.log(reportes.totalElements); // Total de reportes
} catch (error) {
  console.error(error.message);
}
```

**Parámetros:**
- `estado` (opcional) - Estado del reporte. Default: 'RESUELTA'
- `page` (opcional) - Número de página. Default: 0

---

### 2. Cerrar (APROBAR) un reporte

```typescript
try {
  const resultado = await ServicioOperador.cerrarReporte(
    3,                                              // reporteId
    1,                                              // operadorId
    'Auditoría completada. Trabajo aprobado.'      // comentarioCierre
  );
  
  console.log(resultado.estado); // 'CERRADA'
  console.log(resultado.comentarioCierre); // Comentario guardado
} catch (error) {
  console.error(error.message);
}
```

**Cambio de estado:**
- RESUELTA → CERRADA ✅

---

### 3. Rechazar un reporte

```typescript
try {
  const resultado = await ServicioOperador.rechazarAudito(
    3,                                              // reporteId
    1,                                              // operadorId
    'Se requieren fotos adicionales del proceso'   // comentarioRechazo
  );
  
  console.log(resultado.estado); // 'RECHAZADO_AUDITO' o 'RECHAZADO'
  console.log(resultado.contadorRechazos); // Número de rechazos
} catch (error) {
  console.error(error.message);
}
```

**Lógica inteligente de cierre:**
- Si `contador < 3`: Estado → **RECHAZADO_AUDITO** (técnico puede reintentar)
- Si `contador >= 3`: Estado → **RECHAZADO** (cierre definitivo, sin reintentos)

---

## 🔗 Flujo de Auditoría del Operador

```
1. GET obtenerReportesParaAuditoria('RESUELTA', 0)
   ↓ Ver reportes completados por técnicos
   
2. Revisar detalles del reporte
   ↓
   ├─ Si APRUEBA:
   │  POST cerrarReporte(reporteId, operadorId, comentario)
   │  → Estado: CERRADA ✅
   │
   └─ Si RECHAZA:
      POST rechazarAudito(reporteId, operadorId, comentario)
      
      ├─ Si contador < 3:
      │  → Estado: RECHAZADO_AUDITO (técnico reintentar)
      │
      └─ Si contador >= 3:
         → Estado: RECHAZADO (cierre definitivo)
```

---

## 📋 Estados y Transiciones

| Estado | Descripción | Acción del Operador |
|--------|-------------|-------------------|
| **RESUELTA** | Completado por técnico | Cerrar o Rechazar |
| **CERRADA** | Aprobado | ✅ Finalizado |
| **RECHAZADO_AUDITO** | Rechazo temporal (reintentos disponibles) | Técnico reintentar |
| **RECHAZADO** | Rechazo definitivo (sin reintentos) | ❌ Finalizado |

---

## 🔐 Seguridad y Validaciones

**El servicio valida automáticamente:**
- ✓ El reporte existe
- ✓ El reporte está en estado RESUELTA
- ✓ El operador existe y es operador municipal
- ✓ Los parámetros no estén vacíos

**Errores comunes:**
```typescript
// Error: Reporte no en estado RESUELTA
"El reporte debe estar en estado RESUELTA para cerrar/rechazar"

// Error: Operador no válido
"Solo operadores municipales pueden auditar reportes"

// Error: Parámetros vacíos
"operadorId y comentario son requeridos"
```

---

## 💡 Implementación en componente React Native

```typescript
import { useState } from 'react';
import ServicioOperador from '../servicios/ServicioOperador';

export function AuditoriaScreen() {
  const [reportes, setReportes] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Cargar reportes para auditar
  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const datos = await ServicioOperador.obtenerReportesParaAuditoria('RESUELTA', 0);
        setReportes(datos.content);
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  // Aprobar un reporte
  const aprobar = async (reporteId) => {
    try {
      await ServicioOperador.cerrarReporte(
        reporteId,
        operadorId, // del contexto de auth
        'Aprobado después de auditoría'
      );
      // Recargar lista
      cargar();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Rechazar un reporte
  const rechazar = async (reporteId, comentario) => {
    try {
      const resultado = await ServicioOperador.rechazarAudito(
        reporteId,
        operadorId,
        comentario
      );
      
      if (resultado.estado === 'RECHAZADO') {
        Alert.alert('Cierre definitivo', 'Este reporte no puede ser reintentado');
      } else {
        Alert.alert('Rechazado', 'El técnico puede reintentar esta tarea');
      }
      
      // Recargar lista
      cargar();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    // Tu UI aquí
  );
}
```

---

## 📦 Integración con Context/Redux

Si usas contexto para almacenar reportes:

```typescript
// En OperadorReportesContext.ts
export const OperadorReportesContext = createContext();

export function OperadorReportesProvider({ children }) {
  const [reportes, setReportes] = useState([]);

  const cargarReportes = async (estado = 'RESUELTA', page = 0) => {
    const datos = await ServicioOperador.obtenerReportesParaAuditoria(estado, page);
    setReportes(datos);
  };

  const cerrar = async (reporteId, operadorId, comentario) => {
    const resultado = await ServicioOperador.cerrarReporte(reporteId, operadorId, comentario);
    cargarReportes(); // Refrescar
    return resultado;
  };

  const rechazar = async (reporteId, operadorId, comentario) => {
    const resultado = await ServicioOperador.rechazarAudito(reporteId, operadorId, comentario);
    cargarReportes(); // Refrescar
    return resultado;
  };

  return (
    <OperadorReportesContext.Provider value={{ reportes, cargarReportes, cerrar, rechazar }}>
      {children}
    </OperadorReportesContext.Provider>
  );
}
```

---

**Nota:** Los servicios de Técnico, Fotos y otros módulos serán implementados por otros desarrolladores.
