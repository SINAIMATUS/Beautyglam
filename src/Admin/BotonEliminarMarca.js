import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';



const BotonEliminarMarca = ({ id, eliminarMarca }) => {
    const [visible, setVisible] = useState(false);

    const confirmarEliminar = () => {
        setVisible(false);
        eliminarMarca(id);
    };

    return (
        <View>
            <TouchableOpacity style={styles.botonIcono} onPress={() => setVisible(true)}>
                <MaterialIcons name="delete" size={24} color="#a00a46" />
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.titulo}>¿Eliminar esta marca?</Text>
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
        backgroundColor: 'rgba(121, 56, 96, 0.68)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#edd3e0ff',
        padding: 24,
        borderRadius: 12,
        width: '80%',
        alignItems: 'center',
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#b91b75d8',
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
    botonIcono: {
        backgroundColor: '#f9d4e0ff',
        padding: 8,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
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
        backgroundColor: '#d4386cff',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "cd3b6cff",
        alignItems: 'center',
        justifyContent: 'center',
    },

    textoCancelar: {
        color: '#000000ff',
        fontWeight: 'bold',
    },
    textoEliminar: {
        color: '#000000ff',
        fontWeight: 'bold',
    },
});

export default BotonEliminarMarca;