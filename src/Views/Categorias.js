import React, { useEffect, useState } from "react";
import { SafeAreaView , StyleSheet } from "react-native";
import { db } from "../database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import FormularioCategoria from '../Admin/FormularioCategorias';
import TablaCategorias from '../Admin/TablaCategorias';


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

    if (
      Categoria &&
      IDentificador
    ) {
      try {
        await addDoc(collection(db, "Categoria"), {
          Categoria,
          IDentificador
        });
        cargarDatos();
        setNuevaCategoria({
          Categoria: "",
          IDentificador: "",
        });
      } catch (error) {
        console.error("Error al registrar  la categoria:", error);
      }
    } else {
      alert("Por favor, complete todos los campos correctamente.");
    }
  };


  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Categoria"));
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
        await updateDoc(doc(db, "Categoria", categoriaId), {
          Categoria: nuevaCategoria.Categoria,
          IDentificador: nuevaCategoria.IDentificador,
        });
        setNuevaCategoria({ Categoria: "", IDentificador: "", });

        setModoEdicion(false);//VOLVER AL MODO REGISTRO
        setCategoriaId(null);

        cargarDatos();
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al actualizar la categoria.", error)
    }
  };

  const editarCategoria = (Categorias) => {
    setNuevaCategoria({
      Categoria: Categorias.Categoria,
      IDentificador: Categorias.IDentificador
    });
    setCategoriaId(Categorias.id);
    setModoEdicion(true);
  };



  const eliminarCategoria = async (id) => {
    try {
      await deleteDoc(doc(db, "Categoria", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FormularioCategoria
        nuevaCategoria={nuevaCategoria}
        manejoCambio={manejoCambio}
        guardarCategoria={guardarCategoria}
        actualizarCategoria={actualizarCategoria}
        modoEdicion={modoEdicion}

      />
      <TablaCategorias
        Categorias={Categorias}
        editarCategoria={editarCategoria}
        eliminarCategoria={eliminarCategoria}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 18 },
});

export default Categorias;
