import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import Categorias from '../Views/Categorias';
import CerrarSesion from '../Views/CerrarSesion';
import Marcas from '../Views/Marcas';
import ProductStack from './ProductStack'; // Importamos el Stack de Productos

const Tab = createBottomTabNavigator();

export default function AdminTabs() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Tab.Navigator
        initialRouteName="Productos"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#1E1E1E',
            borderTopColor: '#333',
            height: 60,
            paddingBottom: 5,
          },
          tabBarActiveTintColor: '#D96C9F',
          tabBarInactiveTintColor: '#888',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Productos') iconName = 'shirt-outline';
            else if (route.name === 'Categorías') iconName = 'pricetags-outline';
            else if (route.name === 'Marcas') iconName = 'pricetags-outline';
            else if (route.name === 'Cerrar Sesión') iconName = 'log-out-outline';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Productos" component={ProductStack} />
        <Tab.Screen name="Categorías" component={Categorias} />
        <Tab.Screen name="Marcas" component={Marcas} />
        <Tab.Screen name="Cerrar Sesión" component={CerrarSesion} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = {
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
};