import React, { useRef, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface LocationPickerModalProps {
    visible: boolean;
    initialLocation: { lat: number; lng: number };
    onConfirm: (location: { lat: number; lng: number }) => void;
    onCancel: () => void;
}

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
    visible,
    initialLocation,
    onConfirm,
    onCancel,
}) => {
    const webViewRef = useRef<WebView>(null);
    const [selectedLocation, setSelectedLocation] = useState(initialLocation);
    const [isLoading, setIsLoading] = useState(true);

    const generateMapHTML = () => {
        const centerLat = initialLocation.lat;
        const centerLng = initialLocation.lng;

        return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          }
          #map { width: 100vw; height: 100vh; }
          .instruction-banner {
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 12px 20px;
            border-radius: 20px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            z-index: 1000;
            text-align: center;
            max-width: 80%;
          }
          .instruction-text {
            font-size: 14px;
            color: #333;
            margin: 0;
          }
          .center-marker {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -100%);
            z-index: 1000;
            pointer-events: none;
          }
          .marker-pin {
            width: 30px;
            height: 30px;
            background-color: #a27eff;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid white;
            box-shadow: 0 3px 10px rgba(0,0,0,0.4);
          }
          .marker-icon {
            transform: rotate(45deg);
            color: white;
            font-size: 18px;
            text-align: center;
            line-height: 24px;
          }
        </style>
      </head>
      <body>
        <div class="instruction-banner">
          <p class="instruction-text">🗺️ Mueve el mapa para ajustar la ubicación del marcador</p>
        </div>
        
        <!-- Fixed center marker -->
        <div class="center-marker">
          <div class="marker-pin">
            <div class="marker-icon">📍</div>
          </div>
        </div>
        
        <div id="map"></div>
        <script>
          // Initialize map
          const map = L.map('map', {
            zoomControl: true
          }).setView([${centerLat}, ${centerLng}], 16);
          
          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(map);

          // Send location updates to React Native
          function sendLocation(lat, lng) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'locationChange',
              lat: lat,
              lng: lng
            }));
          }

          // Update location when map moves
          map.on('moveend', function() {
            const center = map.getCenter();
            sendLocation(center.lat, center.lng);
          });

          // Initial location send
          sendLocation(${centerLat}, ${centerLng});
          
          // Notify that map is ready
          setTimeout(() => {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapReady' }));
          }, 500);
        </script>
      </body>
      </html>
    `;
    };

    const handleWebViewMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data.type === 'locationChange') {
                setSelectedLocation({ lat: data.lat, lng: data.lng });
            } else if (data.type === 'mapReady') {
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error parsing webview message:', error);
        }
    };

    const handleConfirm = () => {
        onConfirm(selectedLocation);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onCancel}
        >
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={onCancel} style={styles.headerButton}>
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Seleccionar Ubicación</Text>
                    <TouchableOpacity onPress={handleConfirm} style={styles.headerButton}>
                        <Ionicons name="checkmark" size={24} color="#a27eff" />
                    </TouchableOpacity>
                </View>

                {/* Map */}
                <View style={styles.mapContainer}>
                    {isLoading && (
                        <View style={styles.loadingOverlay}>
                            <ActivityIndicator size="large" color="#a27eff" />
                            <Text style={styles.loadingText}>Cargando mapa...</Text>
                        </View>
                    )}
                    <WebView
                        ref={webViewRef}
                        originWhitelist={['*']}
                        source={{ html: generateMapHTML() }}
                        style={styles.map}
                        onMessage={handleWebViewMessage}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                    />
                </View>

                {/* Footer with coordinates and confirm button */}
                <View style={styles.footer}>
                    <View style={styles.coordinatesContainer}>
                        <Ionicons name="location-outline" size={20} color="#666" />
                        <Text style={styles.coordinatesText}>
                            {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                        <Ionicons name="checkmark-circle" size={20} color="white" style={{ marginRight: 8 }} />
                        <Text style={styles.confirmButtonText}>Confirmar Ubicación</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: 'white',
    },
    headerButton: {
        padding: 5,
        minWidth: 40,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    map: {
        flex: 1,
    },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 14,
        color: '#666',
    },
    footer: {
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        backgroundColor: 'white',
    },
    coordinatesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    coordinatesText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
        fontFamily: 'monospace',
    },
    confirmButton: {
        backgroundColor: '#a27eff',
        padding: 15,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LocationPickerModal;
