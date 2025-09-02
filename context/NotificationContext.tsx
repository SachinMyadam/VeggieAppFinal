import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

// Basic notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

interface NotificationContextType {
    subscribeToVeggie: (veggieId: string, veggieName: string) => void;
    unsubscribeFromVeggie: (veggieId: string) => void;
    checkSubscriptionStatus: (veggieId: string) => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [expoPushToken, setExpoPushToken] = useState<string | undefined>('');

    async function registerForPushNotificationsAsync() {
        let token;
        if (Device.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          // You can find your projectId in app.json
          token = (await Notifications.getExpoPushTokenAsync({
            projectId: 'greengrocerdelivery-7970a', 
          })).data;
          setExpoPushToken(token);
        }
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
        return token;
    }

    const subscribeToVeggie = async (veggieId: string, veggieName: string) => {
        const token = expoPushToken || await registerForPushNotificationsAsync();
        if (!token || !auth.currentUser) return;
        // Expo tokens can contain '/' which is not allowed in Firestore doc IDs. We replace it.
        const sanitizedToken = token.replace(/\//g, '-');
        const watcherRef = doc(db, "vegetables", veggieId, "watchers", sanitizedToken);
        await setDoc(watcherRef, { userId: auth.currentUser.uid });
        alert(`Subscribed! You'll be notified when ${veggieName} is available.`);
    };

    const unsubscribeFromVeggie = async (veggieId: string) => {
        if (!expoPushToken) return;
        const sanitizedToken = expoPushToken.replace(/\//g, '-');
        const watcherRef = doc(db, "vegetables", veggieId, "watchers", sanitizedToken);
        await deleteDoc(watcherRef);
        alert('Unsubscribed successfully.');
    };
    
    const checkSubscriptionStatus = async (veggieId: string): Promise<boolean> => {
        if (!expoPushToken) return false;
        const sanitizedToken = expoPushToken.replace(/\//g, '-');
        const watcherRef = doc(db, "vegetables", veggieId, "watchers", sanitizedToken);
        const docSnap = await getDoc(watcherRef);
        return docSnap.exists();
    };

    useEffect(() => {
        registerForPushNotificationsAsync();
    }, []);

    return (
        <NotificationContext.Provider value={{ subscribeToVeggie, unsubscribeFromVeggie, checkSubscriptionStatus }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) { throw new Error('useNotifications must be used within a NotificationProvider'); }
  return context;
};


