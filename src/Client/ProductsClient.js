import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useApp } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../database/firebaseconfig';
import AvisoLoginModal from './AvisoLoginModal';
import ProductoCard from './ProductoCard';

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
      // Aseguramos que el objeto tenga la estructura correcta
      const productoParaCarrito = {
        id: item.id,
        Nombre: item.Nombre,
        Precio: item.Precio,
        Foto: item.Foto,
        Descripcion: item.Descripcion,
        // ... otras propiedades que necesites en el carrito
      };
      agregarAlCarrito(productoParaCarrito);
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
        renderItem={({ item }) => (
          <ProductoCard item={item} esFavorito={esFavorito} onToggleFavorito={handleFavorito} onAgregarAlCarrito={handleCarrito} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
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
    paddingHorizontal: 5,
    paddingBottom: 20,
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