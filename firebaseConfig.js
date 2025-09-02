import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { Platform } from "react-native";

// Your web app's Firebase configuration - THIS SHOULD BE CORRECT
const firebaseConfig = {
  apiKey: "AIzaSyDZ0_xoKBiGJeWLuEvn_nmBphdLE5pj4eA",
  authDomain: "greengrocerdelivery-7970a.firebaseapp.com",
  projectId: "greengrocerdelivery-7970a",
  storageBucket: "greengrocerdelivery-7970a.appspot.com",
  messagingSenderId: "955703590850",
  appId: "1:955703590850:web:80e_CHANGE_THIS_IF_NEEDED_f5c560b", // Please double check this appId from your Firebase Console
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// --- THIS IS THE CRUCIAL FIX ---
// This code block checks if the app is running on mobile or web.
// It then initializes the authentication service using the correct method for that platform.
let auth;
if (Platform.OS === "web") {
  // For web, we use the standard getAuth() function.
  auth = getAuth(app);
} else {
  // For mobile (iOS/Android), we use initializeAuth with ReactNativePersistence.
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

// Initialize Firestore (this part is fine)
const db = getFirestore(app);

// Export the correctly initialized services
export { db, auth };
