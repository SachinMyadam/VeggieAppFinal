import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';

export default function TabsLayout() {
  const { items } = useCart();
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#4CAF50' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => <FontAwesome name="shopping-cart" size={28} color={color} />,
          tabBarBadge: items.length > 0 ? items.length : undefined,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}