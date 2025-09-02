import React, { createContext, useState, useContext, ReactNode } from 'react';

type Veggie = { id: string; name: string; price: number; imageUrl: string; category: string; emoji: string; };
export type CartItem = { veggie: Veggie; quantity: number; };

interface CartContextType {
  items: CartItem[];
  addToCart: (veggie: Veggie) => void;
  removeFromCart: (veggieId: string) => void;
  getQuantity: (veggieId: string) => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const addToCart = (veggie: Veggie) => { setItems((currentItems) => { const existingItem = currentItems.find((item) => item.veggie.id === veggie.id); if (existingItem) { return currentItems.map((item) => item.veggie.id === veggie.id ? { ...item, quantity: item.quantity + 1 } : item ); } else { return [...currentItems, { veggie, quantity: 1 }]; } }); };
  const removeFromCart = (veggieId: string) => { setItems((currentItems) => { const existingItem = currentItems.find((item) => item.veggie.id === veggieId); if (existingItem && existingItem.quantity > 1) { return currentItems.map((item) => item.veggie.id === veggieId ? { ...item, quantity: item.quantity - 1 } : item ); } else { return currentItems.filter((item) => item.veggie.id !== veggieId); } }); };
  const getQuantity = (veggieId: string) => { return items.find((item) => item.veggie.id === veggieId)?.quantity || 0; };
  const clearCart = () => { setItems([]); };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, getQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) { throw new Error('useCart must be used within a CartProvider'); }
  return context;
};