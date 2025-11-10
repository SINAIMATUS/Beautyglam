import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Cate from './CateClient';
import ProductsClient from './ProductsClient';

export default function Catalogo() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require("../Imagenes/2.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.subHeader}>
          <Text style={styles.titulo}>BeautyGlam</Text>
        </View>

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
  logo: {
    width: 120,
    height: 50,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  subHeader: {
    width: '100%',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
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