import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const acceder = () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Campos vacíos', 'Por favor ingrese su correo y contraseña.');
            return;
        }

        //Autenticación básica 
        if (email === 'cliente@gmail.com' && password === '654321') {
            Alert.alert('Bienvenido', 'Inicio de sesión exitoso');
            navigation.replace('MyTabsCliente') // ir a la nav del cliente
        } else if (email === 'admin@gmail.com' && password === '123456') {
            Alert.alert('Bienvenido', 'Inicio de sesión exitoso');
            navigation.replace('MyTabsAdmin'); // ir a la nav del administrador

        }
        else {
            Alert.alert('Error', 'Correo o contraseña incorrectos');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>

            <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#aaa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={acceder}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#2f3640',
        marginBottom: 30,
    },
    input: {
        width: '90%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#dcdde1',
    },
    button: {
        backgroundColor: '#0097e6',
        width: '90%',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});