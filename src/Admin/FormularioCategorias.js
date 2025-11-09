import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text, Image } from 'react-native';
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
            <Image
              source={require("../Imagenes/2.png")}
              style={styles.logo}
              resizeMode="contain"
            />
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
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    logo: {
        width: 80,
        height: 80,
        alignSelf: 'flex-start',
        marginBottom: 15,
    },
    titulo: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 14,
        alignSelf: 'flex-start',
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
