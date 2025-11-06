import React from 'react';
import { AppProvider } from './src/context/AppContext';
import Navegacion from './src/Screens/Navegacion';

export default function App() {
  return (
    <AppProvider>
      <Navegacion />
    </AppProvider>
  );
}
