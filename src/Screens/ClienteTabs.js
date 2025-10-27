import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';

import Catalogo from '../Client/Catalogo';
import Settings from '../Views/CerrarSesion';

const Tab = createBottomTabNavigator();

function MyTabsCliente() {
  return (
    <Tab.Navigator initialRouteName="Catalogo" screenOptions={{ tabBarActiveTintColor: 'purple' }}>
      <Tab.Screen
        name="Catalogo"
        component={Catalogo}
        options={{
          tabBarLabel: 'Catálogo',
          tabBarIcon: ({ color, size }) => <AntDesign name="appstore1" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Cerrar Sesión"
        component={Settings}
        options={{
          tabBarLabel: 'Salir',
          tabBarIcon: ({ color, size }) => <AntDesign name="logout" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default MyTabsCliente;
