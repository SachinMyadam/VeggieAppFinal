import { Stack } from 'expo-router';
import { CartProvider } from '../context/CartContext';
import { NotificationProvider } from '../context/NotificationContext';

export default function RootLayout() {
  // This layout is now simple and only sets up the providers and navigator.
  return (
    <NotificationProvider>
      <CartProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} /> 
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </CartProvider>
    </NotificationProvider>
  );
}