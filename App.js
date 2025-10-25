import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { db } from "./src/database/firebaseconfig"
import { collection, getDocs } from "firebase/firestore";


export default function App() {
  const [Productos, setProductos] = useState([]);

  useEffect(() => {
    const fetData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Productos"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),

        }));
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener documentos:", error);
      }
    };
    fetData();
  }, []);


  return (
    <View style={StyleSheet.cotainer}>
      <Text style={styles.titulo}>Lista de Productos</Text>
      <FlatList
        data={Productos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.Nombre} - ${item.Precio} - {item.Descripcion} - {item.CodigoDeProducto} - {item.Categoria}
          </Text>
        )}
      />
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    fontSize: 18,
    marginBottom: 5
  },
});
