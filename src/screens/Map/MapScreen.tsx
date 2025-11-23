import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Modal, ScrollView, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { styles } from './MapScreen.styles';
import { useMapController } from './MapScreen.controller';
import ReportDetailModal from '../../components/ReportDetailModal';
import { ReporteResponse } from '../../types';
import { EstadoReporte, TipoProblema, Prioridad } from '../../types/enums';

const MapScreen = () => {
    const {
        reportes,
        loading,
        userLocation,
        filtros,
        showFilterModal,
        setShowFilterModal,
        aplicarFiltros,
        limpiarFiltros,
    } = useMapController();

    const [selectedReporte, setSelectedReporte] = useState<ReporteResponse | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [tempFiltros, setTempFiltros] = useState(filtros);
    const webViewRef = useRef<WebView>(null);

    const getMarkerColor = (estado: string) => {
        switch (estado) {
            case EstadoReporte.RESUELTA: return 'green';
            case EstadoReporte.PROCESO: return 'yellow';
            case EstadoReporte.PENDIENTE: return 'red';
            default: return 'gray';
        }
    };

    // Generate HTML for Leaflet map
    const generateMapHTML = () => {
        const markers = reportes.map((reporte, index) => ({
            id: reporte.id,
            lat: reporte.ubicacion.latitud,
            lng: reporte.ubicacion.longitud,
            title: reporte.titulo,
            tipo: reporte.tipoProblema,
            estado: reporte.estado,
            color: getMarkerColor(reporte.estado)
        }));

        const centerLat = userLocation?.latitude || -12.046374;
        const centerLng = userLocation?.longitude || -77.042793;

        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { width: 100vw; height: 100vh; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', {
            zoomControl: false  // Disable default zoom control
          }).setView([${centerLat}, ${centerLng}], 13);
          
          // Add zoom control in bottom-right position
          L.control.zoom({
            position: 'bottomright'
          }).addTo(map);
          
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(map);

          // User location marker
          L.marker([${centerLat}, ${centerLng}], {
            icon: L.divIcon({
              className: 'user-marker',
              html: '<div style="background-color: blue; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
              iconSize: [16, 16]
            })
          }).addTo(map).bindPopup('Mi Ubicación');

          // Report markers
          const markers = ${JSON.stringify(markers)};
          markers.forEach(marker => {
            const icon = L.divIcon({
              className: 'custom-marker',
              html: \`<div style="background-color: \${marker.color}; width: 25px; height: 25px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.5);"><div style="transform: rotate(45deg); color: white; font-weight: bold; text-align: center; line-height: 21px;">📍</div></div>\`,
              iconSize: [30, 30],
              iconAnchor: [15, 30]
            });
            
            L.marker([marker.lat, marker.lng], { icon })
              .addTo(map)
              .bindPopup(\`
                <div style="min-width: 150px;">
                  <strong>\${marker.title}</strong><br/>
                  <span>\${marker.tipo}</span><br/>
                  <span style="color: \${marker.color}">\${marker.estado}</span><br/>
                  <a href="#" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({type: 'markerClick', id: \${marker.id}})); return false;" style="color: blue; text-decoration: underline;">Ver detalle</a>
                </div>
              \`);
          });
        </script>
      </body>
      </html>
    `;
    };

    const handleWebViewMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'markerClick') {
                const reporte = reportes.find(r => r.id === data.id);
                if (reporte) {
                    setSelectedReporte(reporte);
                    setDetailModalVisible(true);
                }
            }
        } catch (error) {
            console.error('Error parsing webview message:', error);
        }
    };

    useEffect(() => {
        // Reload map when reportes or userLocation change
        if (webViewRef.current) {
            webViewRef.current.reload();
        }
    }, [reportes, userLocation]);

    if (!userLocation) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#a27eff" />
                <Text>Obteniendo ubicación...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <WebView
                ref={webViewRef}
                originWhitelist={['*']}
                source={{ html: generateMapHTML() }}
                style={{ flex: 1 }}
                onMessage={handleWebViewMessage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
            />

            {/* Filter Button */}
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={styles.filterRow}
                    onPress={() => {
                        setTempFiltros(filtros);
                        setShowFilterModal(true);
                    }}
                >
                    <Ionicons name="filter" size={20} color="#a27eff" />
                    <Text style={{ marginLeft: 10 }}>Filtrar Reportes</Text>
                </TouchableOpacity>
            </View>

            {/* Legend */}
            <View style={styles.legendContainer}>
                <Text style={styles.legendTitle}>Leyenda</Text>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: 'green' }]} />
                    <Text style={styles.legendText}>Resuelto</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: 'yellow' }]} />
                    <Text style={styles.legendText}>En Proceso</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: 'red' }]} />
                    <Text style={styles.legendText}>Pendiente</Text>
                </View>
            </View>

            {/* No Reports Message */}
            {reportes.length === 0 && !loading && (
                <View style={styles.noReportsContainer}>
                    <Text style={styles.noReportsText}>No se encontraron reportes en esta área</Text>
                </View>
            )}

            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#a27eff" />
                </View>
            )}

            {/* Filter Modal */}
            <Modal
                visible={showFilterModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowFilterModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.filterModal}>
                        <Text style={styles.filterModalTitle}>Filtros</Text>
                        <ScrollView>
                            {/* Estado Filter */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>Estado</Text>
                                <View style={styles.filterChipsContainer}>
                                    {Object.values(EstadoReporte).map((estado) => (
                                        <TouchableOpacity
                                            key={estado}
                                            style={[
                                                styles.filterOption,
                                                tempFiltros.estado === estado && styles.filterOptionSelected
                                            ]}
                                            onPress={() => setTempFiltros({ ...tempFiltros, estado: tempFiltros.estado === estado ? undefined : estado })}
                                        >
                                            <Text style={[
                                                styles.filterOptionText,
                                                tempFiltros.estado === estado && styles.filterOptionTextSelected
                                            ]}>{estado}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Tipo Filter */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>Tipo de Problema</Text>
                                <View style={styles.filterChipsContainer}>
                                    {Object.values(TipoProblema).map((tipo) => (
                                        <TouchableOpacity
                                            key={tipo}
                                            style={[
                                                styles.filterOption,
                                                tempFiltros.tipoProblema === tipo && styles.filterOptionSelected
                                            ]}
                                            onPress={() => setTempFiltros({ ...tempFiltros, tipoProblema: tempFiltros.tipoProblema === tipo ? undefined : tipo })}
                                        >
                                            <Text style={[
                                                styles.filterOptionText,
                                                tempFiltros.tipoProblema === tipo && styles.filterOptionTextSelected
                                            ]}>{tipo}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Prioridad Filter */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>Prioridad</Text>
                                <View style={styles.filterChipsContainer}>
                                    {Object.values(Prioridad).map((prio) => (
                                        <TouchableOpacity
                                            key={prio}
                                            style={[
                                                styles.filterOption,
                                                tempFiltros.prioridad === prio && styles.filterOptionSelected
                                            ]}
                                            onPress={() => setTempFiltros({ ...tempFiltros, prioridad: tempFiltros.prioridad === prio ? undefined : prio })}
                                        >
                                            <Text style={[
                                                styles.filterOptionText,
                                                tempFiltros.prioridad === prio && styles.filterOptionTextSelected
                                            ]}>{prio}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </ScrollView>

                        <View style={styles.filterActions}>
                            <TouchableOpacity style={styles.clearButton} onPress={limpiarFiltros}>
                                <Text style={styles.clearButtonText}>Limpiar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.applyButton} onPress={() => aplicarFiltros(tempFiltros)}>
                                <Text style={styles.applyButtonText}>Aplicar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Report Detail Modal */}
            <ReportDetailModal
                visible={detailModalVisible}
                reporte={selectedReporte}
                onClose={() => setDetailModalVisible(false)}
            />
        </View>
    );
};

export default MapScreen;
