import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
    const navigation = useNavigation();
    const auth = getAuth();

    const cerrarSesion = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.titulo}>Configuración</Text>
                <TouchableOpacity style={styles.boton} onPress={cerrarSesion}>
                    <Text style={styles.botonTexto}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>

            <AlertaModal
                onCerrar={() => {
                    setAlertaVisible(false);
                    if (redirigir) navigation.replace('Login');
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#1E1E1E',
        padding: 24,
        borderRadius: 12,
        alignItems: 'center',
        gap: 20,
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    boton: {
        backgroundColor: '#e63946',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    botonTexto: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});