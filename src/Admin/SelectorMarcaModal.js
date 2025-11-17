import React, { useState, useCallback } from "react";
import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet, } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../database/firebaseconfig";

export default function SelectorMarcaModal({
  marcaSeleccionada,
  onSeleccionar,
}) {
  const [marcas, setMarcas] = useState([]);
  const [visible, setVisible] = useState(false);

  // Usamos useFocusEffect para que las marcas se recarguen cada vez que la pantalla obtiene el foco.
  useFocusEffect(
    useCallback(() => {
      const cargarMarcas = async () => {
        try {
          const snapshot = await getDocs(collection(db, "Marcas"));
          const lista = snapshot.docs.map((doc) => doc.data().Marca);
          setMarcas(lista);
        } catch (error) {
          console.error("Error al cargar las Marcas:", error);
        }
      };

      cargarMarcas();
    }, [])
  );

  const seleccionar = (marca) => {
    onSeleccionar(marca);
    setVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.boton} onPress={() => setVisible(true)}>
        <Text style={styles.textoBoton}>
          {marcaSeleccionada || "Seleccionar marca"}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.titulo}>Selecciona una marca</Text>
            <FlatList
              data={marcas}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.opcion}
                  onPress={() => seleccionar(item)}
                >
                  <Text style={styles.textoOpcion}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.cancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },
  boton: {
    borderWidth: 2,
    borderColor: "#78032aff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  textoBoton: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "80%",
    maxHeight: "70%",
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#78032aff",
  },
  opcion: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  textoOpcion: {
    fontSize: 16,
    color: "#333",
  },
  cancelar: {
    marginTop: 10,
    textAlign: "center",
    color: "#a00a46",
    fontWeight: "bold",
  },
});
