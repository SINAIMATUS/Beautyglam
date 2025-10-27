import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';

const Productos = [
    {
        id: '1',
        nombre: 'Zapatillas',
        precio: '$30',
        tiempo: '10 hours ago',
        categoria: 'Ropa',
        imagen: require('../../Pictures/Facial.jpg'),
        fondo: '#ffe0e0',
    },
    {
        id: '2',
        nombre: 'Audífonos',
        precio: '$50',
        tiempo: '8 hours ago',
        categoria: 'Electrónica',
        imagen: require('../../Pictures/Facial2.jpg'),
        fondo: '#d0e9f2ff',
    },
    {
        id: '3',
        nombre: 'Pelota',
        precio: '$20',
        tiempo: '18 hours ago',
        categoria: 'Deportes',
        imagen: require('../../Pictures/Skincare1.jpg'),
        fondo: '#f0e0ff',
    },
    {
        id: '4',
        nombre: 'Teddy',
        precio: '$250',
        tiempo: '20 hours ago',
        categoria: 'Juguetes',
        imagen: require('../../Pictures/Sombra.jpg'),
        fondo: '#f0e0ff'
    }
];

export default function Producs({ categoriaSeleccionada }) {
    const filtrados =
        categoriaSeleccionada === 'Todos'
            ? Producs
            : Producs.filter((p) => p.cate=== categoriaSeleccionada);

    return (
        <FlatList
            data={filtrados}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.container}
            renderItem={({ item }) => (
                <View style={[styles.card, { backgroundColor: item.fondo }]}>
                   <Image source={item.imagen} style={styles.image} />


                    <Text style={styles.price}>{item.precio}</Text>
                    <Text style={styles.name}>{item.nombre}</Text>
                    <Text style={styles.time}>{item.tiempo}</Text>
                    <TouchableOpacity style={styles.heart}>
                        <Entypo name="heart-outlined" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            )}
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
});
