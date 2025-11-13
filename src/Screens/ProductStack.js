import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductosLista from '../Views/ProductosLista';
import Productos from '../Views/Productos'; // Importamos la pantalla del formulario

const Stack = createNativeStackNavigator();

export default function ProductStack() {
  return (
    <Stack.Navigator
      initialRouteName="ProductoFormulario" // Corregimos al nombre de pantalla correcto
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#78032aff',
        },
        headerTintColor: '#ffffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* La pantalla del formulario ahora es la principal de este stack */}
      <Stack.Screen
        name="ProductoFormulario"
        component={Productos}
        options={{
          headerShown: false, // Ocultamos completamente la cabecera de la navegación
        }}
      />
      {/* La pantalla de la lista se puede navegar desde el formulario */}
      <Stack.Screen
        name="ProductosLista"
        component={ProductosLista}
        options={{ title: 'Lista de Productos' }}
      />
    </Stack.Navigator>
  );
}