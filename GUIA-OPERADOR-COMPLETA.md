# 👨‍💼 Guía Completa: Frontend del Operador

**Actualizado:** 21 de noviembre de 2025

---

## 📁 Estructura de Carpetas del Operador

```
src/
├── screens/
│   ├── HomeScreenOperador/              ⭐ Pantalla principal del operador
│   │   ├── HomeScreenOperador.tsx       (componente UI)
│   │   └── HomeScreenOperador.controller.ts (lógica)
│   ├── GestionReportes/                 ⭐ Auditoría y gestión
│   │   ├── GestionReportes.tsx
│   │   └── GestionReportes.controller.ts
│   └── AsignacionTecnicos/              ⭐ Asignar técnicos
│       ├── AsignacionTecnicos.tsx
│       └── AsignacionTecnicos.controller.ts
├── context/
│   └── OperadorReportesContext.tsx      ⭐ Estado global del operador
├── servicios/
│   ├── ServicioOperador.ts              ⭐ Llamadas API operador
│   └── ServicioAsignaciones.ts          ⭐ Llamadas API asignaciones
├── navigation/
│   └── AppNavigator.tsx                 ⭐ Rutas de navegación
└── styles/
    └── (estilos compartidos)
```

---

## 🗺️ Rutas de Navegación del Operador

**Archivo:** `src/navigation/AppNavigator.tsx`

```typescript
// Stack de navegación del operador
HomeScreenOperador       → Pantalla principal (panel de bienvenida)
  ↓
GestionReportes        → Auditoría y aprobación de reportes
  ├─→ Cerrar reporte
  ├─→ Rechazar reporte
  └─→ Ver detalles
  
AsignacionTecnicos     → Asignar técnico a un reporte
```

### Parámetros de rutas

```typescript
type RootStackParamList = {
  HomeScreenOperador: undefined;
  GestionReportes: undefined;
  AsignacionTecnicos: { reporteId: number };  // Recibe ID del reporte
  Historial: { reporteId: number };           // Para ver historial
};
```

### Ejemplo: Navegar en el código

```typescript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

// Ir a gestión de reportes
navigation.navigate('GestionReportes');

// Ir a asignación pasando un parámetro
navigation.navigate('AsignacionTecnicos', { reporteId: 5 });

// Ir a historial
navigation.navigate('Historial', { reporteId: 5 });
```

---

## 🎨 Pantallas y Estilos del Operador

### 1️⃣ HomeScreenOperador (Pantalla Principal)

**Archivo:** `src/screens/HomeScreenOperador/HomeScreenOperador.tsx`

```typescript
// Interfaz visual
┌─────────────────────────────────┐
│ Panel de Operador        [Logout]│
│ Hola, Juan García              │
├─────────────────────────────────┤
│ ¿Qué deseas hacer hoy?          │
├─────────────────────────────────┤
│ 📄 Gestión de Reportes          │
│   Ver, asignar y gestionar...   │ → navegatoGestionReportes
├─────────────────────────────────┤
│                                 │
│ (más opciones en el futuro)     │
└─────────────────────────────────┘
```

**Estilos:**
- Gradiente: `#a27eff` → `#6a9fff` (púrpura a azul)
- Cards: Blanco con sombra
- Botones: Gradiente con sombra
- Icons: Ionicons (24-40px)

**Controller:** `HomeScreenOperador.controller.ts`
```typescript
const { 
  usuario,                      // Datos del operador logueado
  navigateToGestionReportes,   // Navega a GestionReportes
  handleLogout                 // Cierra sesión
} = useHomeScreenOperadorController();
```

---

### 2️⃣ GestionReportes (Auditoría y Aprobación)

**Archivo:** `src/screens/GestionReportes/GestionReportes.tsx`

```typescript
// Interfaz visual
┌─────────────────────────────────┐
│ Gestión de Reportes             │
├─────────────────────────────────┤
│ [RESUELTA] [CERRADA] [RECHAZOS] │  ← Tabs por estado
├─────────────────────────────────┤
│ Lista de reportes:              │
│                                 │
│ 1. Semáforo malogrado          │
│    👤 Juan García              │
│    📍 Av. Arequipa             │
│    [Ver] [Rechazar] [Aprobar]  │
│                                 │
│ 2. Bache en pista              │
│    ...                          │
└─────────────────────────────────┘
```

**Funcionalidades:**
- Ver lista de reportes en RESUELTA (pendientes de auditoría)
- Filtrar por estado
- Ver detalles de cada reporte
- Botones de acción:
  - ✅ **Cerrar** → ServicioOperador.cerrarReporte()
  - ❌ **Rechazar** → ServicioOperador.rechazarAudito()
  - 👁️ **Ver detalles**

