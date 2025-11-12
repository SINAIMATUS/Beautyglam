import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { db } from "../database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import FormularioCategoria from "../Admin/FormularioCategorias";
import TablaCategorias from "../Admin/TablaCategorias";

const Categorias = () => {
  const [nuevaCategoria, setNuevaCategoria] = useState({
    Categoria: "",
    IDentificador: "",
  });

  const [Categorias, setCategorias] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [categoriaId, setCategoriaId] = useState(null);

  const manejoCambio = (campo, valor) => {
    setNuevaCategoria((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const guardarCategoria = async () => {
    const { Categoria, IDentificador } = nuevaCategoria;

    if (Categoria && IDentificador) {
      try {
        await addDoc(collection(db, "Categorias"), {
          Categoria,
          IDentificador,
        });
        cargarDatos();
        setNuevaCategoria({
          Categoria: "",
          IDentificador: "",
        });
      } catch (error) {
        console.error("Error al registrar categoría:", error);
      }
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Categorias"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  const actualizarCategoria = async () => {
    try {
      if (nuevaCategoria.Categoria && nuevaCategoria.IDentificador) {
        await updateDoc(doc(db, "Categorias", categoriaId), {
          Categoria: nuevaCategoria.Categoria,
          IDentificador: nuevaCategoria.IDentificador,
        });
        setNuevaCategoria({
          Categoria: "",
          IDentificador: "",
        });
        setModoEdicion(false);
        setCategoriaId(null);
        cargarDatos();
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al actualizar la categoría.", error);
    }
  };

  const editarCategoria = (categoria) => {
    setNuevaCategoria({
      Categoria: categoria.Categoria,
      IDentificador: categoria.IDentificador,
    });
    setCategoriaId(categoria.id);
    setModoEdicion(true);
  };

  const eliminarCategoria = async (id) => {
    try {
      await deleteDoc(doc(db, "Categorias", id));
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
      <TablaCategorias
        Categorias={Categorias}
        editarCategoria={editarCategoria}
        eliminarCategoria={eliminarCategoria}
        ListHeaderComponent={() => (
          <FormularioCategoria
            nuevaCategoria={nuevaCategoria}
            manejoCambio={manejoCambio}
            guardarCategoria={guardarCategoria}
            actualizarCategoria={actualizarCategoria}
            modoEdicion={modoEdicion}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 18,
  },
});

export default Categorias;