import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PedidosAdmin from '../Admin/PedidosAdmin';
import RegistroVentas from '../Admin/RegistroVentas';

const Stack = createNativeStackNavigator();

export default function PedidosStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Ocultamos las cabeceras del stack
      }}
    >
      <Stack.Screen
        name="GestionPedidos"
        component={PedidosAdmin}
      />
      <Stack.Screen
        name="RegistroVentas"
        component={RegistroVentas}
      />
    </Stack.Navigator>
  );
}