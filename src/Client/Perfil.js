import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useApp } from '../context/AppContext';
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../database/firebaseconfig';

// 1. Definir constantes para los estados de los pedidos
// Ayuda a evitar errores de tipeo y facilita el mantenimiento.
const ESTADOS_PEDIDO = {
    REALIZADO: 'Pedido realizado',
    EMPAQUETADO: 'En empaquetado',
    ENTREGADO: 'Entregado',
    CONFIRMADO: 'Recibido por Cliente', // Nuevo estado para cuando el cliente confirma
};

const PedidosSeccion = ({ titulo, pedidos, onConfirmarEntrega }) => {
    if (pedidos.length === 0) return null;

    return (
        <View style={styles.seccionContainer}>
            <Text style={styles.seccionTitulo}>{titulo}</Text>
            {pedidos.map(pedido => (
                <View key={pedido.id} style={styles.pedidoCard}>
                    <Text style={styles.pedidoFecha}>Fecha: {new Date(pedido.fecha.seconds * 1000).toLocaleDateString()}</Text>
                    <Text style={styles.pedidoTotal}>Total: ${pedido.total.toFixed(2)}</Text>
                    {/* Aquí podrías mostrar los productos si quisieras */}
                    {titulo === 'Listo para Entrega' && ( // Usamos el título para decidir si mostrar el botón
                        <TouchableOpacity style={styles.botonConfirmar} onPress={() => onConfirmarEntrega(pedido.id)}>
                            <Text style={styles.textoBotonConfirmar}>Confirmar Entrega</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ))}
        </View>
    );
};

export default function Perfil() {
    const { usuarioAutenticado } = useApp();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPedidos = async () => {
        if (!usuarioAutenticado) return;
        setLoading(true);
        try {
            const q = query(collection(db, 'Compras'), where('clienteId', '==', usuarioAutenticado.uid));
            const querySnapshot = await getDocs(q);
            const pedidosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            pedidosList.sort((a, b) => (b.fecha?.toDate() || 0) - (a.fecha?.toDate() || 0));
            setPedidos(pedidosList);
        } catch (error) {
            console.error("Error fetching user orders: ", error);
            Alert.alert("Error", "No se pudieron cargar tus pedidos.");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchPedidos();
        }, [usuarioAutenticado])
    );

    const handleConfirmarEntrega = async (pedidoId) => {
        Alert.alert(
            "Confirmar Recepción",
            "¿Estás seguro de que has recibido este pedido? Esta acción no se puede deshacer.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sí, lo recibí",
                    onPress: async () => {
                        try {
                            // 2. Actualización optimista: removemos el pedido del estado local primero.
                            setPedidos(prevPedidos => prevPedidos.filter(p => p.id !== pedidoId));
                            // Ahora, en lugar de borrar, actualizamos el estado del pedido.
                            // El administrador verá este nuevo estado, pero el cliente ya no lo verá.
                            const pedidoRef = doc(db, 'Compras', pedidoId);
                            await updateDoc(pedidoRef, { estado: ESTADOS_PEDIDO.CONFIRMADO });
                        } catch (error) {
                            Alert.alert("Error", "No se pudo confirmar la entrega.");
                            // Si falla, volvemos a cargar los pedidos para restaurar el estado.
                            fetchPedidos();
                        }
                    },
                },
            ]
        );
    };

    // 3. Usamos useMemo para optimizar el filtrado de pedidos.
    // Esto evita que se vuelva a calcular en cada render, solo cuando `pedidos` cambia.
    const pedidosRealizados = useMemo(() => pedidos.filter(p => p.estado === ESTADOS_PEDIDO.REALIZADO), [pedidos]);
    const pedidosEmpaquetados = useMemo(() => pedidos.filter(p => p.estado === ESTADOS_PEDIDO.EMPAQUETADO), [pedidos]);
    const pedidosEntregados = useMemo(() => pedidos.filter(p => p.estado === ESTADOS_PEDIDO.ENTREGADO), [pedidos]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitulo}>Mi Perfil</Text>
                <Text style={styles.headerEmail}>{usuarioAutenticado?.email}</Text>
            </View>

            <Text style={styles.titulo}>Pedidos</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#78032aff" style={{ marginTop: 50 }} />
            ) : (
                <>
                    <PedidosSeccion titulo="Pedido Realizado" pedidos={pedidosRealizados} />
                    <PedidosSeccion titulo="En empaquetado" pedidos={pedidosEmpaquetados} />
                    <PedidosSeccion titulo="Listo para Entrega" pedidos={pedidosEntregados} onConfirmarEntrega={handleConfirmarEntrega} />
                    {pedidos.length === 0 && !loading && (
                        <Text style={styles.noPedidos}>Aún no tienes pedidos.</Text>
                    )}
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#633f53ff' },
    header: { backgroundColor: '#78032aff', padding: 20, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
    headerTitulo: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
    headerEmail: { fontSize: 16, color: '#eee', textAlign: 'center', marginTop: 4 },
    titulo: { fontSize: 22, fontWeight: 'bold', color: '#ffffffff', textAlign: 'center', marginVertical: 20 },
    seccionContainer: { marginBottom: 20, paddingHorizontal: 15 },
    seccionTitulo: { fontSize: 18, fontWeight: '600', color: '#ffffffff', marginBottom: 10, fontWeight: 'bold', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 5 },
    pedidoCard: { backgroundColor: '#f9f9f9', borderRadius: 10, padding: 15, marginVertical: 8, borderWidth: 1, borderColor: '#eee' },
    pedidoFecha: { fontSize: 14, color: '#666' },
    pedidoTotal: { fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 5 },
    noPedidos: { textAlign: 'center', color: '#999', fontSize: 16, marginTop: 40 },
    botonConfirmar: { backgroundColor: '#0d247eff', padding: 10, borderRadius: 8, marginTop: 12, alignItems: 'center' },
    textoBotonConfirmar: { color: '#fff', fontWeight: 'bold' },
});