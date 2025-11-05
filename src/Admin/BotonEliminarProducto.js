import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';


const BotonEliminarProducto = ({ id, eliminarProducto }) => {
  const [visible, setVisible] = useState(false);

  const confirmarEliminar = () => {
    setVisible(false);
    eliminarProducto(id);
  };

  return (
    <View>
      {/* Botón pequeño */}
      <TouchableOpacity style={styles.iconoBoton} onPress={() => setVisible(true)}>
        <MaterialIcons name="delete" size={24} color="#a00a46" />
      </TouchableOpacity>


      {/* Modal de Confirmación */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.titulo}>¿Eliminar este producto?</Text>
            <Text style={styles.descripcion}>Esta acción no se puede deshacer.</Text>

            <View style={styles.botones}>
              <TouchableOpacity style={styles.botonCancelar} onPress={() => setVisible(false)}>
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.botonEliminar} onPress={confirmarEliminar}>
                <Text style={styles.textoEliminar}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#c5356fff',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#980558ff',
    textAlign: 'center',
  },
  descripcion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000ff',
    marginBottom: 20,
    textAlign: 'center',
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  iconoBoton: {
    backgroundColor: '#fce4ec',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#a00a46',
  },
  botonCancelar: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
    flex: 1,
    alignItems: 'center',
  },
  botonEliminar: {
    backgroundColor: '#a00a46ca',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  textoCancelar: {
    color: '#000000ff',
    fontWeight: 'bold',
  },
  textoEliminar: {
    color: '#ffffffff',
    fontWeight: 'bold',
  },
});

export default BotonEliminarProducto;