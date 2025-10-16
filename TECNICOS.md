# Servicio de Técnicos - Gestión de Personal Técnico

## 📝 ¿Qué son los Técnicos?

Los **técnicos** son el personal especializado que resuelve los reportes asignados por los operadores municipales. Son usuarios del sistema con rol específico para atender incidencias urbanas.

## 🎯 Funcionalidad Principal

### Listar Técnicos
```typescript
GET /api/tecnicos?page=0
```

**Respuesta paginada:**
```json
{
  "content": [
    {
      "id": 1,
      "usuario": "mtecnico",
      "nombres": "María",
      "apellidos": "López Rodríguez",
      "dni": "87654321",
      "telefono": "987654321",
      "correo": "maria.lopez@email.com",
      "activo": true
    }
  ],
  "totalPages": 1,
  "totalElements": 1,
  "number": 0,
  "size": 10,
  "first": true,
  "last": true
}
```

## 🔧 API de Técnicos

### Obtener Todos los Técnicos
```typescript
GET /api/tecnicos?page={numero_pagina}
```

**Parámetros:**
- `page`: Número de página (0-indexed, por defecto 0)

**Respuesta:** `Page<TecnicoDTO>` con 10 técnicos por página

## 📊 Estructura del TecnicoDTO

```typescript
interface TecnicoResponse {
  id: number;           // ID único del técnico
  usuario: string;      // Nombre de usuario para login
  nombres: string;      // Nombres del técnico
  apellidos: string;    // Apellidos del técnico
  dni: string;          // Documento Nacional de Identidad
  telefono: string;     // Número de teléfono
  correo: string;       // Correo electrónico
  activo: boolean;      // Estado del técnico (activo/inactivo)
}
```

## 🎨 Uso en Frontend

### Importar el Servicio
```typescript
import ServicioTecnicos from '../servicios/ServicioTecnicos';
import { TecnicoResponse, Page } from '../types';
```

### Obtener Técnicos Paginados
```typescript
const cargarTecnicos = async (pagina: number = 0) => {
  try {
    const paginaTecnicos: Page<TecnicoResponse> = await ServicioTecnicos.obtenerTodosTecnicos(pagina);

    console.log('Técnicos cargados:', paginaTecnicos.content);
    console.log('Página actual:', paginaTecnicos.number);
    console.log('Total de páginas:', paginaTecnicos.totalPages);
    console.log('¿Es la última página?', paginaTecnicos.last);

    return paginaTecnicos;
  } catch (error) {
    console.error('Error al cargar técnicos:', error.message);
  }
};
```

### Cargar Primera Página
```typescript
const tecnicos = await ServicioTecnicos.obtenerTodosTecnicos(0);
```

### Cargar Página Específica
```typescript
const tecnicosPagina2 = await ServicioTecnicos.obtenerTodosTecnicos(2);
```

## 🔄 Integración con Selector de Técnicos

Para usar en un selector de técnicos (por ejemplo, en la pantalla de asignación):

```typescript
import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import ServicioTecnicos from '../servicios/ServicioTecnicos';
import { TecnicoResponse } from '../types';

const SelectorTecnico = () => {
  const [tecnicos, setTecnicos] = useState<TecnicoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [tecnicoSeleccionado, setTecnicoSeleccionado] = useState<string>('');

  useEffect(() => {
    cargarTecnicos();
  }, []);

  const cargarTecnicos = async () => {
    try {
      const pagina = await ServicioTecnicos.obtenerTodosTecnicos(0);
      // Filtrar solo técnicos activos
      const tecnicosActivos = pagina.content.filter(tecnico => tecnico.activo);
      setTecnicos(tecnicosActivos);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Text>Cargando técnicos...</Text>;
  }

  return (
    <Picker
      selectedValue={tecnicoSeleccionado}
      onValueChange={(value) => setTecnicoSeleccionado(value)}
    >
      <Picker.Item label="Seleccionar técnico..." value="" />
      {tecnicos.map(tecnico => (
        <Picker.Item
          key={tecnico.id}
          label={`${tecnico.nombres} ${tecnico.apellidos}`}
          value={tecnico.id.toString()}
        />
      ))}
    </Picker>
  );
};
```

## 📋 Campos del Técnico

### Información Personal
- **Nombres y Apellidos**: Identificación completa
- **DNI**: Documento de identidad único
- **Teléfono**: Contacto directo
- **Correo**: Comunicación oficial

### Información de Sistema
- **Usuario**: Para autenticación en la app
- **Activo**: Control de acceso (solo técnicos activos pueden ser asignados)

## 🔐 Permisos y Seguridad

### Quién puede ver técnicos
- **Operadores Municipales**: Para asignar técnicos a reportes
- **Administradores**: Para gestión completa
- **Técnicos**: Solo pueden ver su propia información

### Filtros Automáticos
- El servicio retorna **solo técnicos activos** por defecto
- Técnicos inactivos no aparecen en selectores

## 🎯 Casos de Uso

### 1. Pantalla de Asignación (Operador Municipal)
```typescript
// Cargar lista de técnicos disponibles
const tecnicosDisponibles = await ServicioTecnicos.obtenerTodosTecnicos(0);

// Mostrar en un dropdown/selector
// Usuario selecciona técnico → Crear asignación
```

### 2. Gestión de Personal (Administrador)
```typescript
// Ver todos los técnicos (activos e inactivos)
const todosTecnicos = await ServicioTecnicos.obtenerTodosTecnicos(0);

// Mostrar en tabla con filtros
// Activar/desactivar técnicos
```

### 3. Perfil de Técnico
```typescript
// Técnico ve su propia información
const miPerfil = await ServicioTecnicos.obtenerTecnicoPorId(miId);
```

## 🚀 Características Técnicas

### Paginación
- **10 técnicos por página** (configurable en backend)
- **Páginas 0-indexed** (primera página = 0)
- **Información completa de paginación** incluida en respuesta

### Rendimiento
- **Carga diferida**: Solo carga cuando se necesita
- **Filtrado automático**: Solo técnicos activos
- **Respuestas ligeras**: Solo datos necesarios

## 🔄 Sincronización

### Actualización Automática
Cuando se asigna un técnico a un reporte, el técnico queda "ocupado" lógicamente, pero el servicio de técnicos no cambia. La disponibilidad se maneja en el contexto de asignaciones.

### Estado en Tiempo Real
Para mantener el estado actualizado, considera:
- Recargar la lista después de asignaciones importantes
- Usar WebSockets para actualizaciones en tiempo real
- Implementar caché local con invalidación

## 📱 UI/UX Recomendaciones

### Selector de Técnicos
- **Orden alfabético** por apellido
- **Indicador de disponibilidad** (si está asignado actualmente)
- **Búsqueda** para listas largas
- **Avatar o iniciales** para identificación visual

### Lista de Técnicos
- **Tabla responsive** con filtros
- **Badge de estado** (Activo/Inactivo)
- **Acciones rápidas** (Ver perfil, Contactar)
- **Paginación visual** con números de página

¿Te gustaría que implemente algún componente específico para la gestión de técnicos o necesitas alguna funcionalidad adicional? 🚀