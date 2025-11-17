import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import Catalogo from '../Client/Catalogo';
import Favoritos from '../Client/Favoritos';
import Carrito from '../Client/Carrito';
import HistorialComprasCliente from '../Client/HistorialComprasCliente';
import CerrarSesion from '../Views/CerrarSesion';

const Tab = createBottomTabNavigator();

export default function ClienteTabs() {
  const { carrito } = useApp();
  const itemsCarrito = carrito.length;

  return (
    <Tab.Navigator
      initialRouteName="Catalogo"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Catalogo') iconName = 'pricetags-outline';
          else if (route.name === 'Favoritos') iconName = 'heart-outline';
          else if (route.name === 'Mis Compras') iconName = 'receipt-outline'; // Icono para el historial de compras
          else if (route.name === 'Carrito') iconName = 'cart-outline';
          else if (route.name === 'Cerrar Sesión') iconName = 'log-out-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#78032aff',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#ccc',
        },
        tabBarBadge: route.name === 'Carrito' && itemsCarrito > 0 ? itemsCarrito : undefined,
      })}
    >
      <Tab.Screen name="Catalogo" component={Catalogo} />
      <Tab.Screen name="Favoritos" component={Favoritos} />
      <Tab.Screen name="Mis Compras" component={HistorialComprasCliente} />
      <Tab.Screen name="Carrito" component={Carrito} />
      <Tab.Screen name="Cerrar Sesión" component={CerrarSesion} />
    </Tab.Navigator>
  );
}