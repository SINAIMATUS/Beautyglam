import React, { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Platform } from "react-native";
import { db } from "../database/firebaseconfig";
import { collection, doc, addDoc, updateDoc } from "firebase/firestore";
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

    // Este efecto se ejecuta cada vez que la pantalla se enfoca
    useFocusEffect(
        React.useCallback(() => {
            // Si se pasaron parámetros de un producto, entra en modo edición
            if (route.params?.producto) {
                editarProducto(route.params.producto);
            } else {
                // Si no hay parámetros, asegúrate de que el formulario esté limpio
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
                // Navega de vuelta a la lista después de actualizar
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
            Precio: producto.Precio.toString(),
            Descripcion: producto.Descripcion,
            Categoria: producto.Categoria,
            Marca: producto.Marca,
            Stock: producto.Stock,
            Foto: producto.Foto,
        });
        setProductoId(producto.id);
        setModoEdicion(true);
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
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    cabeceraDelgada: {
        height: 33, // Puedes ajustar esta altura como prefieras
        backgroundColor: '#78032aff',
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        left: 15,
        top: 10, // Ajusta para centrar verticalmente
    },
    content: {
        padding: 18,
    },
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
});

export default Productos;