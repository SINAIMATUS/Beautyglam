import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import BotonEliminarCategoria from "./BotonEliminarCategoria"
import { TouchableOpacity } from 'react-native'; // 
import { MaterialIcons } from '@expo/vector-icons';


const TablaCategorias = ({ Categorias, eliminarCategoria, editarCategoria }) => {
  return (
    <ScrollView style={styles.container}>
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

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.botonActualizar}
              onPress={() => editarCategoria(item)}
            >
              <MaterialIcons name="edit" size={24} color="#701111ff" />
            </TouchableOpacity>

            <BotonEliminarCategoria id={item.id} eliminarCategoria={eliminarCategoria} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 80, // espacio para navegación inferior
  },
  scroll: {
    maxHeight: 300, // ajusta según tu pantalla
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
    paddingVertical: 6, // antes era 10
  },

  celdaId: {
    flex: 1,
    fontSize: 16,
    color: "#000000ff",
    textAlign: "center", // ✅ centrado
  },
  celdaNombre: {
    flex: 2,
    fontSize: 16,
    color: "#000000ff",
    textAlign: "center", // ✅ centrado
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 8, // si usas Expo SDK 49+
  },

  botonActualizar: {
    backgroundColor: "#fce4ec",
    padding: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#701111ff",
    alignItems: "center",
    justifyContent: "center",

  },
});


export default TablaCategorias;
