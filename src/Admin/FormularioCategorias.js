import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native';

const FormularioCategorias = ({
    nuevaCategoria,
    manejoCambio,
    guardarCategoria,
    actualizarCategoria,
    modoEdicion,
}) => {

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>
                {modoEdicion ? "Actualizar Categoria" : "Registro de Categoria"}
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Categoría"
                value={nuevaCategoria.Categoria}
                onChangeText={(valor) => manejoCambio("Categoria", valor)}
            />

            <TextInput
                style={styles.input}
                placeholder="ID"
                value={nuevaCategoria.IDentificador}
                onChangeText={(valor) => manejoCambio("IDentificador", valor)}
                keyboardType="numeric"
            />

            <TouchableOpacity
                style={styles.botonGuardar}
                onPress={modoEdicion ? actualizarCategoria : guardarCategoria}
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
        padding: 20,
        marginTop: 80, // esto empuja el formulario hacia abajo
    },

    titulo: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 14
    },
    input: {
        borderWidth: 3,
        borderColor: "#78032aff",
        padding: 10,
        marginBottom: 16
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

export default FormularioCategorias;
