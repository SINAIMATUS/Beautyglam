import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Productos = [
  {
    id: '1',
    nombre: 'Sombra de ojos rosa',
    precio: '$50',
    tiempo: '8 hours ago',
    categoria: 'Maquillaje',
    imagen: require('../Imagenes/Maquillaje2.jpg'),
    fondo: '#d0e9f2ff',
  },
  {
    id: '2',
    nombre: 'Sombra de ojos blanca',
    precio: '$250',
    tiempo: '20 hours ago',
    categoria: 'Maquillaje',
    imagen: require('../Imagenes/Maquillaje3.jpg'),
    fondo: '#f0e0ff',
  },
  {
    id: '3',
    nombre: 'Tratamiento facial 1',
    precio: '$20',
    tiempo: '18 hours ago',
    categoria: 'Dermocosmeticos',
    imagen: require('../Imagenes/Facial1.jpg'),
    fondo: '#f0e0ff',
  },
  {
    id: '4',
    nombre: 'Tratamiento facial 2',
    precio: '$30',
    tiempo: '16 hours ago',
    categoria: 'Dermocosmeticos',
    imagen: require('../Imagenes/Facial2.jpg'),
    fondo: '#ffe0e0',
  },
  {
    id: '5',
    nombre: 'Tratamiento facial 3',
    precio: '$40',
    tiempo: '14 hours ago',
    categoria: 'Dermocosmeticos',
    imagen: require('../Imagenes/Facial3.jpg'),
    fondo: '#e0ffe0',
  },
  {
    id: '6',
    nombre: 'Crema hidratante',
    precio: '$100',
    tiempo: '22 hours ago',
    categoria: 'Dermocosmeticos',
    imagen: require('../Imagenes/Skincare2.jpg'),
    fondo: '#f0e0ff',
  },
];

export default function Producs({ categoriaSeleccionada, filtroNombre }) {
  const { toggleFavorito, agregarAlCarrito, esFavorito } = useApp();
  const navigation = useNavigation();

  const filtrados = Productos.filter((p) => {
    const coincideCategoria =
      categoriaSeleccionada === 'Todos' || p.categoria === categoriaSeleccionada;
    const coincideNombre = p.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    return coincideCategoria && coincideNombre;
  });

  const pedirLogin = (accion) => {
    Alert.alert(
      'Iniciar Sesión Requerido',
      `Para ${accion} necesitas iniciar sesión. ¿Deseas iniciar sesión ahora?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Aceptar',
          onPress: () => {
            navigation.navigate('Login');
          },
        },
      ]
    );
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

  return (
    <FlatList
      data={filtrados}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => {
        const favorito = esFavorito(item.id);
        return (
          <View style={[styles.card, { backgroundColor: item.fondo }]}>
            <Image source={item.imagen} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.price}>{item.precio}</Text>
              <Text style={styles.name}>{item.nombre}</Text>
              <Text style={styles.time}>{item.tiempo}</Text>
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
});