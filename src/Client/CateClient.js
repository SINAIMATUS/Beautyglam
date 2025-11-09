import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../database/firebaseconfig';


export default function Cate({ onSelectCategoria }) {
  const [seleccionada, setSeleccionada] = useState('Todos');
  const [categorias, setCategorias] = useState(['Todos']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Categorias'));
        const categoriasList = querySnapshot.docs.map(
          (doc) => doc.data().Categoria
        );
        setCategorias(['Todos', ...categoriasList]);
      } catch (error) {
        console.error('Error fetching categories: ', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategorias();
  }, []);

  const handlePress = (categoria) => {
    setSeleccionada(categoria);
    onSelectCategoria(categoria);
  };

  return (
    <View style={styles.wrapper}>
      {loading && <ActivityIndicator color="#78032aff" />}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {categorias.map((categoria) => (
          <TouchableOpacity
            key={categoria}
            style={[
              styles.boton,
              seleccionada === categoria && styles.botonActivo,
            ]}
            onPress={() => handlePress(categoria)}
          >
            <Text
              style={[
                styles.texto,
                seleccionada === categoria && styles.textoActivo,
              ]}
            >
              {categoria}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },
  container: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  boton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonActivo: {
    backgroundColor: '#78032aff',
  },
  texto: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  textoActivo: {
    color: '#fff',
  },
});