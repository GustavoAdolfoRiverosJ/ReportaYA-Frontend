import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../navigation/AppNavigator';
import servicioReportes from '../../servicios/ServicioReportes';
import { Reporte } from '../../types/reporte.types';
import LinearGradient from 'react-native-linear-gradient';

type ReportDetailRouteProp = RouteProp<RootStackParamList, 'ReportDetail'>;

const ReportDetailScreen = () => {
    const route = useRoute<ReportDetailRouteProp>();
    const navigation = useNavigation();
    const { reporteId } = route.params;
    const [reporte, setReporte] = useState<Reporte | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetalle = async () => {
            try {
                const response = await servicioReportes.obtenerReportePorId(reporteId);
                setReporte(response);
            } catch (error) {
                console.error('Error al cargar detalle:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetalle();
    }, [reporteId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#a27eff" />
            </View>
        );
    }

    if (!reporte) {
        return (
            <View style={styles.container}>
                <Text>Reporte no encontrado</Text>
            </View>
        );
    }

    return (
        <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.container}>
            <ScrollView>
                {/* Header con botón de regreso */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Detalle del Reporte</Text>
                </View>

                <View style={styles.content}>
                    {/* Título y Estado */}
                    <View style={styles.section}>
                        <Text style={styles.title}>{reporte.titulo}</Text>
                        <View style={styles.badgeContainer}>
                            <View style={[styles.badge, { backgroundColor: getStatusColor(reporte.estado) }]}>
                                <Text style={styles.badgeText}>{reporte.estado}</Text>
                            </View>
                            <View style={[styles.badge, { backgroundColor: getPriorityColor(reporte.prioridad) }]}>
                                <Text style={styles.badgeText}>{reporte.prioridad}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Descripción */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Descripción</Text>
                        <Text style={styles.text}>{reporte.descripcion}</Text>
                    </View>

                    {/* Tipo */}
                    {reporte.tipo && (
                        <View style={styles.section}>
                            <Text style={styles.label}>Tipo de Problema</Text>
                            <Text style={styles.text}>{reporte.tipo}</Text>
                        </View>
                    )}

                    {/* Evidencia (Foto) */}
                    {reporte.urlFoto && (
                        <View style={styles.section}>
                            <Text style={styles.label}>Evidencia</Text>
                            <Image source={{ uri: reporte.urlFoto }} style={styles.image} resizeMode="cover" />
                        </View>
                    )}

                    {/* Ubicación (Mapa estático o interactivo pequeño) */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Ubicación</Text>
                        <View style={styles.mapContainer}>
                            <MapView
                                provider={PROVIDER_GOOGLE}
                                style={styles.map}
                                initialRegion={{
                                    latitude: reporte.ubicacion.latitud,
                                    longitude: reporte.ubicacion.longitud,
                                    latitudeDelta: 0.005,
                                    longitudeDelta: 0.005,
                                }}
                                scrollEnabled={false}
                                zoomEnabled={false}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: reporte.ubicacion.latitud,
                                        longitude: reporte.ubicacion.longitud,
                                    }}
                                />
                            </MapView>
                        </View>
                        <Text style={styles.address}>{reporte.ubicacion.direccion || 'Dirección no disponible'}</Text>
                    </View>

                    {/* Historial (Simulado si no viene del backend aun) */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Historial</Text>
                        <View style={styles.historyItem}>
                            <View style={styles.timelineDot} />
                            <View>
                                <Text style={styles.historyStatus}>Reporte Creado</Text>
                                <Text style={styles.historyDate}>{new Date(reporte.fechaCreacion || '').toLocaleString()}</Text>
                            </View>
                        </View>
                        {/* Aquí se iteraría sobre el historial real si existiera en el modelo Reporte */}
                    </View>

                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const getStatusColor = (status: any) => {
    switch (status) {
        case 'PENDIENTE': return '#ff6b6b';
        case 'PROCESO': return '#feca57';
        case 'RESUELTA': return '#1dd1a1';
        case 'RECHAZADO': return '#a4b0be';
        default: return '#54a0ff';
    }
};

const getPriorityColor = (priority: any) => {
    switch (priority) {
        case 'ALTA': return '#ff9ff3';
        case 'MEDIA': return '#54a0ff';
        case 'BAJA': return '#48dbfb';
        default: return '#c8d6e5';
    }
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'white', elevation: 2 },
    backButton: { marginRight: 16 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    content: { padding: 16 },
    section: { marginBottom: 24, backgroundColor: 'white', padding: 16, borderRadius: 10, elevation: 1 },
    title: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8 },
    badgeContainer: { flexDirection: 'row' },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginRight: 8 },
    badgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
    label: { fontSize: 16, fontWeight: 'bold', color: '#555', marginBottom: 8 },
    text: { fontSize: 16, color: '#333', lineHeight: 24 },
    image: { width: '100%', height: 200, borderRadius: 8 },
    mapContainer: { height: 200, borderRadius: 8, overflow: 'hidden', marginBottom: 8 },
    map: { flex: 1 },
    address: { fontSize: 14, color: '#666' },
    historyItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    timelineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#a27eff', marginRight: 10 },
    historyStatus: { fontWeight: 'bold', color: '#333' },
    historyDate: { fontSize: 12, color: '#999' },
});

export default ReportDetailScreen;
