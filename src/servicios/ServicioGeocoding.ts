// src/servicios/ServicioGeocoding.ts
import axios from 'axios';

interface NominatimResponse {
    address?: {
        road?: string;
        suburb?: string;
        neighbourhood?: string;
        quarter?: string;
        city_district?: string;
        city?: string;
        town?: string;
        village?: string;
        municipality?: string;
        county?: string;
        state?: string;
        country?: string;
        country_code?: string;
        amenity?: string;
        building?: string;
    };
    display_name?: string;
}

export interface DireccionCompleta {
    calle?: string | null;
    distrito?: string;
    ciudad?: string;
    departamento?: string;
    pais?: string;
    direccionCompleta?: string;
}

class ServicioGeocoding {
    private readonly NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

    /**
     * Obtiene la dirección legible a partir de coordenadas
     * Retorna campos separados para guardar en BD
     */
    async obtenerDireccion(latitud: number, longitud: number): Promise<DireccionCompleta> {
        try {
            const response = await axios.get<NominatimResponse>(this.NOMINATIM_URL, {
                params: {
                    lat: latitud,
                    lon: longitud,
                    format: 'json',
                    addressdetails: 1,
                    'accept-language': 'es',
                },
                headers: {
                    'User-Agent': 'ReportaYA/1.0',
                },
                timeout: 5000,
            });

            const address = response.data.address;
            if (!address) {
                throw new Error('No se pudo obtener la dirección');
            }

            // CALLE: road, amenity, building
            const calle = address.road || address.amenity || address.building || null;

            // DISTRITO: Priorizar suburb, neighbourhood, quarter, etc.
            const distrito =
                address.suburb ||
                address.neighbourhood ||
                address.quarter ||
                address.city_district ||
                address.municipality ||
                'Desconocido';

            // CIUDAD
            const ciudad = address.city || address.town || address.village || 'Lima';

            // DEPARTAMENTO
            const departamento = address.state || address.county || 'Lima';

            // PAÍS
            const pais = address.country || 'Perú';

            // Construir dirección completa legible (mostrar en UI)
            const partes: string[] = [];

            if (calle) {
                partes.push(calle);
            }

            // IMPORTANTE: Agregar distrito de manera prominente
            partes.push(distrito);

            if (ciudad && ciudad !== distrito) {
                partes.push(ciudad);
            }

            const direccionCompleta = partes.join(', ');

            return {
                calle,
                distrito,
                ciudad,
                departamento,
                pais,
                direccionCompleta,
            };
        } catch (error: any) {
            console.error('Error al obtener dirección:', error);

            return {
                calle: null,
                distrito: 'No disponible',
                ciudad: 'No disponible',
                departamento: 'No disponible',
                pais: 'No disponible',
                direccionCompleta: `${latitud}, ${longitud}`,
            };
        }
    }

    /**
     * Parsear una dirección existente (si ya está en la BD)
     */
    parsearDireccion(direccion?: string): DireccionCompleta {
        if (!direccion || direccion.includes(',') === false) {
            return {
                calle: null,
                distrito: 'No disponible',
                ciudad: 'No disponible',
                departamento: 'No disponible',
                pais: 'No disponible',
                direccionCompleta: direccion || 'No disponible',
            };
        }

        // Intentar parsear formato "Calle, Distrito, Ciudad"
        const partes = direccion.split(',').map(p => p.trim());

        return {
            calle: partes[0] || null,
            distrito: partes[1] || partes[0] || 'No disponible',
            ciudad: partes[2] || 'No disponible',
            departamento: partes[partes.length - 2] || 'No disponible',
            pais: partes[partes.length - 1] || 'No disponible',
            direccionCompleta: direccion,
        };
    }
}

export default new ServicioGeocoding();
