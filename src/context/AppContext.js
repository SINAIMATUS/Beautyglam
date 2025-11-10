import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../database/firebaseconfig';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(null);
  const [esCliente, setEsCliente] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuarioAutenticado(user);
      if (user && user.email === 'cliente@gmail.com') {
        setEsCliente(true);
      } else {
        setEsCliente(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleFavorito = (producto) => {
    setFavoritos((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        return prev.filter((p) => p.id !== producto.id);
      } else {
        return [...prev, producto];
      }
    });
  };

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        return prev.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      } else {
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito((prev) => prev.filter((p) => p.id !== productoId));
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(productoId);
    } else {
      setCarrito((prev) =>
        prev.map((p) =>
          p.id === productoId ? { ...p, cantidad: nuevaCantidad } : p
        )
      );
    }
  };

  const esFavorito = (productoId) => {
    return favoritos.some((p) => p.id === productoId);
  };

  const totalCarrito = carrito.reduce((sum, item) => {
    // Usamos item.Precio (mayúscula) y un método más seguro para convertir a número.
    const precioString = String(item.Precio ?? '0');
    const precio = parseFloat(precioString) || 0;
    return sum + (precio * item.cantidad);
  }, 0);

  const estaAutenticado = () => {
    return usuarioAutenticado !== null && esCliente;
  };

  return (
    <AppContext.Provider
      value={{
        favoritos,
        carrito,
        toggleFavorito,
        agregarAlCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        esFavorito,
        totalCarrito,
        usuarioAutenticado,
        esCliente,
        estaAutenticado,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de AppProvider');
  }
  return context;
};