**Controller:** `GestionReportes.controller.ts`
```typescript
const {
  reportes,                      // Lista de reportes
  cargando,                       // Estado de carga
  handleCerrar,                   // Cerrar/Aprobar
  handleRechazar,                 // Rechazar
  cargarReportes,                 // Refrescar lista
  operadorId                      // ID del operador
} = useGestionReportesController();
```

---

### 3️⃣ AsignacionTecnicos (Asignar Técnico)

**Archivo:** `src/screens/AsignacionTecnicos/AsignacionTecnicos.tsx`

```typescript
// Interfaz visual (modal o pantalla)
┌─────────────────────────────────┐
│ Asignar Técnico                 │
├─────────────────────────────────┤
│ Reporte:                        │
│ Semáforo malogrado              │
│ Prioridad: ALTA                 │
├─────────────────────────────────┤
│ Selecciona un técnico:          │
│                                 │
│ ☐ Juan García                   │
│ ☑ María López                   │
│ ☐ Carlos Rodríguez              │
│ ☐ Ana Martínez                  │
│                                 │
├─────────────────────────────────┤
│ [Cancelar] [Asignar]           │
└─────────────────────────────────┘
```

**Funcionalidades:**
- Lista de técnicos disponibles
- Seleccionar técnico
- Asignar con ServicioAsignaciones.crearAsignacion()

**Controller:** `AsignacionTecnicos.controller.ts`
```typescript
const {
  reporteId,                      // Del parámetro de ruta
  tecnicos,                       // Lista de técnicos
  tecnicoSeleccionado,            // Técnico seleccionado
  handleAsignar,                  // Confirmar asignación
  cargarTecnicos                  // Refrescar lista
} = useAsignacionController();
```

---

## 🎨 Estilos Compartidos del Operador

**Colores principales:**
```typescript
const colors = {
  gradient1: '#a27eff',   // Púrpura
  gradient2: '#6a9fff',   // Azul
  primary: '#a27eff',
  success: '#27AE60',     // Verde (cerrado)
  warning: '#F39C12',     // Naranja (pendiente)
  danger: '#E74C3C',      // Rojo (rechazado)
  white: '#FFFFFF',
  black: '#000000',
  gray: '#95a5a6',
  lightGray: '#ecf0f1'
};
```

**Estilos comunes:**
```typescript
// Card de reporte
cardStyle: {
  backgroundColor: 'white',
  borderRadius: 8,
  padding: 12,
  marginVertical: 8,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 3
}

// Botón gradiente
buttonStyle: {
  borderRadius: 8,
  paddingVertical: 12,
  paddingHorizontal: 20,
  justifyContent: 'center',
  alignItems: 'center'
}

// Texto de encabezado
headerText: {
  fontSize: 24,
  fontWeight: 'bold',
  color: 'white'
}
```

---

## 🔄 Contexto Global: OperadorReportesContext

**Archivo:** `src/context/OperadorReportesContext.tsx`

```typescript
// Estado global del operador
interface OperadorContextType {
  reportes: ReporteDTO[];
  cargando: boolean;
  cargarReportes: (estado?: string, page?: number) => Promise<void>;
  cerrar: (reporteId: number, comentario: string) => Promise<void>;
  rechazar: (reporteId: number, comentario: string) => Promise<void>;
  asignar: (reporteId: number, tecnicoId: number) => Promise<void>;
}
```

**Cómo usarlo en componentes:**
```typescript
import { useContext } from 'react';
import { OperadorContext } from '../context/OperadorReportesContext';

export function MiComponente() {
  const { reportes, cargando, cargarReportes, cerrar } = useContext(OperadorContext);
  
  useEffect(() => {
    cargarReportes('RESUELTA', 0);
  }, []);
  
  const aprobar = async (reporteId) => {
    await cerrar(reporteId, 'Aprobado');
    cargarReportes(); // Refrescar
  };
}
```

---

## 📡 Servicios API del Operador

**Archivo:** `src/servicios/ServicioOperador.ts`

```typescript
// Método 1: Obtener reportes para auditar
const reportes = await ServicioOperador.obtenerReportesParaAuditoria(
  'RESUELTA',  // estado
  0            // page
);

// Método 2: Cerrar (aprobar) un reporte
await ServicioOperador.cerrarReporte(
  3,                          // reporteId
  1,                          // operadorId
  'Auditoría aprobada'        // comentarioCierre
);

// Método 3: Rechazar un reporte
await ServicioOperador.rechazarAudito(
  3,                                    // reporteId
  1,                                    // operadorId
  'Se requieren fotos adicionales'      // comentarioRechazo
);
```

