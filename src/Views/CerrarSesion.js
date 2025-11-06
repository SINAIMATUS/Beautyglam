import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

export default function CerrarSesion() {
  const navigation = useNavigation();

  useEffect(() => {
    const cerrarSesion = async () => {
      try {
        const auth = getAuth();
        await signOut(auth); // Cierra sesión en Firebase
        await AsyncStorage.removeItem("rol");
        await AsyncStorage.removeItem("uid");
        navigation.replace("CatalogoPublico"); // Redirige al catálogo público
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
      }
    };

    cerrarSesion();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#78032aff" />
      <Text style={styles.texto}>Cerrando sesión...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  texto: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});
