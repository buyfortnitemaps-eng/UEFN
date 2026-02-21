/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../../../firebase";
import { useAuth } from "../context/AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  // ১. পেজ লোড হলে লোকাল স্টোরেজ থেকে ডাটা নেওয়া
  useEffect(() => {
    const savedCart = localStorage.getItem("uefn_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // ২. লগইন করলে ডাটাবেজ থেকে কার্ট আনা
  useEffect(() => {
    if (user) {
      const fetchCart = async () => {
        const token = await auth.currentUser.getIdToken();
        const res = await fetch("https://uefn-maps-server.vercel.app/api/v1/cart", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success && data.data) setCart(data.data.products);
      };
      fetchCart();
    }
  }, [user]);

  // ৩. সিঙ্ক ফাংশন (পুরো অবজেক্টের অ্যারে পাঠাচ্ছে)
  const syncWithDB = async (updatedCart) => {
    localStorage.setItem("uefn_cart", JSON.stringify(updatedCart));
    if (user) {
      const token = await auth.currentUser.getIdToken();
      await fetch("https://uefn-maps-server.vercel.app/api/v1/cart/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ products: updatedCart }) // এখানে IDs না, পুরো Object যাচ্ছে
      });
    }
  };

  const addToCart = (product) => {
    const isExist = cart.find((item) => item._id === product._id);
    if (!isExist) {
      const newCart = [...cart, product];
      setCart(newCart);
      syncWithDB(newCart);
      return true;
    }
    return false;
  };

  const removeFromCart = (id) => {
    // ১. কার্ট থেকে ওই নির্দিষ্ট আইডি বাদ দিয়ে নতুন অ্যারে তৈরি করা
    const updatedCart = cart.filter((item) => item._id !== id);
    
    // ২. লোকাল স্টেট আপডেট করা (এতে UI সাথে সাথে আপডেট হবে)
    setCart(updatedCart);
    
    // ৩. লোকাল স্টোরেজ এবং ব্যাকএন্ড ডাটাবেজে আপডেট পাঠানো
    // আমরা আগের তৈরি করা syncWithDB ফাংশনটি এখানে কল করছি
    syncWithDB(updatedCart);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);