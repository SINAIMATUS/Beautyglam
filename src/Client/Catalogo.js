import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Cate from './CateClient';
import ProductsClient from './ProductsClient';

export default function Catalogo() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const navigation = useNavigation();

  // Este componente renderizará todo lo que va antes de la lista de productos.
  const renderHeader = () => (
    <>
      <Image
        source={require("../Imagenes/2.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.subHeader}>
        <Text style={styles.titulo}>BeautyGlam</Text>
        <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Perfil')}>
          <Ionicons name="person-circle-outline" size={32} color="#78032aff" />
          <Text style={styles.profileButtonText}>Yo</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Buscar producto..."
        value={busqueda}
        onChangeText={setBusqueda}
        placeholderTextColor="#999"
      />
      <Cate onSelectCategoria={setCategoriaSeleccionada} />
    </>
  );

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
          <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Perfil')}>
            <Ionicons name="person-circle-outline" size={32} color="#78032aff" />
            <Text style={styles.profileButtonText}>Yo</Text>
          </TouchableOpacity>
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
          ListHeaderComponent={renderHeader}
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
    flexDirection: 'row',
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
  profileButton: {
    position: 'absolute',
    right: 0,
    top: -20,
    alignItems: 'center',
  },
  profileButtonText: {
    fontSize: 12,
    color: '#78032aff',
    fontWeight: '600',
  },
});