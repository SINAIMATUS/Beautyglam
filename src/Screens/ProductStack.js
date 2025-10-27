// src/navigation/ProductStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TablaProductos from '../Admin/TablaProductos';
import FormularioProductos from '../Admin/FormularioProductos';

const Stack = createNativeStackNavigator();

export default function ProductStack() {
    return (
        <Stack.Navigator initialRouteName="TablaProductos" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TablaProductos" component={TablaProductos} />
            <Stack.Screen name="FormularioProductos" component={FormularioProductos} />
        </Stack.Navigator>
    );
}
