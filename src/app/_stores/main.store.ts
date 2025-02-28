import { create } from "zustand";
import { type Product, type ShoppingCart } from "../_models/store";
type MainStore = {
    selectedProduct: Product | null;
    selectProduct: (product: Product | null) => void;
    shoppingCart: ShoppingCart;
    products: Product[];
    setProducts: (products: Product[]) => void;
    setShoppingCart: (shoppingCart: ShoppingCart) => void;
    createSessionId: () => void;
    shoppingCartOpen: boolean;
    setShoppingCartOpen: (open: boolean) => void;
    standId: string;
    setStandId: (standId: string) => void;
}


export const useMainStore = create<MainStore>((set) => ({
    standId: "",
    setStandId: (standId) => set({ standId }),
    selectedProduct: null,
    selectProduct: (product) => set({ selectedProduct: product }),
    shoppingCartOpen: false,
    setShoppingCartOpen: (open) => set({ shoppingCartOpen: open }),
    shoppingCart: { items: [], total: 0 },
    products: [],
    setProducts: (products) => set({ products }),
    setShoppingCart: (shoppingCart) => set({ shoppingCart }),
    createSessionId: () => {
        if (!localStorage.getItem("sessionId")) {
            const sessionId = Math.random().toString(36).substring(2);
            localStorage.setItem("sessionId", sessionId);
        }
    }
}));
