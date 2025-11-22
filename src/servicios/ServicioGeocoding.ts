// src/servicios/ServicioGeocoding.ts
import axios from 'axios';

interface NominatimResponse {
    address?: {
        suburb?: string;
        city_district?: string;
        city?: string;
        municipality?: string;
        county?: string;
        state?: string;
        country?: string;
        country_code?: string;
    };
    display_name?: string;
}

export interface DireccionCompleta {
    distrito?: string;
    departamento?: string;
    pais?: string;
    direccionCompleta?: string;
}

class ServicioGeocoding {
    private readonly NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

    /**
     * Obtiene la dirección legible a partir de coordenadas
     * @param latitud - Latitud
     * @param longitud - Longitud
     * @returns Promise con la dirección parseada
     */
    async obtenerDireccion(latitud: number, longitud: number): Promise<DireccionCompleta> {
        try {
            const response = await axios.get<NominatimResponse>(this.NOMINATIM_URL, {
                params: {
                    lat: latitud,
                    lon: longitud,
                    format: 'json',
                    addressdetails: 1,
                    // User-Agent es requerido por Nominatim
                },
                headers: {
                    'User-Agent': 'ReportaYA/1.0',
                },
                timeout: 5000, // 5 segundos timeout
            });

            const address = response.data.address;
            if (!address) {
                throw new Error('No se pudo obtener la dirección');
            }

            // Distrito: puede ser suburb, city_district, municipality
            const distrito = address.suburb || address.city_district || address.municipality || address.city || 'Desconocido';

            // Departamento: generalmente es state o county
            const departamento = address.state || address.county || 'Desconocido';

            // País
            const pais = address.country || 'Desconocido';

            // Dirección completa para guardar en BD
            const direccionCompleta = response.data.display_name || `${distrito}, ${departamento}, ${pais}`;

            return {
                distrito,
                departamento,
                pais,
                direccionCompleta,
            };
        } catch (error: any) {
            console.error('Error al obtener dirección:', error);

            // Fallback en caso de error
            return {
                distrito: 'No disponible',
                departamento: 'No disponible',
                pais: 'No disponible',
                direccionCompleta: `${latitud}, ${longitud}`,
            };
        }
    }

    /**
     * Parsear una dirección existente (si ya está en la BD)
     * @param direccion - Dirección completa
     * @returns Dirección parseada
     */
    parsearDireccion(direccion?: string): DireccionCompleta {
        if (!direccion || direccion.includes(',') === false) {
            return {
                distrito: 'No disponible',
                departamento: 'No disponible',
                pais: 'No disponible',
                direccionCompleta: direccion || 'No disponible',
            };
        }

        // Intentar parsear formato "Distrito, Departamento, País"
        const partes = direccion.split(',').map(p => p.trim());

        return {
            distrito: partes[0] || 'No disponible',
            departamento: partes[partes.length - 2] || 'No disponible',
            pais: partes[partes.length - 1] || 'No disponible',
            direccionCompleta: direccion,
        };
    }
}

export default new ServicioGeocoding();
