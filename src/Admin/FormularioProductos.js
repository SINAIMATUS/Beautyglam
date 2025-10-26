import React from "react";
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native';

const FormularioProductos = ({
    nuevoProducto,
    manejoCambio,
    guardarProducto,
    actualizarProducto,
    modoEdicion,
}) => {

    const validarYGuardar = () => {
        const { CodigoDeProducto, Nombre, Precio, Descripcion, Categoria } = nuevoProducto;

        if (CodigoDeProducto && Nombre && Precio && Descripcion && Categoria) {
            guardarProducto();
        } else {
            alert("Por favor, complete todos los campos.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>
                {modoEdicion ? "Actualizar Producto" : "Registro de Producto"}
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Código del Producto"
                value={nuevoProducto.CodigoDeProducto}
                onChangeText={(valor) => manejoCambio("CodigoDeProducto", valor)}
                keyboardType="numeric"
            />

            <TextInput
                style={styles.input}
                placeholder="Nombre del Producto"
                value={nuevoProducto.Nombre}
                onChangeText={(valor) => manejoCambio("Nombre", valor)}
            />

            <TextInput
                style={styles.input}
                placeholder="Precio"
                value={nuevoProducto.Precio}
                onChangeText={(valor) => manejoCambio("Precio", valor)}
                keyboardType="numeric"
            />

            <TextInput
                style={styles.input}
                placeholder="Descripción"
                value={nuevoProducto.Descripcion}
                onChangeText={(valor) => manejoCambio("Descripcion", valor)}
            />

            <TextInput
                style={styles.input}
                placeholder="Categoría"
                value={nuevoProducto.Categoria}
                onChangeText={(valor) => manejoCambio("Categoria", valor)}
                keyboardType="numeric"
            />

            <TouchableOpacity
                style={styles.botonGuardar}
                onPress={modoEdicion ? actualizarProducto : guardarProducto}
            >
                <Text style={styles.textoBoton}>
                    {modoEdicion ? "ACTUALIZAR" : "GUARDAR"}
                </Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 12, // menos espacio vertical
        backgroundColor: "#fff",
    },
    titulo: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#701111ff",
        textAlign: "center",
    },
    input: {
        borderWidth: 2,
        borderColor: "#78032aff",
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginBottom: 10,
        borderRadius: 8,
        height: 38, // más compacto
        width: "100%", // ocupa todo el ancho disponible
    },
    botonGuardar: {
        backgroundColor: "#701111ff",
        paddingVertical: 9,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 13,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        width: "60%", // botón alargado
    },
    textoBoton: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 1,
    },
});


export default FormularioProductos;
