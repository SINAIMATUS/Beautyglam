import React from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from "react-native";
import BotonEliminarProducto from "./BotonEliminarProducto";

const TablaProductos = ({ Productos, editarProducto, eliminarProducto }) => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.Foto }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.nombre}>{item.Nombre}</Text>
        <Text style={styles.precio}>${item.Precio}</Text>
        <Text style={styles.categoria}>🛍️{item.Categoria}</Text>
        <Text style={styles.marca}>🏷️ {item.Marca}</Text>
        <Text style={styles.stock}>📦 Stock: {item.Stock}</Text>
        <Text style={styles.descripcion}>{item.Descripcion}</Text>
      </View>
      <View style={styles.botones}>
        <TouchableOpacity style={styles.botonEditar} onPress={() => editarProducto(item)}>
          <Text style={styles.textoBoton}>✏️</Text>
        </TouchableOpacity>
        <BotonEliminarProducto id={item.id} eliminarProducto={eliminarProducto} />
      </View>
    </View>
  );

  return (
    <FlatList
      data={Productos}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.lista}
    />
  );
};

const styles = StyleSheet.create({
  lista: {
    paddingVertical: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  precio: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#a00a46ca",
  },
  categoria: {
    fontSize: 12,
    color: "#666",
  },
  marca: {
    fontSize: 12,
    color: "#666",
  },
  stock: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  descripcion: {
    fontSize: 12,
    color: "#999",
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

export default TablaProductos;