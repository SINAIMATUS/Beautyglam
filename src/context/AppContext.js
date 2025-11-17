import React, { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../database/firebaseconfig';
import { runTransaction, collection, doc, addDoc, serverTimestamp, getDocs, query, where, orderBy, limit, setDoc } from 'firebase/firestore';

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

  const realizarCompra = async () => {
    if (!usuarioAutenticado) {
      throw new Error("Usuario no autenticado.");
    }
    if (carrito.length === 0) {
      throw new Error("El carrito está vacío.");
    }

    let compraId; // Variable para almacenar el ID de la compra

    try {
      await runTransaction(db, async (transaction) => {
        const productosParaActualizar = []; // Guardaremos aquí la info para la escritura

        // 1. Verificar stock de todos los productos en el carrito
        for (const item of carrito) {
          const productoRef = doc(db, "Productos", item.id);
          const productoDoc = await transaction.get(productoRef);

          if (!productoDoc.exists()) {
            throw new Error(`El producto ${item.Nombre} ya no existe.`);
          }

          const stockActual = productoDoc.data().Stock;
          if (stockActual < item.cantidad) { // Si no hay stock, lanzamos error inmediato
            throw new Error(`Stock insuficiente para: ${item.Nombre}. Disponible: ${stockActual}, Solicitado: ${item.cantidad}`);
          } else {
            // Si hay stock, preparamos los datos para la fase de escritura
            productosParaActualizar.push({
              ref: productoRef,
              nuevoStock: stockActual - item.cantidad,
            });
          }
        }

        // 2. Si hay stock, crear la compra y actualizar el stock
        const compraDocRef = doc(collection(db, "Compras")); // Primero creamos una referencia
        compraId = compraDocRef.id; // Guardamos el ID

        transaction.set(compraDocRef, { // Usamos la referencia en la transacción
          clienteId: usuarioAutenticado.uid,
          clienteEmail: usuarioAutenticado.email,
          fecha: serverTimestamp(),
          total: totalCarrito,
        });

        // Ahora ejecutamos las actualizaciones de stock usando los datos que ya leímos
        for (const prod of productosParaActualizar) {
          transaction.update(prod.ref, { Stock: prod.nuevoStock });
        }
      });

      // 3. Añadir productos a la subcolección usando el ID que ya obtuvimos
      for (const item of carrito) {
        const productoCompraRef = doc(collection(db, "Compras", compraId, "Productos"));
        await setDoc(productoCompraRef, { // Usamos setDoc para mayor control si fuera necesario
          productoId: item.id,
          nombre: item.Nombre,
          precio: item.Precio,
          cantidad: item.cantidad,
          foto: item.Foto,
        });
      }

      setCarrito([]); // Limpiar carrito local

    } catch (error) {
      console.error("Error al realizar la compra: ", error);
      // Re-lanzamos el error para que la UI pueda manejarlo
      throw error;
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
        realizarCompra,
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
