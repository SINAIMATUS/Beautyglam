import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import BotonEliminarCategoria from "./BotonEliminarCategoria"

const TablaCategorias = ({ Categorias, eliminarCategoria }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Categorías</Text>

      <View style={styles.encabezado}>
        <Text style={styles.encabezadoTexto}>ID</Text>
        <Text style={styles.encabezadoTexto}>Nombre</Text>
        <Text style={styles.encabezadoTexto}>Acción</Text>
      </View>

      {Categorias.map((item, index) => (
        <View key={index} style={styles.fila}>
          <Text style={styles.celdaId}>{item.IDentificador}</Text>
          <Text style={styles.celdaNombre}>{item.Categoria}</Text>
          <BotonEliminarCategoria
            firebaseId={item.id}
            eliminarCategoria={eliminarCategoria}
          />
        </View>
      ))}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 80, // espacio para navegación inferior
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#000",
  },
  encabezado: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderColor: "#78032aff",
    paddingBottom: 8,
    marginBottom: 8,
  },
  encabezadoTexto: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    color: "#78032aff",
    textAlign: "center",
  },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
  },
  celdaId: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  celdaNombre: {
    flex: 2,
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
});


export default TablaCategorias;
