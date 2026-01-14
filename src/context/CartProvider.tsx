
"use client";

import type { CartItem, Product } from "@/lib/types";
import React, { createContext, useReducer, ReactNode, Dispatch, useEffect } from "react";
import { products, donationProduct } from "@/lib/products";
import { calculateTierDiscount, calculatePoints, pricing } from "@/lib/pricing";

type CartState = {
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  finalTotal: number;
  points: number;
  tier: { name: string; discountPercent: number; color: string };
};

type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "DECREMENT_ITEM"; payload: { id: string } }
  | { type: "REPLACE_WITH_BUNDLE" }
  | { type: "CLEAR_CART" }
  | { type: "SET_STATE"; payload: Partial<CartState> };

const calculateCartTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountPercent = calculateTierDiscount(subtotal);
  const discountAmount = subtotal * discountPercent;
  const finalTotal = subtotal - discountAmount;
  const points = calculatePoints(subtotal);

  // Find current tier
  const currentTier = [...pricing.tiers].reverse().find(tier => subtotal >= tier.minSpend) || pricing.tiers[0];

  return { subtotal, discountAmount, finalTotal, points, tier: currentTier };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState;

  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      let newItems;
      if (action.payload.id === donationProduct.id) {
        if (existingItemIndex > -1) {
          newState = state;
          break;
        }
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      } else if (existingItemIndex > -1) {
        newItems = [...state.items];
        newItems[existingItemIndex].quantity += 1;
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      newState = { ...state, items: newItems, ...calculateCartTotals(newItems) };
      break;
    }
    case "DECREMENT_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (existingItemIndex > -1) {
        let newItems = [...state.items];
        if (newItems[existingItemIndex].quantity > 1) {
          newItems[existingItemIndex].quantity -= 1;
        } else {
          newItems = state.items.filter((item) => item.id !== action.payload.id);
        }
        newState = { ...state, items: newItems, ...calculateCartTotals(newItems) };
      } else {
        newState = state;
      }
      break;
    }
    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload.id);
      newState = { ...state, items: newItems, ...calculateCartTotals(newItems) };
      break;
    }
    case "REPLACE_WITH_BUNDLE": {
      const bundleProduct = products.find(p => p.id === '4');
      if (!bundleProduct) {
        newState = state;
        break;
      }

      const itemsToKeep = state.items.filter(item => !['1', '2', '3'].includes(item.id));
      const bundleInCart = itemsToKeep.find(item => item.id === '4');

      if (bundleInCart) {
        bundleInCart.quantity += 1;
      } else {
        itemsToKeep.push({ ...bundleProduct, quantity: 1 });
      }

      newState = { ...state, items: itemsToKeep, ...calculateCartTotals(itemsToKeep) };
      break;
    }
    case "CLEAR_CART":
      newState = { ...state, items: [], subtotal: 0, discountAmount: 0, finalTotal: 0, points: 0, tier: pricing.tiers[0] };
      break;

    case "SET_STATE":
      // Re-calculate totals when hydrating just in case logic changed
      const items = action.payload.items || [];
      newState = { ...state, ...action.payload, ...calculateCartTotals(items) };
      break;

    default:
      newState = state;
  }
  return newState;
};

export const CartContext = createContext<{
  state: CartState;
  dispatch: Dispatch<CartAction>;
} | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    subtotal: 0,
    discountAmount: 0,
    finalTotal: 0,
    points: 0,
    tier: pricing.tiers[0]
  });

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Handle migration from old array-only format to new object format if needed, 
        // but previously it was just array of items.
        // If it's an array, it's the old format.
        if (Array.isArray(parsedCart)) {
          dispatch({ type: 'SET_STATE', payload: { items: parsedCart } });
        } else {
          // New format (if we decide to store full state, but let's stick to storing items for simplicity and re-calc)
          dispatch({ type: 'SET_STATE', payload: { items: parsedCart } });
        }
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Only store items to simulate "backend" persistence source of truth
        localStorage.setItem('cart', JSON.stringify(state.items));

        // Also accumulate points in a separate storage for "Lifetime Points" gamification
        // simple hack: just update a 'totalPoints' whenever points change? 
        // Better: 'points' in state is "Pending Points" for THIS order.
        // Real gamification needs a user DB. 
        // For this task, we will just persist the current order's points.

      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
