import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import Constants from "expo-constants";
import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// En web/producción, expoConfig puede ser undefined; caemos a manifest/objeto vacío
const extra = (Constants?.expoConfig?.extra) || (Constants?.manifest?.extra) || {};

//CONFIGURACION DE FIREBASE
const firebaseConfig = {
    apiKey: extra.FIREBASE_API_KEY,
    authDomain: extra.FIREBASE_AUTH_DOMAIN,
    projectId: extra.FIREBASE_PROJECT_ID,
    messagingSenderId: extra.FIREBASE_MESSAGING_SENDER_ID,
    appId: extra.FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.appId || !firebaseConfig.projectId) {
    // Log temprano para que se vea en la consola del navegador/Metro
    // Evita crashear silenciosamente si faltan variables
    // No bloquea initializeApp, pero Firebase podría fallar en operaciones
    console.warn("Firebase config incompleta. Revisa expo.extra o tu .env");
}

//INICIALIZAR FIREBASE
const app = initializeApp(firebaseConfig);

//SERVICIOS
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);

export { app, auth, db };
