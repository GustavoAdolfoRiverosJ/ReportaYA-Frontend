# Pruebas de Software - ReportaYA

## Estructura de Pruebas

Este directorio contiene todas las pruebas de software organizadas por Historia de Usuario (HU).

### HU1: Mapa de Reportes con Filtros
- **Caja Blanca**: Prueba de `getMarkerColor()` con complejidad ciclomática > 3
- **Caja Negra**: Prueba de formulario de filtros (> 4 campos)
- **Unitarias**: 4 pruebas del método `aplicarFiltros()`

### HU2: Location Picker y Geocodificación
- **Caja Blanca**: Prueba de `parseDireccion()` con complejidad ciclomática > 3
- **Caja Negra**: Prueba de formulario de reporte (> 4 campos)
- **Unitarias**: 4 pruebas del servicio de geocodificación

## Ejecución de Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas de HU1
npm test -- tests/HU1-MapaReportes

# Ejecutar pruebas de HU2
npm test -- tests/HU2-LocationPicker

# Ver cobertura
npm test -- --coverage
```

## Requisitos Cumplidos

✅ 1 prueba de Caja Blanca con complejidad ciclomática > 3 por HU
✅ 1 prueba de Caja Negra con > 4 campos por HU  
✅ 1 método con 4 pruebas unitarias por HU
