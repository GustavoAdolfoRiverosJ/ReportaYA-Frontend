import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Modal, ActivityIndicator, Image } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useReportes } from '../../context/ReportesContext';
import { EstadoReporteType, PrioridadType } from '../../types/enums';
import { Reporte } from '../../types/reporte.types';
import servicioReportes from '../../servicios/ServicioReportes';

const { width, height } = Dimensions.get('window');

const MapScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [region, setRegion] = useState({
        latitude: -12.046374,
        longitude: -77.042793,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const [reportes, setReportes] = useState<Reporte[]>([]);
    const [loading, setLoading] = useState(false);
    const [filtersVisible, setFiltersVisible] = useState(false);
    const [legendVisible, setLegendVisible] = useState(false);

    // Filtros
    const [filterEstado, setFilterEstado] = useState<EstadoReporteType | undefined>(undefined);
    const [filterTipo, setFilterTipo] = useState<string | undefined>(undefined);
    const [filterPrioridad, setFilterPrioridad] = useState<PrioridadType | undefined>(undefined);

    useEffect(() => {
        getCurrentLocation();
        fetchReportes();
    }, []);

    useEffect(() => {
        fetchReportes();
    }, [filterEstado, filterTipo, filterPrioridad]);

    const getCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                setRegion({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
            },
            (error) => console.log(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    };

    const fetchReportes = async () => {
        setLoading(true);
        try {
            const response = await servicioReportes.obtenerTodosReportes(0, filterEstado, filterTipo, filterPrioridad);
            setReportes(response.content);
        } catch (error) {
            console.error('Error fetching reportes:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMarkerColor = (estado?: EstadoReporteType) => {
        switch (estado) {
            case 'PENDIENTE': return 'red';
            case 'PROCESO': return 'orange';
            case 'RESUELTA': return 'green';
            case 'RECHAZADO': return 'gray';
            default: return 'blue';
        }
    };

    const clearFilters = () => {
        setFilterEstado(undefined);
        setFilterTipo(undefined);
        setFilterPrioridad(undefined);
        setFiltersVisible(false);
    };

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={region}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {reportes.map((reporte) => (
                    <Marker
                        key={reporte.id}
                        coordinate={{
                            latitude: reporte.ubicacion.latitud,
                            longitude: reporte.ubicacion.longitud,
                        }}
                        pinColor={getMarkerColor(reporte.estado)}
                        onCalloutPress={() => navigation.navigate('ReportDetail', { reporteId: reporte.id! })}
                    >
                        <Callout>
                            <View style={styles.callout}>
                                <Text style={styles.calloutTitle}>{reporte.titulo}</Text>
                                <Text style={styles.calloutDesc}>{reporte.estado}</Text>
                                <Text style={styles.calloutNote}>Toque para ver detalle</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>

            {/* Botones flotantes */}
            <View style={styles.fabContainer}>
                <TouchableOpacity style={styles.fab} onPress={() => setFiltersVisible(true)}>
                    <Ionicons name="filter" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.fab} onPress={() => setLegendVisible(true)}>
                    <Ionicons name="list" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Mensaje si no hay reportes */}
            {!loading && reportes.length === 0 && (
                <View style={styles.noReportsContainer}>
                    <Text style={styles.noReportsText}>No se encontraron reportes en esta área</Text>
                </View>
            )}

            {/* Modal de Filtros */}
            <Modal visible={filtersVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Filtrar Reportes</Text>

                        <Text style={styles.filterLabel}>Estado:</Text>
                        <View style={styles.filterOptions}>
                            {['PENDIENTE', 'PROCESO', 'RESUELTA'].map((est) => (
                                <TouchableOpacity
                                    key={est}
                                    style={[styles.filterChip, filterEstado === est && styles.activeChip]}
                                    onPress={() => setFilterEstado(est as EstadoReporteType)}
                                >
                                    <Text style={[styles.chipText, filterEstado === est && styles.activeChipText]}>{est}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.filterLabel}>Tipo:</Text>
                        <View style={styles.filterOptions}>
                            {['infraestructura', 'residuos', 'otros'].map((t) => (
                                <TouchableOpacity
                                    key={t}
                                    style={[styles.filterChip, filterTipo === t && styles.activeChip]}
                                    onPress={() => setFilterTipo(t)}
                                >
                                    <Text style={[styles.chipText, filterTipo === t && styles.activeChipText]}>{t}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                                <Text style={styles.clearButtonText}>Limpiar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.applyButton} onPress={() => setFiltersVisible(false)}>
                                <Text style={styles.applyButtonText}>Aplicar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal de Leyenda */}
            <Modal visible={legendVisible} animationType="fade" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Leyenda</Text>

                        <View style={styles.legendItem}>
                            <View style={[styles.colorBox, { backgroundColor: 'red' }]} />
                            <Text>Pendiente</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.colorBox, { backgroundColor: 'orange' }]} />
                            <Text>En Proceso</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.colorBox, { backgroundColor: 'green' }]} />
                            <Text>Resuelta</Text>
                        </View>

                        <TouchableOpacity style={styles.closeButton} onPress={() => setLegendVisible(false)}>
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: '100%', height: '100%' },
    fabContainer: { position: 'absolute', right: 20, top: 50 },
    fab: {
        backgroundColor: '#6a9fff',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        elevation: 5,
    },
    callout: { width: 150, padding: 5 },
    calloutTitle: { fontWeight: 'bold', marginBottom: 5 },
    calloutDesc: { fontSize: 12, color: '#666' },
    calloutNote: { fontSize: 10, color: '#999', marginTop: 5, fontStyle: 'italic' },
    noReportsContainer: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 10,
        borderRadius: 20,
    },
    noReportsText: { color: 'white' },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    filterLabel: { fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
    filterOptions: { flexDirection: 'row', flexWrap: 'wrap' },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
        marginBottom: 8,
    },
    activeChip: { backgroundColor: '#6a9fff' },
    chipText: { color: '#333' },
    activeChipText: { color: 'white' },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    clearButton: { padding: 10 },
    clearButtonText: { color: 'red' },
    applyButton: { backgroundColor: '#6a9fff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5 },
    applyButtonText: { color: 'white', fontWeight: 'bold' },
    legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    colorBox: { width: 20, height: 20, borderRadius: 5, marginRight: 10 },
    closeButton: { marginTop: 15, alignSelf: 'center', padding: 10 },
    closeButtonText: { color: '#6a9fff', fontWeight: 'bold' },
});

export default MapScreen;
