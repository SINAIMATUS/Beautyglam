import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import BotonEliminarProducto from "./BotonEliminarProducto";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

const TablaProductos = ({ Productos, eliminarProducto, editarProducto }) => {
    return (
        <View style={styles.container}>

            <ScrollView showsVerticalScrollIndicator={false}>
                {Productos.map((item, index) => (
                    <View key={index} style={styles.card}>
                        <Text style={styles.label}>ID: <Text style={styles.value}>{item.CodigoDeProducto}</Text></Text>
                        <Text style={styles.label}>Nombre: <Text style={styles.value}>{item.Nombre}</Text></Text>
                        <Text style={styles.label}>Precio: <Text style={styles.value}>${item.Precio}</Text></Text>
                        <Text style={styles.label}>Descripción: <Text style={styles.value}>{item.Descripcion}</Text></Text>
                        <Text style={styles.label}>Categoría: <Text style={styles.value}>{item.Categoria}</Text></Text>

                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={styles.botonActualizar}
                                onPress={() => editarProducto(item)}
                            >
                                <MaterialIcons name="edit" size={24} color="#701111ff" />
                            </TouchableOpacity>

                            <BotonEliminarProducto id={item.id} eliminarProducto={eliminarProducto} />
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 80,
    },
    card: {
        backgroundColor: "#fce4ec", // rosa claro
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#651010ff",
        marginBottom: 4,
    },
    
    botonActualizar: {
        backgroundColor: "#fce4ec",
        padding: 8,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#701111ff",
        alignItems: "center",
        justifyContent: "center",

    },
    value: {
        fontWeight: "normal",
        color: "#666",
    },
    actions: {
        marginTop: 12,
        flexDirection: "row",
        justifyContent: "space-around", // o "flex-start" si quieres alinearlos a la izquierda
        gap: 12, // si usas Expo SDK 48+
    },

});

export default TablaProductos;
