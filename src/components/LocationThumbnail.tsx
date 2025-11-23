import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface LocationThumbnailProps {
    ubicacion: {
        lat: number;
        lng: number;
        direccion?: string;
    };
    editable?: boolean;
}

const LocationThumbnail: React.FC<LocationThumbnailProps> = ({ ubicacion, editable = false }) => {
    return (
        <View style={styles.container}>
            <View style={styles.thumbnail}>
                <View style={styles.mapPlaceholder}>
                    <Text style={styles.mapIcon}>🗺️</Text>
                    <View style={styles.markerOverlay}>
                        <Text style={styles.markerIcon}>📍</Text>
                    </View>
                </View>
                <View style={styles.locationInfo}>
                    <Text style={styles.locationLabel}>
                        {ubicacion.direccion || 'Ubicación del reporte'}
                    </Text>
                    <Text style={styles.coordinates}>
                        {ubicacion.lat.toFixed(5)}, {ubicacion.lng.toFixed(5)}
                    </Text>
                </View>
            </View>
            {editable && (
                <Text style={styles.editText}>Toca para cambiar ubicación</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderColor: '#a27eff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 15,
        backgroundColor: '#f9f7ff',
    },
    thumbnail: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mapPlaceholder: {
        width: 80,
        height: 80,
        backgroundColor: '#e8e0ff',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        position: 'relative',
    },
    mapIcon: {
        fontSize: 40,
    },
    markerOverlay: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -10 }, { translateY: -15 }],
    },
    markerIcon: {
        fontSize: 24,
    },
    locationInfo: {
        flex: 1,
    },
    locationLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    coordinates: {
        fontSize: 11,
        color: '#666',
        fontFamily: 'monospace',
    },
    editText: {
        fontSize: 12,
        color: '#a27eff',
        textAlign: 'center',
        fontWeight: '600',
        marginTop: 8,
    },
});

export default LocationThumbnail;
