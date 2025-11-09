import React from "react";
import { View,TextInput,StyleSheet,Text,Image,TouchableOpacity,} from "react-native";
import SelectorCategoriaModal from "./SelectorCategoriaModal";

const FormularioProductos = ({
  nuevoProducto,
  manejoCambio,
  guardarProducto,
  actualizarProducto,
  modoEdicion,
  seleccionarImagen,
}) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../Imagenes/2.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <TextInput
        style={styles.input}
        placeholder="Código del Producto"
        value={nuevoProducto.CodigoDeProducto}
        onChangeText={(valor) => manejoCambio("CodigoDeProducto", valor)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Nombre del Producto"
        value={nuevoProducto.Nombre}
        onChangeText={(valor) => manejoCambio("Nombre", valor)}
      />

      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={nuevoProducto.Precio}
        onChangeText={(valor) => manejoCambio("Precio", valor)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={nuevoProducto.Descripcion}
        onChangeText={(valor) => manejoCambio("Descripcion", valor)}
      />

      <SelectorCategoriaModal
        categoriaSeleccionada={nuevoProducto.Categoria}
        onSeleccionar={(valor) => manejoCambio("Categoria", valor)}
      />

      <View
        style={[
          styles.previewContainer,
          !nuevoProducto.Foto && styles.bordeAdvertencia,
        ]}
      >
        {nuevoProducto.Foto ? (
          <Image
            source={{ uri: nuevoProducto.Foto }}
            style={styles.preview}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.mensajePreview}>La imagen se mostrará aquí</Text>
        )}
      </View>

      <View style={styles.botonesFila}>
        <TouchableOpacity
          style={styles.botonImagen}
          onPress={seleccionarImagen}
        >
          <Text style={styles.textoBoton}>📷</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botonGuardar}
          onPress={modoEdicion ? actualizarProducto : guardarProducto}
        >
          <Text style={styles.textoBoton}>
            {modoEdicion ? "ACTUALIZAR" : "GUARDAR"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 15,
  },
  input: {
    borderWidth: 2,
    borderColor: "#78032aff",
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    height: 38,
    width: "100%",
    fontSize: 14,
    color: "#333",
  },
  botonesFila: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  botonImagen: {
    backgroundColor: "#b83964ff",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
  },
  botonGuardar: {
    backgroundColor: "#701111ff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
  },
  textoBoton: {
    color: "#ffffffff",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  previewContainer: {
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 4,
    backgroundColor: "#f9f9f9",
  },
  bordeAdvertencia: {
    borderColor: "#bd0808ff",
  },
  preview: {
    width: "100%",
    height: 120,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  mensajePreview: {
    fontSize: 10,
    color: "#999",
    marginBottom: 10,
    textAlign: "center",
  },
});

export default FormularioProductos;
