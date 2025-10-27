import React, { useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Cate from '../Client/CateClient';
import Producs from '../Client/Productsclient';
import { FontAwesome } from '@expo/vector-icons';

export default function Catalogo() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.container}>
          {/*  Barra de búsqueda */}
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={20} color="#a080f1ff" style={{ marginRight: 10 }} />
            <TextInput placeholder="Buscar productos..." style={styles.searchInput} />
          </View>

          {/*  Categorías */}
          <Cate onSelectCategoria={setCategoriaSeleccionada} />

          {/*  Productos */}
          <Producs categoriaSeleccionada={categoriaSeleccionada} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flex: 1,
    paddingTop: 20, //  Esto baja todo el contenido un poco más
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    marginHorizontal: 15,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    height: 45,
  },
  searchInput: {
    flex: 1,
    height: '100%',
  },
});
