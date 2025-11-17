import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, getDocs, doc, orderBy, getDoc } from 'firebase/firestore';
import { db } from '../database/firebaseconfig';

const ProductoVentaItem = ({ producto }) => {
    const { Nombre, nombre, Cantidad, cantidad, Precio, Foto } = producto;
    const nombreProducto = Nombre || nombre || 'Producto no disponible';
    const cantidadProducto = Cantidad || cantidad || 0;
    const precioProducto = Precio || 0;

    return (
        <View style={styles.productoContainer}>
            {Foto && <Image source={{ uri: Foto }} style={styles.productoImagen} />}
            <View style={styles.productoDetalles}>
                <Text style={styles.productoNombre}>{nombreProducto}</Text>
                <Text style={styles.productoTexto}>Cantidad: {cantidadProducto}</Text>
                <Text style={styles.productoTexto}>Precio: ${precioProducto.toFixed(2)} c/u</Text>
            </View>
        </View>
    );
};

const VentaCard = ({ venta }) => {
    const { nombreCliente, fecha, total, productos = [], metodoPago } = venta;
    const totalItems = productos.reduce((sum, p) => sum + (p.cantidad || p.Cantidad || 0), 0);

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.clienteInfo}>Cliente: {nombreCliente || 'No especificado'}</Text>
                {fecha?.seconds && <Text style={styles.fecha}>{new Date(fecha.seconds * 1000).toLocaleDateString()}</Text>}
            </View>
            <View style={styles.productosContainer}>
                {productos.map((p, index) => (
                    <ProductoVentaItem key={p.id || index} producto={p} />
                ))}
            </View>
            <View style={styles.cardFooter}>
                <Text style={styles.resumenItems}>{productos.length} productos, {totalItems} artículos</Text>
                <View style={styles.footerInfo}>
                    <Text style={styles.metodoPago}>Método de Pago: {metodoPago || 'No especificado'}</Text>
                    <Text style={styles.total}>Total: ${total?.toFixed(2) || '0.00'}</Text>
                </View>
            </View>
        </View>
    );
};

export default function RegistroVentas() {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchVentas = useCallback(async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'Compras'), orderBy('fecha', 'desc'));
            const querySnapshot = await getDocs(q);
            
            const ventasPromises = querySnapshot.docs.map(async (ventaDoc) => {
                const ventaData = ventaDoc.data();
                const productosConDetalles = await Promise.all(
                    (ventaData.productos || []).map(async (producto) => {
                        const productoRef = doc(db, 'Productos', producto.productoId);
                        const productoSnap = await getDoc(productoRef);
                        if (productoSnap.exists()) {
                            return { ...productoSnap.data(), ...producto, id: producto.productoId };
                        }
                        return { ...producto, nombre: 'Producto no encontrado' };
                    })
                );
                return { id: ventaDoc.id, ...ventaData, productos: productosConDetalles };
            });

            const ventasList = await Promise.all(ventasPromises);
            setVentas(ventasList);
        } catch (error) {
            Alert.alert("Error", "No se pudieron cargar el registro de ventas.");
            console.error("Error fetching sales record: ", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(useCallback(() => {
        fetchVentas();
    }, [fetchVentas]));

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitulo}>Registro de Ventas</Text>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#D96C9F" style={{ flex: 1 }} />
            ) : (
                <FlatList
                    data={ventas}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <VentaCard venta={item} />}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.noDataText}>No hay compras registradas.</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212' },
    header: { backgroundColor: '#1E1E1E', padding: 20, borderBottomWidth: 1, borderBottomColor: '#333', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    headerTitulo: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
    list: { padding: 15 },
    card: { backgroundColor: '#1E1E1E', borderRadius: 10, padding: 15, marginVertical: 8, borderWidth: 1, borderColor: '#333' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#333' },
    clienteInfo: { fontSize: 15, fontWeight: 'bold', color: '#fff' },
    fecha: { fontSize: 14, color: '#ccc' },
    productosContainer: { marginVertical: 10 },
    productoContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    productoImagen: { width: 60, height: 60, borderRadius: 8, marginRight: 15 },
    productoDetalles: { flex: 1 },
    productoNombre: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
    productoTexto: { fontSize: 14, color: '#ccc' },
    cardFooter: { borderTopWidth: 1, borderTopColor: '#333', paddingTop: 10, marginTop: 5 },
    resumenItems: { fontSize: 13, color: '#aaa', fontStyle: 'italic', marginBottom: 5 },
    footerInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
    metodoPago: { fontSize: 13, color: '#aaa', fontStyle: 'italic' },
    total: { fontSize: 18, fontWeight: 'bold', color: '#2ecc71' },
    noDataText: { textAlign: 'center', color: '#999', fontSize: 16, marginTop: 50 },
});