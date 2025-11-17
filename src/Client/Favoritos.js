import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useApp } from '../context/AppContext';
import Entypo from '@expo/vector-icons/Entypo';
import { Ionicons } from '@expo/vector-icons';

export default function Favoritos() {
  const { favoritos, toggleFavorito, esFavorito, agregarAlCarrito } = useApp();

  if (favoritos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Entypo name="heart-outlined" size={64} color="#ccc" />
        <Text style={styles.emptyText}>No tienes productos favoritos</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.titulo}>Mis Favoritos</Text>
      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => {
          const favorito = esFavorito(item.id);
          return (
            <View style={styles.card}>
              <Image source={{ uri: item.Foto }} style={styles.image} />
              <Text style={styles.price}>${item.Precio}</Text>
              <Text style={styles.name}>{item.Nombre}</Text>
              <View style={styles.botonesAccion}>
                <TouchableOpacity
                  style={styles.heart}
                  onPress={() => toggleFavorito(item)}
                >
                  <Entypo
                    name={favorito ? "heart" : "heart-outlined"}
                    size={24}
                    color={favorito ? "#e91e63" : "black"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.carrito}
                  onPress={() => agregarAlCarrito(item)}
                >
                  <Ionicons name="cart-outline" size={24} color="#78032aff" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  lista: {
    paddingHorizontal: 5,
    paddingBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#eee',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  name: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 4,
  },
  botonesAccion: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    paddingVertical: 2,
    paddingHorizontal: 5,
    gap: 5,
  },
  heart: { padding: 4 },
  carrito: { padding: 4 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});
