import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';



const BotonEliminarCategoria = ({ firebaseId, eliminarCategoria }) => {
    const [visible, setVisible] = useState(false);

    const confirmarEliminar = () => {
        setVisible(false);
        eliminarCategoria(firebaseId);
    };

    return (
        <View>
            <TouchableOpacity style={styles.botonIcono} onPress={() => setVisible(true)}>
                <MaterialIcons name="delete" size={24} color="#a00a46" />
            </TouchableOpacity>

            <Modal visible={visible} transparent animationType="fade">
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.titulo}>¿Eliminar esta categoría?</Text>
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
        backgroundColor: '#ffffffff',
        padding: 24,
        borderRadius: 12,
        width: '80%',
        alignItems: 'center',
    },
    titulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#ffffffff',
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
        backgroundColor: '#fce4ec',
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
        backgroundColor: '#fce4ec',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
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

export default BotonEliminarCategoria;
