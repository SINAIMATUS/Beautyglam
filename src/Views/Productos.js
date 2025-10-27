import React, { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { View, StyleSheet } from "react-native";
import { db } from "../database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import FormularioProductos from "../Admin/FormularioProductos";
import TablaProductos from "../Admin/TablaProductos";
import { useNavigation } from "@react-navigation/native";

const Productos = () => {
    const navigation = useNavigation();
    const [nuevoProducto, setNuevoProducto] = useState({
        CodigoDeProducto: "",
        Nombre: "",
        Precio: "",
        Descripcion: "",
        Categoria: "",
        Foto: "",
    });
    //FUNCIONALIDAD PARA AGREGAR IMAGEN

    const seleccionarImagen = async () => {
        // Solicitar permiso
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permiso denegado. Activa el acceso a fotos en la configuración del teléfono.');
            return;
        }

        // Abrir galería
        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            base64: true,
            quality: 0.5,
        });

        // Verificar resultado
        if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
            const base64 = `data:image/jpeg;base64,${resultado.assets[0].base64}`;
            console.log("Imagen seleccionada:", base64); // ✅ Verifica en consola
            setNuevoProducto((prev) => ({
                ...prev,
                Foto: base64,
            }));
        } else {
            console.log("No se seleccionó ninguna imagen.");
        }
    };



    const [Productos, setProductos] = useState([]);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [productoId, setProductoId] = useState(null);

    const manejoCambio = (campo, valor) => {
        setNuevoProducto((prev) => ({
            ...prev,
            [campo]: valor,
        }));
    };

    const guardarProducto = async () => {
        const { CodigoDeProducto, Nombre, Precio, Descripcion, Categoria, Foto } = nuevoProducto;

        const precioConvertido = parseFloat(Precio);

        if (
            CodigoDeProducto &&
            Nombre &&
            Precio &&
            Descripcion &&
            Categoria &&
            !isNaN(precioConvertido)
        ) {
            try {
                await addDoc(collection(db, "Productos"), {
                    CodigoDeProducto,
                    Nombre,
                    Precio: precioConvertido,
                    Descripcion,
                    Categoria,
                    Foto,
                });
                cargarDatos();
                setNuevoProducto({
                    CodigoDeProducto: "",
                    Nombre: "",
                    Precio: "",
                    Descripcion: "",
                    Categoria: "",
                    Foto: "",
                });
            } catch (error) {
                console.error("Error al registrar producto:", error);
            }
        } else {
            alert("Por favor, complete todos los campos correctamente.");
        }
    };


    const cargarDatos = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Productos"));
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProductos(data);
        } catch (error) {
            console.error("Error al obtener documentos:", error);
        }
    };

    const actualizarProducto = async () => {
        try {
            if (nuevoProducto.CodigoDeProducto && nuevoProducto.Nombre && nuevoProducto.Precio && nuevoProducto.Descripcion && nuevoProducto.Categoria) {
                await updateDoc(doc(db, "Productos", productoId), {
                    CodigoDeProducto: nuevoProducto.CodigoDeProducto,
                    Nombre: nuevoProducto.Nombre,
                    Precio: parseFloat(nuevoProducto.Precio),
                    Descripcion: nuevoProducto.Descripcion,
                    Categoria: nuevoProducto.Categoria,
                    Foto: nuevoProducto.Foto,
                });
                setNuevoProducto({ CodigoDeProducto: "", Nombre: "", Precio: "", Descripcion: "", Categoria: "" });

                setModoEdicion(false);//VOLVER AL MODO REGISTRO
                setProductoId(null);

                cargarDatos();
            } else {
                alert("Por favor, complete todos los campos.");
            }
        } catch (error) {
            console.error("Error al actualizar el producto.", error)
        }
    };

    const editarProducto = (Productos) => {
        navigation.navigate('editarProducto', { Productos: item });
        setNuevoProducto({
            CodigoDeProducto: Productos.CodigoDeProducto,
            Nombre: Productos.Nombre,
            Precio: Productos.Precio.toString(),
            Descripcion: Productos.Descripcion,
            Categoria: Productos.Categoria,
            Foto: Productos.Foto,
        });
        setProductoId(Productos.id);
        setModoEdicion(true);
    };



    const eliminarProducto = async (id) => {
        try {
            await deleteDoc(doc(db, "Productos", id));
            cargarDatos();
        } catch (error) {
            console.error("Error al eliminar:", error);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    return (
        <View style={styles.container}>
            <FormularioProductos
                nuevoProducto={nuevoProducto}
                manejoCambio={manejoCambio}
                guardarProducto={guardarProducto}
                actualizarProducto={actualizarProducto}
                modoEdicion={modoEdicion}

            />
            <TablaProductos
                Productos={Productos}
                editarProducto={editarProducto}
                eliminarProducto={eliminarProducto}
            />
            <View style={{
                backgroundColor: '#1b2',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}

            >
                <Text>Productos</Text>
                <Button tittle='ZZZZZ' onPress={() => navigation.navigate("ProductStack")}></Button>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 18 },
});

export default Productos;
