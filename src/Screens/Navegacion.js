import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../Login/login'
import MyTabsAdmin from '../Screens/AdminTabs';
import MyTabsCliente from '../Screens/ClienteTabs';

const Stack = createStackNavigator();

export default function Navegacion() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MyTabsAdmin" component={MyTabsAdmin} />
        <Stack.Screen name="MyTabsCliente" component={MyTabsCliente} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
