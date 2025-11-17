import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../database/firebaseconfig';
import { LineChart, BarChart } from 'react-native-chart-kit';

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
  const [salesByDate, setSalesByDate] = useState(null);
  const [cumulativeRevenue, setCumulativeRevenue] = useState(null);
  const [topProducts, setTopProducts] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const q = query(collection(db, 'Compras'), orderBy('fecha', 'asc'));

      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const allPedidos = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 1. Procesar Ventas Totales por Fecha
        const salesMap = new Map();
        allPedidos.forEach(pedido => {
          if (pedido.fecha) {
            const date = pedido.fecha.toDate().toISOString().split('T')[0]; // Formato YYYY-MM-DD
            salesMap.set(date, (salesMap.get(date) || 0) + pedido.total);
          }
        });

        const sortedSales = Array.from(salesMap.entries()).sort((a, b) => new Date(a[0]) - new Date(b[0]));
        const labelsSales = sortedSales.map(entry => entry[0].substring(5)); // Formato MM-DD
        const dataSales = sortedSales.map(entry => entry[1]);

        if (labelsSales.length > 0) {
          setSalesByDate({
            labels: labelsSales.slice(-7), // Últimos 7 días de actividad
            datasets: [{ data: dataSales.slice(-7) }],
          });
        }

        // 2. Procesar Ingresos Acumulados
        let accumulated = 0;
        const cumulativeData = sortedSales.map(entry => {
          accumulated += entry[1];
          return accumulated;
        });

        if (labelsSales.length > 0) {
          setCumulativeRevenue({
            labels: labelsSales.slice(-7),
            datasets: [{ data: cumulativeData.slice(-7) }],
          });
        }

        // 3. Procesar Productos más vendidos (usando BarChart para mejor visualización)
        const productsMap = new Map();
        // Esta parte requiere leer subcolecciones, lo cual es más complejo.
        // Por simplicidad, asumimos que los productos están en el documento principal.
        allPedidos.forEach(pedido => {
            if (pedido.productos && Array.isArray(pedido.productos)) {
                pedido.productos.forEach(producto => {
                    productsMap.set(producto.nombre, (productsMap.get(producto.nombre) || 0) + producto.cantidad);
                });
            }
        });

        const sortedProducts = Array.from(productsMap.entries()).sort((a, b) => b[1] - a[1]);
        const top5Products = sortedProducts.slice(0, 5);
        const labelsProducts = top5Products.map(p => p[0].substring(0, 10) + '...'); // Nombres cortos
        const dataProducts = top5Products.map(p => p[1]);

        if (labelsProducts.length > 0) {
          setTopProducts({
            labels: labelsProducts,
            datasets: [{ data: dataProducts }],
          });
        }

        setLoading(false);
      }, (error) => {
        console.error("Error al obtener datos en tiempo real:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#D96C9F" style={styles.loader} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Dashboard de Ventas</Text>

      {salesByDate ? (
        <ChartContainer title="Ventas Totales por Fecha (Últimos 7 días)">
          <LineChart
            data={salesByDate}
            width={screenWidth - 32}
            height={220}
            yAxisLabel="$"
            chartConfig={chartConfig}
            bezier
          />
        </ChartContainer>
      ) : <Text style={styles.noDataText}>No hay datos de ventas por fecha.</Text>}

      {cumulativeRevenue ? (
        <ChartContainer title="Ingresos Acumulados (Últimos 7 días)">
          <LineChart
            data={cumulativeRevenue}
            width={screenWidth - 32}
            height={220}
            yAxisLabel="$"
            chartConfig={chartConfig}
            bezier
          />
        </ChartContainer>
      ) : <Text style={styles.noDataText}>No hay datos de ingresos acumulados.</Text>}

      {topProducts ? (
        <ChartContainer title="Top 5 Productos Más Vendidos">
          <BarChart
            data={topProducts}
            width={screenWidth - 32}
            height={250}
            yAxisLabel=""
            chartConfig={chartConfig}
            verticalLabelRotation={20}
            fromZero
          />
        </ChartContainer>
      ) : <Text style={styles.noDataText}>No hay datos de productos vendidos.</Text>}
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