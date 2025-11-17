import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from 'firebase/firestore';
import { db } from '../database/firebaseconfig';
import { useApp } from '../context/AppContext';

export default function HistorialComprasCliente() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(false);
  const { usuarioAutenticado } = useApp();

  const fetchCompras = useCallback(async () => {
    if (!usuarioAutenticado?.uid) {
      setCompras([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Colección con mayúscula: Compras
      const q = query(
        collection(db, 'Compras'),
        where('clienteId', '==', usuarioAutenticado.uid),
        orderBy('fecha', 'desc')
      );
      const comprasSnap = await getDocs(q);

      const comprasList = await Promise.all(
        comprasSnap.docs.map(async (compraDoc) => {
          const compraData = compraDoc.data();

          // Subcolección con mayúscula: Productos
          const productosSnap = await getDocs(
            collection(db, `Compras/${compraDoc.id}/Productos`)
          );

          // Tomar directamente los campos de la subcolección
          const productos = productosSnap.docs.map((productoDoc) => {
            const d = productoDoc.data();
            return {
              id: productoDoc.id,
              nombre: d.nombre || 'Producto sin nombre',
              precio: typeof d.precio === 'number' ? d.precio : 0,
              foto: d.foto || null,
              cantidad: typeof d.cantidad === 'number' ? d.cantidad : 0,
            };
          });

          return {
            id: compraDoc.id,
            ...compraData,
            productos,
          };
        })
      );

      setCompras(comprasList);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar tu historial de compras.');
      console.error('Error al cargar historial de compras: ', error);
    } finally {
      setLoading(false);
    }
  }, [usuarioAutenticado]);

  useFocusEffect(
    useCallback(() => {
      fetchCompras();
    }, [fetchCompras])
  );

  const ProductoItem = ({ producto }) => {
    const { nombre, cantidad, precio, foto } = producto;

    const mostrarFoto =
      typeof foto === 'string' &&
      (foto.startsWith('data:image') || foto.startsWith('http'));

    return (
      <View style={styles.productoContainer}>
        {mostrarFoto && <Image source={{ uri: foto }} style={styles.productoImagen} />}
        <View style={styles.productoDetalles}>
          <Text style={styles.productoNombre}>{nombre}</Text>
          <Text style={styles.productoTexto}>Cantidad: {cantidad}</Text>
          <Text style={styles.productoTexto}>Precio: ${precio.toFixed(2)} c/u</Text>
        </View>
      </View>
    );
  };

  const CompraClienteCard = ({ compra }) => {
    const { fecha, total, productos = [], metodoPago } = compra;
    const totalItems = productos.reduce((sum, p) => sum + (p.cantidad || 0), 0);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.fecha}>
            {fecha?.seconds
              ? new Date(fecha.seconds * 1000).toLocaleDateString()
              : 'Fecha no disponible'}
          </Text>
        </View>
        <View style={styles.productosContainer}>
          {productos.map((p) => (
            <ProductoItem key={p.id} producto={p} />
          ))}
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.resumenItems}>
            {productos.length} productos, {totalItems} artículos
          </Text>
          <Text style={styles.metodoPago}>
            Método de Pago: {metodoPago || 'No especificado'}
          </Text>
          <Text style={styles.total}>
            Total: ${typeof total === 'number' ? total.toFixed(2) : '0.00'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Mi Historial de Compras</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#78032aff" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={compras}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CompraClienteCard compra={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.noDataText}>Aún no has realizado ninguna compra.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitulo: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  list: { padding: 15 },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  fecha: { fontSize: 14, color: '#ccc' },
  productosContainer: { marginVertical: 10 },
  productoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  productoImagen: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  productoDetalles: { flex: 1 },
  productoNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  productoTexto: { fontSize: 14, color: '#ccc' },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 10,
    marginTop: 5,
  },
  resumenItems: {
    fontSize: 13,
    color: '#aaa',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  metodoPago: {
    fontSize: 13,
    color: '#aaa',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ecc71',
    textAlign: 'right',
    marginTop: 5,
  },
  noDataText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50,
  },
});