import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CatalogoPublico from '../Client/CatalogoPublico';
import LoginScreen from '../Login/Login';
import AdminTabs from '../Screens/AdminTabs';
import ClienteTabs from '../Screens/ClienteTabs';
import ProductStack from './ProductStack';

const Stack = createNativeStackNavigator();

export default function Navegacion() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CatalogoPublico" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="CatalogoPublico" component={CatalogoPublico} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="AdminTabs" component={AdminTabs} />
        <Stack.Screen name="ClienteTabs" component={ClienteTabs} />
        <Stack.Screen name="ProductStack" component={ProductStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}