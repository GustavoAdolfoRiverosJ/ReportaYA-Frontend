# Context de Reportes - Caché en Memoria con Paginación

## 📝 ¿Cómo funciona?

El `ReportesContext` mantiene los reportes en memoria durante toda la sesión de la app con soporte para **paginación infinita**. Esto significa:

### ✅ Ventajas
- **Primera carga**: Se hace la petición HTTP de la página 0
- **Navegaciones posteriores**: Usa los datos en memoria (NO hace petición)
- **Paginación infinita**: Al llegar al final, carga automáticamente la siguiente página
- **Más rápido**: La pantalla carga instantáneamente
- **Menos consumo de datos**: Solo carga cuando es necesario

### 🔄 Control de recarga

#### Carga Automática (sin petición si ya hay datos)
```typescript
// En HomeScreen.controller.ts
cargarReportes(1); // Solo carga si no hay datos en memoria
```

#### Forzar Recarga (pull-to-refresh)
```typescript
// En HomeScreen.tsx - Pull to refresh
cargarReportes(1, true); // Fuerza nueva petición HTTP
```

#### Carga Infinita (al llegar al final)
```typescript
// En HomeScreen.tsx - FlatList onEndReached
cargarMasReportes(); // Carga la siguiente página automáticamente
```

## 🎯 Funciones disponibles

### `cargarReportes(cuentaId, forzarRecarga?)`
- **cuentaId**: ID de la cuenta del usuario
- **forzarRecarga**: `true` para forzar petición HTTP, `false` para usar caché

### `cargarMasReportes(cuentaId)`
- Carga la siguiente página de reportes y la agrega a la lista existente
- Solo funciona si `hasMorePages` es `true`

### `agregarReporte(reporte)`
Agrega un nuevo reporte a la lista en memoria (útil después de crear uno)

### `actualizarReporte(reporte)`
Actualiza un reporte existente en la lista (útil después de editar)

### `limpiarReportes()`
Limpia toda la caché (útil al hacer logout)

## 📍 Estados disponibles

### `currentPage`
- Página actual cargada (0-indexed)

### `hasMorePages`
- `true` si hay más páginas disponibles
- `false` si ya se cargaron todas las páginas

## 🎓 Patrón Usado

Este es el patrón **"Infinite Scroll with Cache"**:
- **Primera carga**: Página 0 desde backend
- **Scroll al final**: Carga página 1, 2, 3... automáticamente
- **Pull-to-refresh**: Reinicia desde página 0
- **Creación**: Agrega al inicio de la lista sin recargar

## 🔍 Ejemplo de uso completo

```typescript
// Crear un reporte nuevo
const nuevoReporte = await ServicioReportes.crearReporte(datos);
agregarReporte(nuevoReporte); // Lo agrega al inicio sin recargar

// Actualizar un reporte
const reporteActualizado = await ServicioReportes.actualizarReporte(id, datos);
actualizarReporte(reporteActualizado); // Lo actualiza en memoria

// Forzar recarga completa
cargarReportes(cuentaId, true); // Reinicia paginación desde página 0

// Carga infinita automática
// Se ejecuta automáticamente cuando el usuario llega al final de la lista
cargarMasReportes(cuentaId); // Carga siguiente página
```

## 💡 Funcionalidades UI

### Pull-to-refresh
- Desliza hacia abajo para recargar desde la página 0
- Reinicia toda la paginación

### Infinite Scroll
- Al llegar al 50% del final de la lista, carga automáticamente la siguiente página
- Muestra indicador de carga mientras carga más reportes

### Estados de carga
- **Primera carga**: Spinner grande centrado
- **Carga de más páginas**: Spinner pequeño al final de la lista
- **Error**: Mensaje de error con opción de reintentar

## 🔒 Cuándo se limpia la caché

- **Al cerrar la app**: Se pierde (memoria volátil)
- **Al hacer logout**: Llamar manualmente a `limpiarReportes()`
- **Nunca se limpia automáticamente** durante la sesión

## 📊 Estructura de datos paginados

```typescript
interface Page<T> {
  content: T[];           // Array de reportes
  totalPages: number;     // Total de páginas disponibles
  totalElements: number;  // Total de elementos en todas las páginas
  number: number;         // Página actual (0-indexed)
  size: number;           // Tamaño de página (10 por defecto)
  first: boolean;         // Es la primera página
  last: boolean;          // Es la última página
}
```

## 🚀 Beneficios de la paginación

### ✅ Rendimiento
- No carga todos los reportes de una vez
- Solo carga lo necesario para mostrar

### ✅ UX Mejorada
- Scroll infinito natural
- No hay botones "Cargar más"
- Pull-to-refresh intuitivo

### ✅ Escalabilidad
- Funciona bien con miles de reportes
- Backend puede optimizar consultas paginadas

### ✅ Consistencia
- Los reportes nuevos aparecen al inicio
- Los reportes actualizados se reflejan inmediatamente
- Sin conflictos entre páginas