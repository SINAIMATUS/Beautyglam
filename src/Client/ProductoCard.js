import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { Ionicons } from '@expo/vector-icons';

const ProductoCard = ({ item, esFavorito, onToggleFavorito, onAgregarAlCarrito }) => {
  const favorito = esFavorito(item.id);

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.Foto }} style={styles.image} />
      <View style={styles.botonesAccion}>
        <TouchableOpacity
          style={styles.heart}
          onPress={() => onToggleFavorito(item)}
        >
          <Entypo
            name={favorito ? 'heart' : 'heart-outlined'}
            size={24}
            color={favorito ? '#860630ff' : 'black'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.carrito}
          onPress={() => onAgregarAlCarrito(item)}
        >
          <Ionicons name="cart-outline" size={24} color="#78032aff" />
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={styles.price}>${item.Precio}</Text>
        <Text style={styles.name}>{item.Nombre}</Text>
        <Text style={styles.descripcion} numberOfLines={2}>{item.Descripcion}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
    marginBottom: 10,
    borderRadius: 15,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#eee',
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  info: {
    padding: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  descripcion: {
    fontSize: 12,
    color: 'gray',
    marginTop: 2,
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
});

export default React.memo(ProductoCard);