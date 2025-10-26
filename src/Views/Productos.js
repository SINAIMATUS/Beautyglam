import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { db } from "../database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import FormularioProductos from "../Admin/FormularioProductos";
import TablaProductos from "../Admin/TablaProductos";

const Productos = () => {
    const [nuevoProducto, setNuevoProducto] = useState({
        CodigoDeProducto: "",
        Nombre: "",
        Precio: "",
        Descripcion: "",
        Categoria: "",
    });

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
        const { CodigoDeProducto, Nombre, Precio, Descripcion, Categoria } = nuevoProducto;

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
                });
                cargarDatos();
                setNuevoProducto({
                    CodigoDeProducto: "",
                    Nombre: "",
                    Precio: "",
                    Descripcion: "",
                    Categoria: "",
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
        setNuevoProducto({
            CodigoDeProducto: Productos.CodigoDeProducto,
            Nombre: Productos.Nombre,
            Precio: Productos.Precio.toString(),
            Descripcion: Productos.Descripcion,
            Categoria: Productos.Categoria,
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

        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 18 },
});

export default Productos;
