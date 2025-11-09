import React, { useState } from "react";
import {View,TextInput, StyleSheet, Text, Alert, Image, TouchableOpacity} from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const auth = getAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Campos vacíos", "Por favor ingresa tu correo y contraseña.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      let rol = "";
      if (email === "admin@gmail.com") {
        rol = "admin";
        navigation.reset({ index: 0, routes: [{ name: "AdminTabs" }] });
      } else if (email === "cliente@gmail.com") {
        rol = "cliente";
        navigation.reset({ index: 0, routes: [{ name: "ClienteTabs" }] });
      } else {
        Alert.alert("Error de rol", "Este usuario no tiene un rol asignado.");
        return;
      }

      await AsyncStorage.setItem("rol", rol);
      await AsyncStorage.setItem("uid", user.uid);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Alert.alert("Error", "Credenciales incorrectas o usuario no registrado.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back-circle-outline" size={32} color="#555" />
      </TouchableOpacity>
      <Image
        source={require("../Imagenes/2.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.titulo}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#999"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Ingresar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 5,
    fontWeight: '600',
  },
  logo: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginBottom: 30,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    color: "#333",
  },
  loginButton: {
    backgroundColor: '#701111ff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
