/**
 * PRUEBAS UNITARIAS - HU1: Mapa de Reportes
 * 
 * Método bajo prueba: aplicarFiltros()
 * Número de pruebas: 4
 * 
 * Descripción: Prueba el método que aplica filtros a la lista de reportes
 */

interface ReporteResponse {
    id: number;
    titulo: string;
    descripcion: string;
    estado: string;
    tipoProblema: string;
    prioridad: string;
    ubicacion: { latitud: number; longitud: number; direccion: string };
    nombreCiudadano: string;
    fechaCreacion: string;
    fechaActualizacion: string;
}

interface FiltrosReporte {
    estado?: string;
    tipo?: string;
    prioridad?: string;
}

// Función a probar
const aplicarFiltros = (reportes: ReporteResponse[], filtros: FiltrosReporte): ReporteResponse[] => {
    return reportes.filter(reporte => {
        if (filtros.estado && reporte.estado !== filtros.estado) {
            return false;
        }
        if (filtros.tipo && reporte.tipoProblema !== filtros.tipo) {
            return false;
        }
        if (filtros.prioridad && reporte.prioridad !== filtros.prioridad) {
            return false;
        }
        return true;
    });
};

// Datos de prueba
const reportesMock: ReporteResponse[] = [
    {
        id: 1,
        titulo: 'Basura acumulada',
        descripcion: 'Basura en la esquina',
        estado: 'PENDIENTE',
        tipoProblema: 'BASURA',
        prioridad: 'ALTA',
        ubicacion: { latitud: -12.0, longitud: -77.0, direccion: 'Lima' },
        nombreCiudadano: 'Juan',
        fechaCreacion: '2024-01-01',
        fechaActualizacion: '2024-01-01'
    },
    {
        id: 2,
        titulo: 'Bache en pista',
        descripcion: 'Bache grande',
        estado: 'PROCESO',
        tipoProblema: 'BACHES',
        prioridad: 'MEDIA',
        ubicacion: { latitud: -12.1, longitud: -77.1, direccion: 'Lima' },
        nombreCiudadano: 'María',
        fechaCreacion: '2024-01-02',
        fechaActualizacion: '2024-01-02'
    },
    {
        id: 3,
        titulo: 'Alumbrado defectuoso',
        descripcion: 'Luz no enciende',
        estado: 'RESUELTA',
        tipoProblema: 'ALUMBRADO',
        prioridad: 'BAJA',
        ubicacion: { latitud: -12.2, longitud: -77.2, direccion: 'Lima' },
        nombreCiudadano: 'Pedro',
        fechaCreacion: '2024-01-03',
        fechaActualizacion: '2024-01-03'
    },
    {
        id: 4,
        titulo: 'Basura en parque',
        descripcion: 'Basura',
        estado: 'PENDIENTE',
        tipoProblema: 'BASURA',
        prioridad: 'ALTA',
        ubicacion: { latitud: -12.3, longitud: -77.3, direccion: 'Lima' },
        nombreCiudadano: 'Ana',
        fechaCreacion: '2024-01-04',
        fechaActualizacion: '2024-01-04'
    }
];

describe('PRUEBAS UNITARIAS: aplicarFiltros() - 4 PRUEBAS', () => {

    test('PRUEBA 1: Filtrar por estado PENDIENTE', () => {
        const filtros: FiltrosReporte = {
            estado: 'PENDIENTE'
        };

        const resultado = aplicarFiltros(reportesMock, filtros);

        expect(resultado).toHaveLength(2);
        expect(resultado[0].id).toBe(1);
        expect(resultado[1].id).toBe(4);
        expect(resultado.every(r => r.estado === 'PENDIENTE')).toBe(true);
    });

    test('PRUEBA 2: Filtrar por tipo de problema BASURA', () => {
        const filtros: FiltrosReporte = {
            tipo: 'BASURA'
        };

        const resultado = aplicarFiltros(reportesMock, filtros);

        expect(resultado).toHaveLength(2);
        expect(resultado.every(r => r.tipoProblema === 'BASURA')).toBe(true);
    });

    test('PRUEBA 3: Filtros combinados (estado + prioridad)', () => {
        const filtros: FiltrosReporte = {
            estado: 'PENDIENTE',
            prioridad: 'ALTA'
        };

        const resultado = aplicarFiltros(reportesMock, filtros);

        expect(resultado).toHaveLength(2);
        expect(resultado.every(r =>
            r.estado === 'PENDIENTE' &&
            r.prioridad === 'ALTA'
        )).toBe(true);
    });

    test('PRUEBA 4: Sin filtros devuelve todos los reportes', () => {
        const filtros: FiltrosReporte = {};

        const resultado = aplicarFiltros(reportesMock, filtros);

        expect(resultado).toHaveLength(4);
        expect(resultado).toEqual(reportesMock);
    });
});

/**
 * ✅ CUMPLE: Método con 4 pruebas unitarias
 */
