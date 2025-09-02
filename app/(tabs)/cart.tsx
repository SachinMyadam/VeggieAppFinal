import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../../context/CartContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import { router } from 'expo-router';

export default function CartScreen() {
  const { items, addToCart, removeFromCart, clearCart } = useCart();
  const subtotal = items.reduce((sum, item) => sum + item.veggie.price * item.quantity, 0);
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!auth.currentUser) {
      Alert.alert("Please sign in to place an order.");
      return;
    }
    try {
      await addDoc(collection(db, 'orders'), {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        items: items,
        totalPrice: total,
        createdAt: serverTimestamp(),
        status: 'Pending',
      });

      // This is the corrected alert. The actions now only run
      // after the user presses the "OK" button.
      Alert.alert(
        'Order Placed!',
        `Your order for ₹${total.toFixed(2)} is on its way.`,
        [
          {
            text: 'OK',
            onPress: () => {
              clearCart();
              router.replace('/(tabs)/');
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error writing document: ", error);
      Alert.alert('Error', 'There was a problem placing your order.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>My Cart</Text>
        {items.length === 0 ? (
          <Text style={styles.emptyCartText}>Your cart is empty.</Text>
        ) : (
          <>
            <FlatList
              data={items}
              keyExtractor={(item) => item.veggie.id}
              renderItem={({ item }) => (
                <View style={styles.cartItem}>
                  <Text style={styles.emoji}>{item.veggie.emoji || '🌱'}</Text>
                  <Text style={styles.name}>{item.veggie.name}</Text>
                  <View style={styles.quantitySelector}>
                    <TouchableOpacity style={styles.quantityButton} onPress={() => removeFromCart(item.veggie.id)}><Text style={styles.quantityButtonText}>-</Text></TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity style={styles.quantityButton} onPress={() => addToCart(item.veggie)}><Text style={styles.quantityButtonText}>+</Text></TouchableOpacity>
                  </View>
                </View>
              )}
            />
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}><Text style={styles.summaryText}>Subtotal</Text><Text style={styles.summaryText}>₹{subtotal.toFixed(2)}</Text></View>
              <View style={styles.summaryRow}><Text style={styles.summaryText}>Delivery</Text><Text style={styles.summaryText}>Free</Text></View>
              <View style={styles.totalRow}><Text style={styles.totalText}>Total</Text><Text style={styles.totalPrice}>₹{total.toFixed(2)}</Text></View>
            </View>
            <TouchableOpacity style={styles.checkoutButton} onPress={handlePlaceOrder}><Text style={styles.checkoutButtonText}>Confirm Free Delivery</Text></TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' },
  contentContainer: { flex: 1, paddingTop: 40, paddingHorizontal: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20 },
  emptyCartText: { fontSize: 18, color: '#888', textAlign: 'center', marginTop: 50 },
  cartItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  emoji: { fontSize: 24 },
  name: { fontSize: 18, flex: 1, marginLeft: 15, fontWeight: '500' },
  quantitySelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e8e8e8', borderRadius: 10 },
  quantityButton: { paddingVertical: 10, paddingHorizontal: 15 },
  quantityButtonText: { color: '#333', fontWeight: 'bold', fontSize: 20 },
  quantityText: { color: '#333', fontWeight: 'bold', fontSize: 16, paddingHorizontal: 8 },
  summaryContainer: { marginTop: 'auto', backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 20 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryText: { fontSize: 16, color: '#555' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee' },
  totalText: { fontSize: 18, fontWeight: 'bold' },
  totalPrice: { fontSize: 18, fontWeight: 'bold' },
  checkoutButton: { backgroundColor: '#F59E0B', borderRadius: 15, padding: 20, alignItems: 'center', marginBottom: 20 },
  checkoutButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});