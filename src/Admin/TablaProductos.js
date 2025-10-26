import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import BotonEliminarProducto from "./BotonEliminarProducto";

const TablaProductos = ({ Productos, eliminarProducto }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Lista de Productos</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.scrollContent}>
                    {Productos.map((item, index) => (
                        <View key={index} style={styles.card}>
                            <Text style={styles.label}>ID: <Text style={styles.value}>{item.CodigoDeProducto}</Text></Text>
                            <Text style={styles.label}>Nombre: <Text style={styles.value}>{item.Nombre}</Text></Text>
                            <Text style={styles.label}>Precio: <Text style={styles.value}>${item.Precio}</Text></Text>
                            <Text style={styles.label}>Descripción: <Text style={styles.value}>{item.Descripcion}</Text></Text>
                            <Text style={styles.label}>Categoría: <Text style={styles.value}>{item.Categoria}</Text></Text>

                            <View style={styles.actions}>
                                <BotonEliminarProducto id={item.id} eliminarProducto={eliminarProducto} />
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 80, // espacio para el botón rosa
    },
    titulo: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 16,
        color: "#000000ff",
    },
    scrollContent: {
        flexDirection: "row",
        gap: 12,
    },
    card: {
        backgroundColor: "#80208735",
        padding: 16,
        borderRadius: 10,
        width: 280,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#701111ff",
        marginBottom: 4,
    },
    value: {
        fontWeight: "normal",
        color: "#666",
    },
    actions: {
        marginTop: 12,
        alignItems: "center",
    },
});

export default TablaProductos;
