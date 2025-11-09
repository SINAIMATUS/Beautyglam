import React, { useState, useEffect } from 'react';
import {View, Text,Image, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../database/firebaseconfig';
import AvisoLoginModal from './AvisoLoginModal';

export default function Producs({ categoriaSeleccionada, filtroNombre }) {
  const { toggleFavorito, agregarAlCarrito, esFavorito } = useApp();
  const navigation = useNavigation();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMensaje, setModalMensaje] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Productos'));
        const productosList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(productosList);
        setError(null);
      } catch (e) {
        setError('No se pudieron cargar los productos.');
        console.error('Error fetching productos: ', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, []);

  const filtrados = productos.filter((p) => {
    const coincideCategoria =
      categoriaSeleccionada === 'Todos' || p.Categoria === categoriaSeleccionada;
    const coincideNombre = p.Nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    return coincideCategoria && coincideNombre;
  });

  const pedirLogin = (accion) => {
    let mensaje = "";
    if (accion.includes("favoritos")) {
      mensaje = "Para agregar el producto a tus favoritos debes tener una cuenta BG.";
    } else {
      mensaje = "Para agregar el producto a tu carrito debes tener una cuenta BG.";
    }
    setModalMensaje(mensaje);
    setModalVisible(true);
  };

  const estaAutenticado = async () => {
    const rol = await AsyncStorage.getItem('rol');
    return rol === 'admin' || rol === 'cliente';
  };

  const handleFavorito = async (item) => {
    const autenticado = await estaAutenticado();
    if (autenticado) {
      toggleFavorito(item);
    } else {
      pedirLogin('agregar a favoritos');
    }
  };

  const handleCarrito = async (item) => {
    const autenticado = await estaAutenticado();
    if (autenticado) {
      agregarAlCarrito(item);
    } else {
      pedirLogin('agregar al carrito');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#78032aff" style={{ marginTop: 20 }} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (filtrados.length === 0) {
    return <Text style={styles.emptyText}>No se encontraron productos.</Text>;
  }

  return (
    <>
      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => {
          const favorito = esFavorito(item.id);
          return (
            <View style={[styles.card, { backgroundColor: '#f9f9f9' }]}>
              <Image source={{ uri: item.Foto }} style={styles.image} />
              <View style={styles.info}>
                <Text style={styles.price}>${item.Precio}</Text>
                <Text style={styles.name}>{item.Nombre}</Text>
                <Text style={styles.time}>{item.Categoria}</Text>
              </View>
              <View style={styles.botonesAccion}>
                <TouchableOpacity
                  style={styles.heart}
                  onPress={() => handleFavorito(item)}
                >
                  <Entypo
                    name={favorito ? 'heart' : 'heart-outlined'}
                    size={24}
                    color={favorito ? '#e91e63' : 'black'}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.carrito}
                  onPress={() => handleCarrito(item)}
                >
                  <Ionicons name="cart-outline" size={24} color="#78032aff" />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
      <AvisoLoginModal
        visible={modalVisible}
        mensaje={modalMensaje}
        onCerrar={() => setModalVisible(false)}
        onAceptar={() => {
          setModalVisible(false);
          navigation.navigate('Login');
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 260,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  info: {
    alignItems: 'center',
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
    textAlign: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
    textAlign: 'center',
  },
  time: {
    fontSize: 10,
    color: 'gray',
    textAlign: 'center',
  },
  botonesAccion: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 10,
  },
  heart: {
    padding: 6,
  },
  carrito: {
    padding: 6,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
    fontSize: 16,
  },
});