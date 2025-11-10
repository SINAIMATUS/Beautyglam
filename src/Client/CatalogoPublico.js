import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Cate from "./CateClient";
import ProductsClient from "./ProductsClient";

export default function CatalogoPublico() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const rol = await AsyncStorage.getItem("rol");
        if (rol === "admin") {
          navigation.replace("AdminTabs");
        } else if (rol === "cliente") {
          navigation.replace("ClienteTabs");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../Imagenes/2.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.subHeader}>
            <Text style={styles.titulo}>BeautyGlam</Text>
            <TouchableOpacity
              style={styles.botonLogin}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.textoLogin}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Buscar producto..."
          value={busqueda}
          onChangeText={setBusqueda}
          placeholderTextColor="#999"
        />

        <Cate onSelectCategoria={setCategoriaSeleccionada} />
        <ProductsClient
          categoriaSeleccionada={categoriaSeleccionada}
          filtroNombre={busqueda}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logo: {
    width: 80,
    height: 40,
  },
  headerContainer: {
    width: '100%',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: '100%',
    marginTop: 5,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  botonLogin: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 5,
  },
  textoLogin: {
    color: "#78032aff",
    fontSize: 12,
    fontWeight: "600",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: "#333",
  },
});
