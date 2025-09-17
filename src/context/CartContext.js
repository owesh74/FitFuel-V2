import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // On initial load, try to get cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    const savedDate = localStorage.getItem('cartDate');
    const today = new Date().toDateString();

    // If there's a saved cart AND the date is today, load it
    if (savedCart && savedDate === today) {
      setCartItems(JSON.parse(savedCart));
    } else {
      // Otherwise, clear old cart data from storage
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cartDate');
    }
  }, []);

  // Whenever the cart changes, save it to localStorage with today's date
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      localStorage.setItem('cartDate', new Date().toDateString());
    } else {
      localStorage.removeItem('cartItems');
      localStorage.removeItem('cartDate');
    }
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems(prevItems => [...prevItems, item]);
    toast.success(`${item.itemName} added to your meal!`);
  };

  const removeFromCart = (indexToRemove) => {
    setCartItems(prevItems => prevItems.filter((_, index) => index !== indexToRemove));
  };

  const clearCart = () => {
    setCartItems([]);
  };
  
  const totals = cartItems.reduce(
    (acc, item) => {
      acc.calories += item.calories || 0;
      acc.protein += item.protein || 0;
      acc.carbs += item.carbs || 0;
      acc.fat += item.fat || 0;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, totals }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};