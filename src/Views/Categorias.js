import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { db } from "../database/firebaseconfig"
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import FormularioCategorias from "../Admin/FormularioCategorias";
import TablaCategorias from "../Admin/TablaCategorias";


const Categorias = () => {
  const [Categoria, setCategoria] = useState([]);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Categoria"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id, // ID real del documento
        ...doc.data(), // incluye IDentificador y Categoria
      }));
      setCategoria(data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  const eliminarCategoria = async (firebaseId) => {
    try {
      await deleteDoc(doc(db, "Categoria", firebaseId));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <FormularioCategorias cargarDatos={cargarDatos} />
      <TablaCategorias
        Categorias={Categoria}
        eliminarCategoria={eliminarCategoria}
      />
    </View>
  );
};


const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
});
export default Categorias;
