import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { db } from "../database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import TablaProductos from "../Admin/TablaProductos";
import { useNavigation } from "@react-navigation/native";

const ProductosLista = () => {
  const [productos, setProductos] = useState([]);
  const navigation = useNavigation();
  
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

  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, "Productos", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const handleEditarProducto = (producto) => {
    // Navega al formulario y pasa el producto para editar
    navigation.navigate("ProductoFormulario", { producto: producto });
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <TablaProductos
        Productos={productos}
        editarProducto={handleEditarProducto}
        eliminarProducto={eliminarProducto}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0", padding: 18 },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D96C9F",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default ProductosLista;