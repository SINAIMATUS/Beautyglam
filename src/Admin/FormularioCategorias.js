import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { db } from "../database/firebaseconfig";
import { addDoc, collection } from "firebase/firestore";

const FormularioCategorias = ({ cargarDatos }) => {
    const [Categoria, setCategoria] = useState("");
    const [Id, setIDentificador] = useState("");

    const guardarCategorias = async () => {
        if (Categoria && Id) {
            try {
                await addDoc(collection(db, "Categoria"), {
                    Categoria: Categoria,
                    IDentificador: parseInt(Id),
                });
                setCategoria("");
                setIDentificador("");
                cargarDatos();
            } catch (error) {
                console.error("Error al registrar la categoría:", error);
            }
        } else {
            alert("Por favor, complete todos los campos.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Categorías</Text>

            <TextInput
                style={styles.input}
                placeholder="Categoría"
                value={Categoria}
                onChangeText={setCategoria}
            />

            <TextInput
                style={styles.input}
                placeholder="ID"
                value={Id}
                onChangeText={setIDentificador}
                keyboardType="numeric"
            />

            <Button title="Guardar" onPress={guardarCategorias} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    titulo: { fontSize: 18, fontWeight: "bold", marginBottom: 14 },
    input: { borderWidth: 3, borderColor: "#78032aff", padding: 10, marginBottom: 16 },
});

export default FormularioCategorias;
