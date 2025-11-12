import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { db } from "../database/firebaseconfig";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import FormularioMarcas from "../Admin/FormularioMarcas";
import TablaMarcas from "../Admin/TablaMarcas";

const Marcas = () => {
  const [nuevaMarca, setNuevaMarca] = useState({
    Marca: "",
    IDentificador: "",
  });

  const [Marcas, setMarcas] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [marcaId, setMarcaId] = useState(null);

  const manejoCambio = (campo, valor) => {
    setNuevaMarca((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const guardarMarca = async () => {
    const { Marca, IDentificador } = nuevaMarca;

    if (Marca && IDentificador) {
      try {
        await addDoc(collection(db, "Marcas"), {
          Marca,
          IDentificador,
        });
        cargarDatos();
        setNuevaMarca({
          Marca: "",
          IDentificador: "",
        });
      } catch (error) {
        console.error("Error al registrar marca:", error);
      }
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Marcas"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMarcas(data);
    } catch (error) {
      console.error("Error al obtener documentos de marcas:", error);
    }
  };

  const actualizarMarca = async () => {
    try {
      if (nuevaMarca.Marca && nuevaMarca.IDentificador) {
        await updateDoc(doc(db, "Marcas", marcaId), {
          Marca: nuevaMarca.Marca,
          IDentificador: nuevaMarca.IDentificador,
        });
        setNuevaMarca({
          Marca: "",
          IDentificador: "",
        });
        setModoEdicion(false);
        setMarcaId(null);
        cargarDatos();
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al actualizar la marca.", error);
    }
  };

  const editarMarca = (marca) => {
    setNuevaMarca({
      Marca: marca.Marca,
      IDentificador: marca.IDentificador,
    });
    setMarcaId(marca.id);
    setModoEdicion(true);
  };

  const eliminarMarca = async (id) => {
    try {
      await deleteDoc(doc(db, "Marcas", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar marca:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <TablaMarcas
        Marcas={Marcas}
        editarMarca={editarMarca}
        eliminarMarca={eliminarMarca}
        ListHeaderComponent={() => (
          <FormularioMarcas
            nuevaMarca={nuevaMarca}
            manejoCambio={manejoCambio}
            guardarMarca={guardarMarca}
            actualizarMarca={actualizarMarca}
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

export default Marcas;