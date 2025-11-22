import { useState, useEffect, useCallback } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import ServicioReportes from '../../servicios/ServicioReportes';
import { ReporteResponse, FiltrosReporte } from '../../types';
import { EstadoReporteType, TipoProblemaType, PrioridadType } from '../../types/enums';

export const useMapController = () => {
    const [reportes, setReportes] = useState<ReporteResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [filtros, setFiltros] = useState<FiltrosReporte>({});
    const [showFilterModal, setShowFilterModal] = useState(false);

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Permiso de Ubicación',
                        message: 'ReportaYA necesita acceso a tu ubicación para mostrar reportes cercanos.',
                        buttonNeutral: 'Preguntar luego',
                        buttonNegative: 'Cancelar',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    getCurrentLocation();
                } else {
                    console.log('Permiso de ubicación denegado');
                    // Default location (Lima)
                    setUserLocation({ latitude: -12.046374, longitude: -77.042793 });
                }
            } catch (err) {
                console.warn(err);
                setUserLocation({ latitude: -12.046374, longitude: -77.042793 });
            }
        } else {
            getCurrentLocation();
        }
    };

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                setUserLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (error) => {
                console.log(error.code, error.message);
                // Default location if error
                setUserLocation({ latitude: -12.046374, longitude: -77.042793 });
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    const cargarReportes = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await ServicioReportes.obtenerReportesMapa(
                filtros.estado,
                filtros.tipoProblema,
                filtros.prioridad
            );
            setReportes(data);
        } catch (err: any) {
            setError(err.message || 'Error al cargar reportes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filtros]);

    useEffect(() => {
        requestLocationPermission();
    }, []);

    useEffect(() => {
        cargarReportes();
    }, [cargarReportes]);

    const aplicarFiltros = (nuevosFiltros: FiltrosReporte) => {
        setFiltros(nuevosFiltros);
        setShowFilterModal(false);
    };

    const limpiarFiltros = () => {
        setFiltros({});
        setShowFilterModal(false);
    };

    return {
        reportes,
        loading,
        error,
        userLocation,
        filtros,
        showFilterModal,
        setShowFilterModal,
        aplicarFiltros,
        limpiarFiltros,
        cargarReportes
    };
};
