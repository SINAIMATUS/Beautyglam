import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { db } from "../database/firebaseconfig";
import { addDoc, collection } from "firebase/firestore";

const FormularioProductos = ({ cargarDatos }) => {
    const [CodigoDeProducto, setCodigoDeProducto] = useState("");
    const [Nombre, setNombre] = useState("");
    const [Precio, setPrecio] = useState("");
    const [Descripcion, setDescripcion] = useState("");
    const [Categoria, setCategoria] = useState("");

    const guardarProducto = async () => {
        if (CodigoDeProducto && Nombre && Precio && Descripcion && Categoria) {
            try {
                await addDoc(collection(db, "Productos"), {
                    codigodeproducto: CodigoDeProducto,
                    Nombre: Nombre,
                    Precio: parseFloat(Precio),
                    Descripcion: Descripcion,
                    Categoria: Categoria,
                });
                setCodigoDeProducto("");
                setNombre("");
                setPrecio("");
                setDescripcion("");
                setCategoria("");
                cargarDatos("");
            } catch (error) {
                console.error("Error al registrar el producto")
            }

        } else {
            alert("Por favor , complete todos los campos.");
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Registro de Productos</Text>

            <TextInput
                style={styles.input}
                placeholder="Codigo del Producto"
                value={CodigoDeProducto}
                onChangeText={setCodigoDeProducto}
                keyboardType="numeric"
            />

            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={Nombre}
                onChangeText={setNombre}
            />
            <TextInput
                style={styles.input}
                placeholder="Precio"
                value={Precio}
                onChangeText={setPrecio}
                keyboardType="numeric"
            />

            <TextInput
                style={styles.input}
                placeholder="Descripcion"
                value={Descripcion}
                onChangeText={setDescripcion}
            />

            <TextInput
                style={styles.input}
                placeholder="Categoria"
                value={Categoria}
                onChangeText={setCategoria}
                keyboardType="numeric"
            />
            <Button title="Guardar" onPress={guardarProducto} />

        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    titulo: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },
    input: { borderWidth: 2, borderColor: "#78032aff", padding: 3, marginBottom: 13},
});
export default FormularioProductos;