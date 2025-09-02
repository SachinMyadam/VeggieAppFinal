import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../firebaseConfig'; 
// --- 1. IMPORT onSnapshot ---
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'; 
import { useCart } from '../../context/CartContext';
import { FontAwesome } from '@expo/vector-icons';
import { useNotifications } from '../../context/NotificationContext';
import { useFocusEffect } from 'expo-router';

type Veggie = { id: string; name: string; price: number; imageUrl: string; category: string; emoji: string; isAvailable: boolean; };
const categories = ['All', 'Leafy', 'Root', 'Cruciferous', 'Marrow', 'Allium', 'Other'];

export default function HomeScreen() {
  const [veggies, setVeggies] = useState<Veggie[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart, removeFromCart, getQuantity } = useCart();
  const { subscribeToVeggie, unsubscribeFromVeggie, checkSubscriptionStatus } = useNotifications();
  const [watchedItems, setWatchedItems] = useState<Record<string, boolean>>({});

  // --- 2. REPLACE THE OLD useEffect WITH THIS REAL-TIME LISTENER ---
  useEffect(() => {
    const veggieCollection = collection(db, 'vegetables');
    // We order by name to keep the list consistent
    const q = query(veggieCollection, orderBy("name"));

    // onSnapshot creates a live connection. This function will now run
    // automatically every time there is a change in the 'vegetables' collection.
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const veggieList = snapshot.docs.map(doc => ({
          id: doc.id, 
          isAvailable: true, // Default value in case it's missing
          ...doc.data() 
      } as Veggie));
      setVeggies(veggieList);
      console.log("Vegetable list updated in real-time!");
    }, (error) => {
      console.error("Error fetching veggies in real-time: ", error);
    });

    // This cleans up the listener when you navigate away from the screen
    return () => unsubscribe();
  }, []); // The empty array ensures this only runs once to set up the listener

  useFocusEffect(
    useCallback(() => {
      const checkAllSubscriptions = async () => {
        const newWatchedItems: Record<string, boolean> = {};
        for (const veggie of veggies) {
          newWatchedItems[veggie.id] = await checkSubscriptionStatus(veggie.id);
        }
        setWatchedItems(newWatchedItems);
      };
      if (veggies.length > 0) {
        checkAllSubscriptions();
      }
    }, [veggies, checkSubscriptionStatus])
  );

  const handleWatchToggle = async (veggie: Veggie) => {
    const isWatched = watchedItems[veggie.id];
    if (isWatched) {
      await unsubscribeFromVeggie(veggie.id);
    } else {
      await subscribeToVeggie(veggie.id, veggie.name);
    }
    setWatchedItems(prev => ({...prev, [veggie.id]: !isWatched}));
  };
  
  const filteredVeggies = selectedCategory === 'All'
    ? veggies
    : veggies.filter((veggie) => veggie.category === selectedCategory);
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.bannerContainer}><Text style={styles.bannerText}>🔥 Free Delivery at every corner!</Text></View>
        <View>
          <FlatList
            data={categories}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={[ styles.categoryButton, selectedCategory === item && styles.categoryButtonActive ]} onPress={() => setSelectedCategory(item)}>
                <Text style={[ styles.categoryText, selectedCategory === item && styles.categoryTextActive ]}>{item}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingLeft: 16 }}
          />
        </View>
        <Text style={styles.header}>Veggie Listings</Text>
        <View style={{ paddingHorizontal: 16 }}>
          {filteredVeggies.map((item) => {
            const quantity = getQuantity(item.id);
            return (
              <View key={item.id} style={[styles.veggieItem, !item.isAvailable && styles.veggieItemUnavailable]}>
                <Text style={styles.emoji}>{item.emoji || '🌱'}</Text>
                <View style={styles.veggieInfo}>
                  <Text style={styles.veggieName}>{item.name}</Text>
                  <Text style={styles.veggiePrice}>₹{item.price.toFixed(2)}</Text>
                </View>
                {item.isAvailable ? (
                  quantity > 0 ? (
                    <View style={styles.quantitySelector}>
                      <TouchableOpacity style={styles.quantityButton} onPress={() => removeFromCart(item.id)}><Text style={styles.quantityButtonText}>-</Text></TouchableOpacity>
                      <Text style={styles.quantityText}>{quantity}</Text>
                      <TouchableOpacity style={styles.quantityButton} onPress={() => addToCart(item)}><Text style={styles.quantityButtonText}>+</Text></TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(item)}><Text style={styles.addToCartButtonText}>Add</Text></TouchableOpacity>
                  )
                ) : (
                  <View style={styles.actionContainer}>
                      <TouchableOpacity onPress={() => handleWatchToggle(item)}>
                          <FontAwesome 
                              name={watchedItems[item.id] ? "bell" : "bell-o"} 
                              size={24} 
                              color={watchedItems[item.id] ? "#F59E0B" : "#BDBDBD"}
                          />
                      </TouchableOpacity>
                      <View style={styles.outOfStockButton}>
                        <Text style={styles.outOfStockText}>Out of Stock</Text>
                      </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' },
  bannerContainer: { backgroundColor: '#4CAF50', borderRadius: 12, padding: 16, margin: 16, alignItems: 'center' },
  bannerText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  categoryButton: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: 'white', borderRadius: 20, marginRight: 10, marginBottom: 20 },
  categoryButtonActive: { backgroundColor: '#4CAF50', },
  categoryText: { fontSize: 16, color: '#333', fontWeight: '500' },
  categoryTextActive: { color: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, marginLeft: 16 },
  veggieItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  veggieItemUnavailable: { opacity: 0.7 },
  emoji: { fontSize: 32 },
  veggieInfo: { flex: 1, marginLeft: 12 },
  veggieName: { fontSize: 18, fontWeight: '600' },
  veggiePrice: { fontSize: 14, color: 'gray' },
  addToCartButton: { backgroundColor: '#4CAF50', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20 },
  addToCartButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  quantitySelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e8e8e8', borderRadius: 10 },
  quantityButton: { paddingVertical: 10, paddingHorizontal: 15 },
  quantityButtonText: { color: '#333', fontWeight: 'bold', fontSize: 20 },
  quantityText: { color: '#333', fontWeight: 'bold', fontSize: 16, paddingHorizontal: 8 },
  actionContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },
  outOfStockButton: { backgroundColor: '#BDBDBD', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 20, marginLeft: 15 },
  outOfStockText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});