import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign } from '@expo/vector-icons';

import Categorias from '../Views/Categorias';
import Productos from '../Views/Productos';
import Settings from '../Views/CerrarSesion';

const Tab = createBottomTabNavigator();

function MyTabsAdmin() {
    return (
        <Tab.Navigator initialRouteName="Producto" screenOptions={{ tabBarActiveTintColor: 'purple' }}>
            <Tab.Screen
                name="Producto"
                component={Productos}
                options={{
                    tabBarLabel: 'Productos',
                    tabBarIcon: ({ color, size }) => <AntDesign name="shoppingcart" size={size} color={color} />,
                }}
            />
            <Tab.Screen
                name="Categoria"
                component={Categorias}
                options={{
                    tabBarLabel: 'Categorías',
                    tabBarIcon: ({ color, size }) => <AntDesign name="tags" size={size} color={color} />,
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

export default MyTabsAdmin;
