// src/screens/MapScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

// Simulación de reportes en mapa
const mockMapReports = [
  { id: 1, lat: -12.046373, lng: -77.042754, tipo: "infraestructura", estado: "PENDIENTE" },
  { id: 2, lat: -12.050263, lng: -77.038475, tipo: "residuos", estado: "PROCESO" },
  { id: 3, lat: -12.048500, lng: -77.041000, tipo: "otros", estado: "FINALIZADO" },
];

const MapScreen = () => {
  const [region, setRegion] = useState({
    latitude: -12.046373,
    longitude: -77.042754,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {mockMapReports.map((report) => (
          <Marker
            key={report.id}
            coordinate={{ latitude: report.lat, longitude: report.lng }}
            pinColor={
              report.estado === 'PENDIENTE' ? 'red' :
              report.estado === 'PROCESO' ? 'yellow' :
              'green'
            }
            title={`Reporte #${report.id}`}
            description={report.tipo}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});

export default MapScreen;