import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Cate from './CateClient';
import ProductsClient from './ProductsClient';

export default function Catalogo() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.titulo}>Catálogo</Text>

        <TextInput
          style={styles.input}
          placeholder="Buscar producto..."
          value={busqueda}
          onChangeText={setBusqueda}
          placeholderTextColor="#999"
        />

        <Cate onSelectCategoria={setCategoriaSeleccionada} />

        <ProductsClient
          categoriaSeleccionada={categoriaSeleccionada}
          filtroNombre={busqueda}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#333',
  },
});