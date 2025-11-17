import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useApp } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function Carrito() {
  const { carrito, eliminarDelCarrito, actualizarCantidad, totalCarrito, realizarCompra } = useApp();
  const [cargando, setCargando] = useState(false);
  const navigation = useNavigation();

  if (carrito.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>Tu carrito está vacío</Text>
      </View>
    );
  }

  const handleComprar = async () => {
    navigation.navigate('Checkout');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mi Carrito</Text>
      <FlatList
        data={carrito}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => {
          // Aseguramos que el precio sea un string antes de usar .replace()
          const precioString = String(item.Precio ?? '0');
          const precio = parseFloat(precioString) || 0;
          const subtotal = precio * item.cantidad;
          return (
            <View style={styles.card}>
              <Image source={{ uri: item.Foto }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.name}>{item.Nombre}</Text>
                <Text style={styles.price}>${item.Precio}</Text>
                <View style={styles.cantidadContainer}>
                  <TouchableOpacity
                    style={styles.botonCantidad}
                    onPress={() => actualizarCantidad(item.id, item.cantidad - 1)}
                  >
                    <Text style={styles.botonTexto}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.cantidad}>{item.cantidad}</Text>
                  <TouchableOpacity
                    style={styles.botonCantidad}
                    onPress={() => actualizarCantidad(item.id, item.cantidad + 1)}
                  >
                    <Text style={styles.botonTexto}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.subtotal}>Subtotal: ${subtotal.toFixed(2)}</Text>
              </View>
              <TouchableOpacity
                style={styles.botonEliminar}
                onPress={() => eliminarDelCarrito(item.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#e91e63" />
              </TouchableOpacity>
            </View>
          );
        }}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalTexto}>Total: ${totalCarrito.toFixed(2)}</Text>
        <TouchableOpacity style={styles.botonComprar} onPress={handleComprar}>
          <Text style={styles.botonComprarTexto}>Proceder al Pago</Text>
        </TouchableOpacity>
      </View>
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
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    resizeMode: 'contain',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  cantidadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  botonCantidad: {
    backgroundColor: '#78032aff',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  botonTexto: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cantidad: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
  subtotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27ae60',
  },
  botonEliminar: {
    padding: 8,
  },
  totalContainer: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  totalTexto: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  botonComprar: {
    backgroundColor: '#78032aff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonComprarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
