import React, { useState } from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator} from 'react-native';
import { useApp } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function Checkout() {
    const { totalCarrito, realizarCompra } = useApp();
    const navigation = useNavigation();

    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');
    const [cedula, setCedula] = useState('');
    const [metodoPago, setMetodoPago] = useState(null); // 'Tarjeta' o 'Paypal'
    const [cargando, setCargando] = useState(false);

    const handleConfirmarCompra = async () => {
        if (!nombre || !telefono || !direccion || !cedula || !metodoPago) {
            Alert.alert('Campos Incompletos', 'Por favor, rellena todos los datos y selecciona un método de pago.');
            return;
        }

        const datosAdicionales = {
            nombreCliente: nombre,
            telefono,
            direccion,
            cedula,
            metodoPago,
        };

        setCargando(true);
        try {
            await realizarCompra(datosAdicionales);
            Alert.alert(
                '¡Pedido Realizado!',
                'Producto comprado y en estado de pedido realizado. Revisa cuando el estado cambie a entrega.',
                [{ text: 'OK', onPress: () => navigation.navigate('CatalogoPublico') }]
            );
        } catch (error) {
            Alert.alert(
                'Error en la Compra',
                error.message || 'No se pudo completar la compra. Inténtalo de nuevo.'
            );
        } finally {
            setCargando(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

            <Text style={styles.subtitulo}>Datos de Envío</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre Completo"
                value={nombre}
                onChangeText={setNombre}
                placeholderTextColor="#999"
            />
            <TextInput
                style={styles.input}
                placeholder="Número de Teléfono"
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="phone-pad"
                placeholderTextColor="#999"
            />
            <TextInput
                style={styles.input}
                placeholder="Dirección de Entrega"
                value={direccion}
                onChangeText={setDireccion}
                placeholderTextColor="#999"
            />
            <TextInput
                style={styles.input}
                placeholder="Cédula de Identidad"
                value={cedula}
                onChangeText={setCedula}
                keyboardType="numeric"
                placeholderTextColor="#999"
            />

            <Text style={styles.subtitulo}>Método de Pago</Text>
            <View style={styles.metodosPagoContainer}>
                <TouchableOpacity
                    style={[styles.botonMetodo, metodoPago === 'Tarjeta' && styles.botonMetodoActivo]}
                    onPress={() => setMetodoPago('Tarjeta')}
                >
                    <Ionicons name="card-outline" size={24} color={metodoPago === 'Tarjeta' ? '#fff' : '#78032aff'} />
                    <Text style={[styles.textoMetodo, metodoPago === 'Tarjeta' && styles.textoMetodoActivo]}>Tarjeta</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.botonMetodo, metodoPago === 'Paypal' && styles.botonMetodoActivo]}
                    onPress={() => setMetodoPago('Paypal')}
                >
                    <Ionicons name="logo-paypal" size={24} color={metodoPago === 'Paypal' ? '#fff' : '#78032aff'} />
                    <Text style={[styles.textoMetodo, metodoPago === 'Paypal' && styles.textoMetodoActivo]}>Paypal</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.resumenContainer}>
                <Text style={styles.totalTexto}>Total a Pagar: ${totalCarrito.toFixed(2)}</Text>
            </View>

            <TouchableOpacity style={styles.botonConfirmar} onPress={handleConfirmarCompra} disabled={cargando}>
                {cargando ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.botonConfirmarTexto}>Confirmar Compra</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        padding: 20,
    },
    titulo: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    subtitulo: {
        fontSize: 18,
        fontWeight: '600',
        color: '#444',
        marginTop: 20,
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 12,
    },
    metodosPagoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
    botonMetodo: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#78032aff',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        gap: 10,
    },
    botonMetodoActivo: {
        backgroundColor: '#78032aff',
    },
    textoMetodo: {
        fontSize: 16,
        color: '#78032aff',
        fontWeight: '600',
    },
    textoMetodoActivo: {
        color: '#fff',
    },
    resumenContainer: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        alignItems: 'center',
    },
    totalTexto: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    botonConfirmar: {
        backgroundColor: '#0b0656ff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    botonConfirmarTexto: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});