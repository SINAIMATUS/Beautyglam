import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CatalogoPublico from '../Client/CatalogoPublico';
import LoginScreen from '../Login/Login';
import AdminTabs from '../Screens/AdminTabs';
import ClienteTabs from '../Screens/ClienteTabs';
import ProductStack from './ProductStack';
import Marcas from '../Views/Marcas';
import Checkout from '../Client/Checkout'; // 1. Importamos la nueva pantalla

const Stack = createNativeStackNavigator();

export default function Navegacion() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CatalogoPublico" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CatalogoPublico" component={CatalogoPublico} />
        <Stack.Screen name="Marcas" component={Marcas} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AdminTabs" component={AdminTabs} />
        <Stack.Screen name="ClienteTabs" component={ClienteTabs} />
        {/* 2. Añadimos la pantalla al navegador */}
        <Stack.Screen 
          name="Checkout" 
          component={Checkout} 
          options={{ headerShown: true, title: 'Finalizar Compra', headerStyle: { backgroundColor: '#78032aff' }, headerTintColor: '#fff' }} />
        <Stack.Screen name="ProductStack" component={ProductStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}