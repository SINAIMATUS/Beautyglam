import React, { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from 'expo-sharing';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Platform, Alert } from "react-native";
import { db } from "../database/firebaseconfig";
import { collection, doc, addDoc, updateDoc, getDocs } from "firebase/firestore";
import FormularioProductos from "../Admin/FormularioProductos";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';

const Productos = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [nuevoProducto, setNuevoProducto] = useState({
    CodigoDeProducto: "",
    Nombre: "",
    Precio: "",
    Descripcion: "",
    Categoria: "",
    Marca: "",
    Foto: "",
    Stock: "",
  });

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.producto) {
        editarProducto(route.params.producto);
      } else {
        setModoEdicion(false);
        setProductoId(null);
        setNuevoProducto({
          CodigoDeProducto: "",
          Nombre: "",
          Precio: "",
          Descripcion: "",
          Categoria: "",
          Marca: "",
          Stock: "",
          Foto: "",
        });
      }
    }, [route.params?.producto])
  );

  const seleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permiso denegado. Activa el acceso a fotos en la configuración del teléfono.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 0.5,
    });

    if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
      const base64 = `data:image/jpeg;base64,${resultado.assets[0].base64}`;
      setNuevoProducto((prev) => ({
        ...prev,
        Foto: base64,
      }));
    }
  };

  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoId, setProductoId] = useState(null);
  const [notification, setNotification] = useState(null);

  const manejoCambio = (campo, valor) => {
    setNuevoProducto((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const guardarProducto = async () => {
    const { CodigoDeProducto, Nombre, Precio, Descripcion, Categoria, Marca, Foto, Stock } = nuevoProducto;
    const precioConvertido = parseFloat(Precio);

    if (
      CodigoDeProducto &&
      Nombre &&
      Precio &&
      Descripcion &&
      Categoria &&
      Marca &&
      Stock &&
      !isNaN(precioConvertido)
    ) {
      try {
        await addDoc(collection(db, "Productos"), {
          CodigoDeProducto,
          Nombre,
          Precio: precioConvertido,
          Descripcion,
          Categoria,
          Marca,
          Stock,
          Foto,
        });
        setNotification("Producto guardado con éxito");
        setTimeout(() => setNotification(null), 3000);
        setNuevoProducto({
          CodigoDeProducto: "",
          Nombre: "",
          Precio: "",
          Descripcion: "",
          Categoria: "",
          Marca: "",
          Stock: "",
          Foto: "",
        });
      } catch (error) {
        console.error("Error al registrar producto:", error);
      }
    } else {
      alert("Por favor, complete todos los campos correctamente.");
    }
  };

  const actualizarProducto = async () => {
    try {
      if (
        nuevoProducto.CodigoDeProducto &&
        nuevoProducto.Nombre &&
        nuevoProducto.Precio &&
        nuevoProducto.Descripcion &&
        nuevoProducto.Categoria &&
        nuevoProducto.Marca &&
        nuevoProducto.Stock
      ) {
        await updateDoc(doc(db, "Productos", productoId), {
          CodigoDeProducto: nuevoProducto.CodigoDeProducto,
          Nombre: nuevoProducto.Nombre,
          Precio: parseFloat(nuevoProducto.Precio),
          Descripcion: nuevoProducto.Descripcion,
          Categoria: nuevoProducto.Categoria,
          Stock: nuevoProducto.Stock,
          Marca: nuevoProducto.Marca,
          Foto: nuevoProducto.Foto,
        });
        setNuevoProducto({
          CodigoDeProducto: "",
          Nombre: "",
          Precio: "",
          Descripcion: "",
          Categoria: "",
          Marca: "",
          Stock: "",
          Foto: "",
        });
        setModoEdicion(false);
        setProductoId(null);
        setNotification("Producto actualizado con éxito");
        setTimeout(() => setNotification(null), 3000);
        navigation.navigate("ProductosLista");
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al actualizar el producto.", error);
    }
  };

  const editarProducto = (producto) => {
    setNuevoProducto({
      CodigoDeProducto: producto.CodigoDeProducto,
      Nombre: producto.Nombre,
      Precio: producto.Precio?.toString?.() ?? String(producto.Precio ?? ''),
      Descripcion: producto.Descripcion,
      Categoria: producto.Categoria,
      Marca: producto.Marca,
      Stock: producto.Stock,
      Foto: producto.Foto,
    });
    setProductoId(producto.id);
    setModoEdicion(true);
  };

  // Generar Excel a partir de los productos (como inventario)
  const generarExcel = async () => {
    try {
      const productosSnap = await getDocs(collection(db, "Productos"));
      const compras = productosSnap.docs.map((d) => {
        const p = d.data();
        const precio = Number(p.Precio) || 0;
        const cantidad = Number(p.Stock) || 0;
        return {
          fecha: new Date().toISOString(),
          cliente: "Inventario",
          metodoPago: "N/A",
          total: precio * cantidad,
          productos: [
            {
              nombre: p.Nombre || "",
              cantidad,
              subtotal: precio * cantidad,
            },
          ],
        };
      });

      if (!compras.length) {
        Alert.alert("Sin datos", "No hay productos para exportar.");
        return;
      }

      const response = await fetch("https://tpo180rx1d.execute-api.us-east-2.amazonaws.com/generarexcel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ compras, opciones: { formatoMes: "es-NI" } }),
      });

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      const base64 = await response.text();
      const fileUri = FileSystem.documentDirectory + "reporte-productos.xlsx";

      await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: "base64" });

      Alert.alert("Excel generado", "El archivo se guardó correctamente y está listo para compartir.");

      await Sharing.shareAsync(fileUri, {
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        dialogTitle: "Compartir reporte",
        UTI: "com.microsoft.excel.xlsx",
      });
    } catch (error) {
      console.error("Error generando Excel:", error);
      Alert.alert("Error", "No se pudo generar el Excel.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cabeceraDelgada}>
        {modoEdicion && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {notification && <Text style={styles.notification}>{notification}</Text>}

      <View style={styles.content}>
        <FormularioProductos
          nuevoProducto={nuevoProducto}
          manejoCambio={manejoCambio}
          guardarProducto={guardarProducto}
          actualizarProducto={actualizarProducto}
          modoEdicion={modoEdicion}
          seleccionarImagen={seleccionarImagen}
        />

        <TouchableOpacity
          style={styles.botonNavegacion}
          onPress={() => navigation.navigate("ProductosLista")}
        >
          <Text style={styles.textoBotonNavegacion}>Ver Lista de Productos</Text>
        </TouchableOpacity>

        {/* Botón para generar Excel */}
        <TouchableOpacity style={styles.botonExcel} onPress={generarExcel}>
          <Text style={styles.textoBotonExcel}>📊 Generar Excel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f0f0' },
  cabeceraDelgada: {
    height: 33,
    backgroundColor: '#78032aff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 6,
  },
  content: { padding: 18 },
  botonNavegacion: {
    backgroundColor: '#701111ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  textoBotonNavegacion: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  notification: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: 12,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    borderRadius: 5,
    margin: 10,
  },
  botonExcel: {
    backgroundColor: '#78032aff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
    marginBottom: 30,
  },
  textoBotonExcel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default Productos;