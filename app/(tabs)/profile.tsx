import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db, auth } from '../../firebaseConfig';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { router } from 'expo-router';
import { CartItem } from '../../context/CartContext';

type Order = {
  id: string;
  createdAt?: { toDate: () => Date };
  totalPrice: number;
  items: CartItem[];
};

export default function ProfileScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = auth.currentUser;

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const ordersCollection = collection(db, 'orders');
    const q = query(
      ordersCollection,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(userOrders);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching orders: ", error);
      setIsLoading(false);
      Alert.alert("Error", "Could not fetch order history.");
    });

    return () => unsubscribe();
  }, [user]);

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => {
            auth.signOut().then(() => {
              router.replace('/');
            }).catch(error => Alert.alert('Sign Out Error', error.message));
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>My Profile</Text>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.emailText}>{user?.email}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>₹{totalSpent.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
        </View>

        <Text style={styles.historyTitle}>Order History</Text>

        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderDate}>{item.createdAt ? item.createdAt.toDate().toLocaleDateString() : 'Date not available'}</Text>
                <Text style={styles.orderTotal}>₹{item.totalPrice.toFixed(2)}</Text>
              </View>

              <Text style={styles.orderIdText}>Order ID: {item.id}</Text>

              <View style={styles.itemList}>
                {item.items.map((cartItem, index) => (
                  <Text key={index} style={styles.itemText}>
                    {cartItem.quantity} x {cartItem.veggie.name}
                  </Text>
                ))}
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>You haven't placed any orders yet.</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  contentContainer: {
    flex: 1,
    paddingTop: 20
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold'
  },
  signOutButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8
  },
  signOutButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  emailText: {
    fontSize: 16,
    color: 'gray',
    paddingHorizontal: 20,
    marginBottom: 20
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 30
  },
  statBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  statLabel: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 10
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    marginBottom: 5
  },
  orderDate: {
    fontSize: 16,
    color: 'gray'
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  orderIdText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  itemList: {},
  itemText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20
  },
});

