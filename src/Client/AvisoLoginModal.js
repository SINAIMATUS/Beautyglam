import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

const AvisoLoginModal = ({ visible, onCerrar, onAceptar, mensaje }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCerrar}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.titulo}>
            Necesitas Iniciar Sesión para realizar esta acción
          </Text>
          <Text style={styles.descripcion}>
            {mensaje} ¿Deseas iniciar sesión?
          </Text>

          <View style={styles.botones}>
            <TouchableOpacity style={styles.botonCancelar} onPress={onCerrar}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botonAceptar} onPress={onAceptar}>
              <Text style={styles.textoAceptar}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 15,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
    textAlign: "center",
    // Si tuvieras la fuente 'Calibri' cargada, la añadirías aquí:
    // fontFamily: 'Calibri-Bold',
  },
  descripcion: {
    fontSize: 16,
    color: "#555",
    marginBottom: 25,
    textAlign: "center",
    // fontFamily: 'Calibri',
  },
  botones: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  botonCancelar: {
    backgroundColor: "#e0e0e0",
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  botonAceptar: {
    backgroundColor: "#701111ff",
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    shadowColor: "#701111ff",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8,
  },
  textoCancelar: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    // fontFamily: 'Calibri-Bold',
  },
  textoAceptar: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    // fontFamily: 'Calibri-Bold',
  },
});

export default AvisoLoginModal;