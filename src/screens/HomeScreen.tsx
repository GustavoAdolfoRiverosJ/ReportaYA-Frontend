// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Simulación de datos
const mockReports = [
  { id: 1, titulo: "Bache en Av. Arequipa", tipo: "infraestructura", estado: "PENDIENTE", fecha: "2025-04-01" },
  { id: 2, titulo: "Basura acumulada en parque", tipo: "residuos", estado: "PROCESO", fecha: "2025-04-05" },
];

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Reportes</Text>
      <FlatList
        data={mockReports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.reportItem}>
            <Text style={styles.reportTitle}>{item.titulo}</Text>
            <Text>Tipo: {item.tipo}</Text>
            <Text>Estado: {item.estado}</Text>
            <Text>Fecha: {item.fecha}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  reportItem: { padding: 15, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 10 },
  reportTitle: { fontSize: 16, fontWeight: 'bold' },
});

export default HomeScreen;