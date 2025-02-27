import { create } from "zustand";
import { type Product, type ShoppingCart } from "../_models/store";
type MainStore = {
    sessionId: () => string;
    shoppingCart: () => ShoppingCart;
    products: Product[];
    setProducts: (products: Product[]) => void;
    setShoppingCart: (shoppingCart: ShoppingCart) => void;
    createSessionId: () => void;
}

const localStorageKey = "shoppingCart";
const sessionIdKey = "sessionId";

export const useMainStore = create<MainStore>((set) => ({
    shoppingCart: () => {
        const shoppingCart = localStorage.getItem(localStorageKey);
        if (!shoppingCart) {
            return { total: 0, items: [] } as ShoppingCart;
        }
        return JSON.parse(shoppingCart) as ShoppingCart;
    },
    products: [],
    setProducts: (products) => set({ products }),
    setShoppingCart: (shoppingCart) => {
        localStorage.setItem(localStorageKey, JSON.stringify(shoppingCart));
    },
    sessionId: () => {
        let sessionId = localStorage.getItem(sessionIdKey);
        if (!sessionId) {
            sessionId = Math.random().toString(36).substring(2);
            localStorage.setItem(sessionIdKey, sessionId);
        }
        return sessionId;
    },
    createSessionId: () => {
        if (!localStorage.getItem("sessionId")) {
            const sessionId = Math.random().toString(36).substring(2);
            localStorage.setItem("sessionId", sessionId);
        }
    }
}));
