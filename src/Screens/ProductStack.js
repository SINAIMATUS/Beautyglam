import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductosLista from '../Views/ProductosLista';

const Stack = createNativeStackNavigator();

export default function ProductStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#78032aff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="ProductosLista"
        component={ProductosLista}
        options={{ title: 'Lista de Productos' }}
      />
    </Stack.Navigator>
  );
}