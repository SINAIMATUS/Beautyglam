import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const Cate= [
    { nombre: 'Todos', icono: 'th-large' },
    { nombre: 'Ropa', icono: 'tshirt' },
    { nombre: 'Electrónica', icono: 'mobile-alt' },
    { nombre: 'Juguetes', icono: 'puzzle-piece' },
    { nombre: 'Deportes', icono: 'football-ball' },

];


export default function Cate({ onSelectCategoria }) {
    return (
        <View style={styles.wrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {Cate.map((cat) => (
                    <TouchableOpacity key={cat.nombre} style={styles.item} onPress={() => onSelectCategoria(cat.nombre)}>
                        <FontAwesome5 name={cat.icono} size={26} color="#a080f1ff" />
                        <Text style={styles.label}>{cat.nombre}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fff',
        paddingVertical: 10,
    },
    scroll: {
        paddingHorizontal: 15,
        alignItems: 'center',
    },
    item: {
        alignItems: 'center',
        marginRight: 20,
        width: 70,
    },
    label: {
        marginTop: 5,
        fontSize: 9,
        textAlign: 'center',
        color: '#a080f1ff',
        fontWeight: 'bold',
    },
});