**Archivo:** `src/servicios/ServicioAsignaciones.ts`

```typescript
// Asignar técnico a reporte
await ServicioAsignaciones.crearAsignacion(
  5,  // reporteId
  1,  // operadorId
  2   // tecnicoId
);
```

---

## 🛠️ Configuración: Pasos para Personalizar

### Paso 1: Cambiar colores

**Ubicación:** `src/screens/HomeScreenOperador/HomeScreenOperador.tsx` (línea ~10)

```typescript
// Cambiar gradiente
<LinearGradient colors={['#a27eff', '#6a9fff']} style={styles.gradient}>
  {/* Cambiar a: ['#FF6B6B', '#4ECDC4'] para otros colores */}
</LinearGradient>
```

### Paso 2: Agregar más opciones al menú

**Ubicación:** `src/screens/HomeScreenOperador/HomeScreenOperador.tsx` (después del card de GestionReportes)

```typescript
<TouchableOpacity style={styles.menuCard} onPress={navigateToOtraOpcion}>
  <View style={styles.iconContainer}>
    <Ionicons name="settings-outline" size={40} color="#a27eff" />
  </View>
  <View style={styles.textContainer}>
    <Text style={styles.cardTitle}>Mi Opción</Text>
    <Text style={styles.cardDescription}>
      Descripción de la opción.
    </Text>
  </View>
  <Ionicons name="chevron-forward" size={24} color="#ccc" />
</TouchableOpacity>
```

### Paso 3: Agregar Tab de filtrado

**Ubicación:** `src/screens/GestionReportes/GestionReportes.tsx`

```typescript
// Agregar tabs para filtrar por estado
const estados = ['RESUELTA', 'CERRADA', 'RECHAZADO_AUDITO'];

{estados.map(estado => (
  <TouchableOpacity 
    key={estado}
    onPress={() => cargarReportes(estado, 0)}
    style={[
      styles.tab,
      estadoActivo === estado && styles.tabActivo
    ]}
  >
    <Text>{estado}</Text>
  </TouchableOpacity>
))}
```

### Paso 4: Cambiar estilos de un componente

**Ubicación:** Cualquier archivo `.tsx` del operador

```typescript
// Antes de los estilos, agregar customización
const styles = StyleSheet.create({
  // Cambiar tamaño de texto
  cardTitle: {
    fontSize: 18,      // Cambiar a 16 o 20
    fontWeight: 'bold',
    color: '#333'
  },
  
  // Cambiar color de fondo
  menuCard: {
    backgroundColor: '#FFFFFF',  // Cambiar color
    borderRadius: 12,            // Cambiar redondez
    padding: 16,
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  }
});
```

---

## 📱 Flujo Completo del Operador

```
1. Login (Auth/LoginScreen)
   ↓
2. HomeScreenOperador (Panel principal)
   ↓
3. Operador toca "Gestión de Reportes"
   ↓
4. GestionReportes (Lista de reportes RESUELTA)
   ↓ Operador selecciona un reporte
   ├─ Si toca "Cerrar": ServicioOperador.cerrarReporte()
   │  ↓ Estado: RESUELTA → CERRADA ✅
   │
   ├─ Si toca "Rechazar": ServicioOperador.rechazarAudito()
   │  ├─ Si contador < 3: RECHAZADO_AUDITO (técnico reintentar)
   │  └─ Si contador >= 3: RECHAZADO (definitivo)
   │
   └─ Si toca "Asignar": Navega a AsignacionTecnicos
      ↓ AsignacionTecnicos (Seleccionar técnico)
      ↓ ServicioAsignaciones.crearAsignacion()
      ↓ Reporte: CREADA → ASIGNADA → PROCESO
```

---

## ✅ Checklist de Implementación

- [ ] Revisar `AppNavigator.tsx` para entender las rutas
- [ ] Personalizar colores en `HomeScreenOperador.tsx`
- [ ] Agregar lógica en `GestionReportes.controller.ts`
- [ ] Conectar botones con los servicios:
  - [ ] Cerrar → `ServicioOperador.cerrarReporte()`
  - [ ] Rechazar → `ServicioOperador.rechazarAudito()`
  - [ ] Asignar → `ServicioAsignaciones.crearAsignacion()`
- [ ] Probar flujo completo

---

**Resumen:**
- 🎨 **Pantallas:** HomeScreenOperador, GestionReportes, AsignacionTecnicos
- 🎨 **Estilos:** Gradiente púrpura-azul, cards con sombra
- 🗺️ **Rutas:** AppNavigator.tsx
- 📡 **Servicios:** ServicioOperador + ServicioAsignaciones
- 🔄 **Estado:** OperadorReportesContext.tsx
