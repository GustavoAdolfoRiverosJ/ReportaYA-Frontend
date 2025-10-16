import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ServicioTecnicos from '../servicios/ServicioTecnicos';
import { TecnicoResponse } from '../types';

interface Props {
  tecnicoSeleccionado: string;
  onTecnicoSeleccionado: (tecnicoId: string) => void;
}

const SelectorTecnico: React.FC<Props> = ({ tecnicoSeleccionado, onTecnicoSeleccionado }) => {
  const [tecnicos, setTecnicos] = useState<TecnicoResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarTecnicos();
  }, []);

  const cargarTecnicos = async () => {
    try {
      setLoading(true);
      setError(null);

      const pagina = await ServicioTecnicos.obtenerTodosTecnicos(0);

      // Filtrar solo técnicos activos
      const tecnicosActivos = pagina.content.filter(tecnico => tecnico.activo);
      setTecnicos(tecnicosActivos);

      if (tecnicosActivos.length === 0) {
        setError('No hay técnicos disponibles');
      }
    } catch (error) {
      console.error('Error al cargar técnicos:', error);
      setError('Error al cargar la lista de técnicos');
      Alert.alert('Error', 'No se pudo cargar la lista de técnicos');
    } finally {
      setLoading(false);
    }
  };

  const renderTecnicoItem = ({ item }: { item: TecnicoResponse }) => (
    <TouchableOpacity
      style={[
        styles.tecnicoItem,
        tecnicoSeleccionado === item.id.toString() && styles.tecnicoSeleccionado
      ]}
      onPress={() => onTecnicoSeleccionado(item.id.toString())}
    >
      <View style={styles.tecnicoInfo}>
        <Text style={styles.tecnicoNombre}>
          {item.nombres} {item.apellidos}
        </Text>
        <Text style={styles.tecnicoDetalle}>
          DNI: {item.dni} • Tel: {item.telefono}
        </Text>
        <Text style={styles.tecnicoCorreo}>{item.correo}</Text>
      </View>
      {tecnicoSeleccionado === item.id.toString() && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando técnicos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={cargarTecnicos}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Seleccionar Técnico Asignado:</Text>

      {tecnicos.length === 0 ? (
        <Text style={styles.noTecnicosText}>No hay técnicos disponibles</Text>
      ) : (
        <FlatList
          data={tecnicos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTecnicoItem}
          style={styles.tecnicosList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {tecnicoSeleccionado && (
        <View style={styles.seleccionInfo}>
          <Text style={styles.seleccionText}>
            Técnico seleccionado: {tecnicos.find(t => t.id.toString() === tecnicoSeleccionado)?.nombres} {tecnicos.find(t => t.id.toString() === tecnicoSeleccionado)?.apellidos}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#d32f2f',
    padding: 20,
  },
  retryButton: {
    backgroundColor: '#2196f3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noTecnicosText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    padding: 20,
    fontStyle: 'italic',
  },
  tecnicosList: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  tecnicoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  tecnicoSeleccionado: {
    backgroundColor: '#e3f2fd',
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  tecnicoInfo: {
    flex: 1,
  },
  tecnicoNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  tecnicoDetalle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  tecnicoCorreo: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2196f3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  seleccionInfo: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e8f5e8',
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  seleccionText: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
});

export default SelectorTecnico;