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
    <View style={styles.container}>
      <Text style={styles.titulo}>Mis Favoritos</Text>
      <FlatList
        data={favoritos}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => {
          const favorito = esFavorito(item.id);
          return (
            <View style={[styles.card, { backgroundColor: item.fondo || '#f0f0f0' }]}>
              <Image source={item.imagen} style={styles.image} />
              <Text style={styles.price}>{item.precio}</Text>
              <Text style={styles.name}>{item.nombre}</Text>
              <Text style={styles.time}>{item.tiempo}</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  lista: {
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    position: 'relative',
    minHeight: 220,
  },
  image: {
    width: 90,
    height: 90,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  time: {
    fontSize: 10,
    color: 'gray',
  },
  heart: {
    position: 'absolute',
    bottom: 10,
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

