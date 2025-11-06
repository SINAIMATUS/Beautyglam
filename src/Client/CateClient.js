import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const categorias = ['Todos', 'Maquillaje', 'Skincare', 'Dermocosmeticos'];

export default function Cate({ onSelectCategoria }) {
  const [seleccionada, setSeleccionada] = useState('Todos');

  const handlePress = (categoria) => {
    setSeleccionada(categoria);
    onSelectCategoria(categoria);
  };

  return (
    <View style={styles.wrapper}>
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