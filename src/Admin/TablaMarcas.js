import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import BotonEliminarMarca from "./BotonEliminarMarca";

const TablaMarcas = ({ Marcas, editarMarca, eliminarMarca, ListHeaderComponent }) => {
  const renderItem = ({ item }) => (
    <View style={styles.fila}>
      <View style={styles.info}>
        <Text style={styles.texto}>🏷️ {item.Marca}</Text>
        <Text style={styles.subtexto}>ID: {item.IDentificador}</Text>
      </View>
      <View style={styles.botones}>
        <TouchableOpacity style={styles.botonEditar} onPress={() => editarMarca(item)}>
          <Text style={styles.textoBoton}>✏️</Text>
        </TouchableOpacity>
        <BotonEliminarMarca id={item.id} eliminarMarca={eliminarMarca} />
      </View>
    </View>
  );

  return (
    <FlatList
      data={Marcas}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.lista}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
};

const styles = StyleSheet.create({
  lista: {
    paddingVertical: 10,
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  info: {
    flex: 1,
  },
  texto: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  subtexto: {
    fontSize: 12,
    color: "#666",
  },
  botones: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  botonEditar: {
    backgroundColor: "#f1c40f",
    padding: 8,
    borderRadius: 6,
  },
  textoBoton: {
    fontSize: 16,
    color: "#fff",
  },
});

export default TablaMarcas;