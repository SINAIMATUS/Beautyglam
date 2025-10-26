import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { db } from "../database/firebaseconfig"
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import FormularioProductos from "../Admin/FormularioProductos";
import TablaProductos from "../Admin/TablaProductos";


const Productos = () => {
    const [Productos, setProductos] = useState([]);

    const cargarDatos = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Productos"));
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProductos(data);
        } catch (error) {
            console.error("Error al obtener documentos:", error);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);



    const eliminarProducto = async (id) => {
        try {
            await deleteDoc(doc(db, "Productos", id));
            cargarDatos();
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    return (
        <View style={styles.container}>
            <FormularioProductos cargarDatos={cargarDatos} />
            <TablaProductos
                Productos={Productos}
                eliminarProducto={eliminarProducto}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 18 },
});
export default Productos;

