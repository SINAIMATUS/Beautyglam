import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { collection, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../database/firebaseconfig';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

// Configuración base para los gráficos
const chartConfig = {
  backgroundColor: '#1e2923',
  backgroundGradientFrom: '#1E1E1E',
  backgroundGradientTo: '#333',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(217, 108, 159, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#D96C9F',
  },
};

const ChartContainer = ({ title, children }) => (
  <View style={styles.chartContainer}>
    <Text style={styles.chartTitle}>{title}</Text>
    {children}
  </View>
);

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [revenueByDate, setRevenueByDate] = useState(null);
  const [topProducts, setTopProducts] = useState(null);
  const [orderStatusDistribution, setOrderStatusDistribution] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      
      const unsubscribe = onSnapshot(collection(db, 'Compras'), async (comprasSnapshot) => {
        const allOrdersPromises = comprasSnapshot.docs.map(async (compraDoc) => {
          const compraData = compraDoc.data();
          const productosSnap = await getDocs(
            collection(db, `Compras/${compraDoc.id}/Productos`)
          );
          const productos = productosSnap.docs.map((productoDoc) => ({
            id: productoDoc.id,
            ...productoDoc.data(),
          }));
          return {
            id: compraDoc.id,
            ...compraData,
            productos, // Ahora 'productos' contiene los datos de la subcolección
          };
        });

        const allOrders = await Promise.all(allOrdersPromises);

        if (!allOrders || allOrders.length === 0) {
            setLoading(false);
            setRevenueByDate(null);
            setTopProducts(null);
            setOrderStatusDistribution(null);
            return;
        }

        // --- 1. Procesar Ingresos T cotales por Fecha (LineChart) ---
        const revenueMap = new Map();
        allOrders.forEach(order => {
          if (order.fecha) {
            const date = order.fecha.toDate().toISOString().split('T')[0]; // Formato YYYY-MM-DD
            revenueMap.set(date, (revenueMap.get(date) || 0) + order.total);
          }
        });

        const sortedRevenue = Array.from(revenueMap.entries()).sort((a, b) => new Date(a[0]) - new Date(b[0]));
        const last7Revenue = sortedRevenue.slice(-7); // Últimos 7 días de actividad

        if (last7Revenue.length > 0) {
          setRevenueByDate({
            labels: last7Revenue.map(entry => entry[0].substring(5)), // Formato MM-DD
            datasets: [{ data: last7Revenue.map(entry => entry[1]) }],
          });
        } else {
          setRevenueByDate(null);
        }

        // --- 2. Procesar Top 5 Productos Más Vendidos (BarChart) ---
        const productsMap = new Map();
        allOrders.forEach(order => {
          if (order.productos && Array.isArray(order.productos)) {
            order.productos.forEach(producto => {
              productsMap.set(producto.nombre, (productsMap.get(producto.nombre) || 0) + (producto.cantidad || 0));
            });
          }
        });

        const sortedProducts = Array.from(productsMap.entries()).sort((a, b) => b[1] - a[1]);
        const top5Products = sortedProducts.slice(0, 5);

        if (top5Products.length > 0) {
          setTopProducts({
            labels: top5Products.map(p => p[0].substring(0, 12) + '...'), // Nombres cortos
            datasets: [{ data: top5Products.map(p => p[1]) }],
          });
        } else {
          setTopProducts(null);
        }

        // --- 3. Procesar Distribución de Pedidos por Estado (PieChart) ---
        const statusMap = new Map();
        allOrders.forEach(order => {
            statusMap.set(order.estado, (statusMap.get(order.estado) || 0) + 1);
        });

        const statusColors = {
            'Pedido realizado': '#3498db',
            'En empaquetado': '#f1c40f',
            'Entregado': '#2ecc71',
            'Recibido por Cliente': '#95a5a6',
        };

        const statusData = Array.from(statusMap.entries()).map(([name, population]) => ({
            name,
            population,
            color: statusColors[name] || '#e74c3c', // Un color por defecto si el estado no está mapeado
            legendFontColor: '#7F7F7F',
            legendFontSize: 14,
        }));

        if (statusData.length > 0) {
            setOrderStatusDistribution(statusData);
        } else {
            setOrderStatusDistribution(null);
        }

        setLoading(false);
      }, (error) => {
        console.error("Error al obtener datos en tiempo real:", error);
        setLoading(false);
      });

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#D96C9F" style={styles.loader} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Dashboard de Ventas</Text>
      
      {revenueByDate ? (
        <ChartContainer title="Ingresos por Fecha (Últimos 7 días)">
          <LineChart
            data={revenueByDate}
            width={screenWidth - 32}
            height={250}
            yAxisLabel="$"
            chartConfig={chartConfig}
            bezier
            fromZero
          />
        </ChartContainer>
      ) : <Text style={styles.noDataText}>No hay datos de ingresos para mostrar.</Text>}

      {topProducts ? (
        <ChartContainer title="Top 5 Productos Más Vendidos (Unidades)">
          <BarChart
            data={topProducts}
            width={screenWidth - 32}
            height={250}
            yAxisSuffix=" u."
            chartConfig={chartConfig}
            verticalLabelRotation={15}
            fromZero
          />
        </ChartContainer>
      ) : <Text style={styles.noDataText}>No hay datos de productos vendidos.</Text>}

      {orderStatusDistribution ? (
        <ChartContainer title="Distribución de Pedidos por Estado">
            <PieChart
                data={orderStatusDistribution}
                width={screenWidth - 32}
                height={220}
                chartConfig={chartConfig}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                absolute
            />
        </ChartContainer>
      ) : <Text style={styles.noDataText}>No hay datos sobre el estado de los pedidos.</Text>}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
  chartContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#eee',
    marginBottom: 10,
  },
  noDataText: {
      color: '#999',
      textAlign: 'center',
      marginVertical: 20,
  }
});