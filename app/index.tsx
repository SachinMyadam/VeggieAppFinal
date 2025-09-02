import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // This is the direct navigation command that will now work correctly.
        router.replace('/(tabs)');
      })
      .catch(error => Alert.alert('Sign In Error', error.message))
      .finally(() => setIsLoading(false));
  };

  const handleSignUp = () => {
    if (!email || !password) {
        Alert.alert('Error', 'Please enter both email and password.');
        return;
    }
    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.replace('/(tabs)');
      })
      .catch(error => Alert.alert('Sign Up Error', error.message))
      .finally(() => setIsLoading(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>VeggieApp</Text>
        <Text style={styles.subtitle}>Freshness Delivered</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#8A8A8E"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#8A8A8E"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
        {isLoading ? (
            <ActivityIndicator size="large" color="#28A745" style={{ marginVertical: 20 }} />
        ) : (
            <>
                <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.signUpButton]} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 48, fontWeight: 'bold', color: '#28A745', textAlign: 'center' },
  subtitle: { fontSize: 18, color: 'gray', textAlign: 'center', marginBottom: 50 },
  input: { height: 50, backgroundColor: '#E9ECEF', borderRadius: 10, marginBottom: 15, paddingHorizontal: 15, fontSize: 16, color: '#1C1C1E' },
  button: { backgroundColor: '#28A745', padding: 15, borderRadius: 10, alignItems: 'center' },
  signUpButton: { backgroundColor: '#007BFF', marginTop: 10 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});