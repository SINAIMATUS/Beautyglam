import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useApp } from '../context/AppContext';
import Entypo from '@expo/vector-icons/Entypo';

export default function Favoritos() {
  const { favoritos, toggleFavorito, esFavorito } = useApp();

  if (favoritos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Entypo name="heart-outlined" size={64} color="#ccc" />
        <Text style={styles.emptyText}>No tienes productos favoritos</Text>
      </View>
    );
  }

  return (
    <>
      <Text style={styles.titulo}>Mis Favoritos</Text>
      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => {
          const favorito = esFavorito(item.id);
          return (
            <View style={styles.card}>
              <Image source={{ uri: item.Foto }} style={styles.image} />
              <Text style={styles.price}>${item.Precio}</Text>
              <Text style={styles.name}>{item.Nombre}</Text>
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
            </View>
          );
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingTop: 40,
    color: '#333',
    textAlign: 'center',
    backgroundColor: '#fff',
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
  heart: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
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
