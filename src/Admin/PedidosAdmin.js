import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert, Button } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, getDocs, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../database/firebaseconfig';

// Reutilizamos las constantes de estado para mantener la consistencia
const ESTADOS_PEDIDO = {
    REALIZADO: 'Pedido realizado',
    EMPAQUETADO: 'En empaquetado',
    ENTREGADO: 'Entregado',
};

const PedidoAdminCard = ({ pedido, onUpdateStatus }) => {
    // 1. Hacemos la desestructuración más segura.
    // Si `pedido.productos` es undefined, `productos` será un array vacío `[]`.
    const { id, clienteEmail, fecha, total, estado, productos = [], nombreCliente, direccion, metodoPago } = pedido;

    return (
        <View style={styles.pedidoCard}>
            {/* Sección de Información del Cliente */}
            <View style={styles.seccionInfo}>
                <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={16} color="#940e51ff" />
                    <Text style={styles.pedidoInfo}> {nombreCliente || 'No disponible'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={16} color="#ccc" />
                    <Text style={styles.pedidoInfo}> {clienteEmail || 'No disponible'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Ionicons name="home-outline" size={16} color="#ccc" />
                    <Text style={styles.pedidoInfo}> {direccion || 'No disponible'}</Text>
                </View>
            </View>

            <Text style={styles.pedidoInfo}>Fecha: {new Date(fecha.seconds * 1000).toLocaleDateString()}</Text>
            <Text style={styles.pedidoInfo}>Método de Pago: {metodoPago || 'No especificado'}</Text>
            <Text style={styles.pedidoTotal}>Total: ${total.toFixed(2)}</Text>
            <Text style={[styles.estado, styles[`estado${estado.replace(/\s+/g, '')}`]]}>
                Estado: {estado}
            </Text>

            {/* Mostramos los productos del pedido */}
            <View style={styles.productosContainer}>
                <Text style={styles.productosTitulo}>Productos:</Text>
                {productos.map((p, index) => (
                    <Text key={index} style={styles.productoItem}>- {p.nombre} (x{p.cantidad})</Text>
                ))}
            </View>

            {/* Botones para cambiar el estado del pedido */}
            <View style={styles.botonesContainer}>
                {estado === ESTADOS_PEDIDO.REALIZADO && (
                    <TouchableOpacity
                        style={[styles.boton, styles.botonEmpaquetar]}
                        onPress={() => onUpdateStatus(id, ESTADOS_PEDIDO.EMPAQUETADO)}
                    >
                        <Text style={styles.textoBoton}>Marcar como Empaquetado</Text>
                    </TouchableOpacity>
                )}
                {estado === ESTADOS_PEDIDO.EMPAQUETADO && (
                    <TouchableOpacity
                        style={[styles.boton, styles.botonEntregar]}
                        onPress={() => onUpdateStatus(id, ESTADOS_PEDIDO.ENTREGADO)}
                    >
                        <Text style={styles.textoBoton}>Marcar como Entregado</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

export default function PedidosAdmin() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('desc'); // 'desc' para recientes, 'asc' para antiguos

    const fetchPedidos = useCallback(async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'Compras'), orderBy('fecha', sortOrder));
            const querySnapshot = await getDocs(q);
            const pedidosList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPedidos(pedidosList);
        } catch (error) {
            console.error("Error fetching orders for admin: ", error);
            Alert.alert("Error", "No se pudieron cargar los pedidos.");
        } finally {
            setLoading(false);
        }
    }, [sortOrder]); // Se volverá a crear si cambia el orden

    useFocusEffect(
        useCallback(() => {
            fetchPedidos();
        }, [fetchPedidos])
    );

    const handleUpdateStatus = async (pedidoId, nuevoEstado) => {
        try {
            const pedidoRef = doc(db, 'Compras', pedidoId);
            await updateDoc(pedidoRef, { estado: nuevoEstado });

            // Actualización optimista de la UI
            setPedidos(prevPedidos =>
                prevPedidos.map(p => (p.id === pedidoId ? { ...p, estado: nuevoEstado } : p))
            );
            Alert.alert("Éxito", `El pedido ha sido actualizado a "${nuevoEstado}".`);
        } catch (error) {
            console.error("Error updating order status: ", error);
            Alert.alert("Error", "No se pudo actualizar el estado del pedido.");
        }
    };

    const toggleSortOrder = () => {
        setSortOrder(currentOrder => (currentOrder === 'desc' ? 'asc' : 'desc'));
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitulo}>Gestión de Pedidos</Text>
                <Button
                    title={`Ordenar por más ${sortOrder === 'desc' ? 'antiguos' : 'recientes'}`}
                    onPress={toggleSortOrder}
                    color="#fff"
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#D96C9F" style={{ marginTop: 50 }} />
            ) : (
                <View style={styles.pedidosList}>
                    {pedidos.length === 0 ? (
                        <Text style={styles.noPedidos}>No hay pedidos para gestionar.</Text>
                    ) : (
                        pedidos.map(pedido => (
                            <PedidoAdminCard key={pedido.id} pedido={pedido} onUpdateStatus={handleUpdateStatus} />
                        ))
                    )}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212' },
    header: { backgroundColor: '#1E1E1E', padding: 20, borderBottomWidth: 1, borderBottomColor: '#333' },
    headerTitulo: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 10 },
    pedidosList: { padding: 15 },
    pedidoCard: { backgroundColor: '#1E1E1E', borderRadius: 10, padding: 15, marginVertical: 8, borderWidth: 1, borderColor: '#333' },
    seccionInfo: { marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#333', paddingBottom: 10 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    pedidoInfo: { fontSize: 14, color: '#ccc' },
    pedidoTotal: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginTop: 5 },
    estado: { fontStyle: 'italic', marginTop: 5, fontWeight: 'bold' },
    estadoPedidorealizado: { color: '#3498db' }, // Azul
    estadoEnempaquetado: { color: '#f1c40f' }, // Amarillo
    estadoEntregado: { color: '#2ecc71' }, // Verde
    productosContainer: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#333', paddingTop: 10 },
    productosTitulo: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
    productoItem: { fontSize: 13, color: '#ccc', marginLeft: 10 },
    botonesContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 15 },
    boton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginLeft: 10 },
    botonEmpaquetar: { backgroundColor: '#f1c40f' },
    botonEntregar: { backgroundColor: '#2ecc71' },
    textoBoton: { color: '#fff', fontWeight: 'bold' },
    noPedidos: { textAlign: 'center', color: '#999', fontSize: 16, marginTop: 40 },
});