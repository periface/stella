"use client"
import { Button } from "@periface/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";
import React from "react";
import CartDialog from "./cartDialog";
import { useMainStore } from "@periface/app/_stores/main.store";

export default function ShoppingCart() {
    const store = useMainStore();
    const cartQty = store.shoppingCart.items.length;
    return (
        <>
            <CartDialog />
            <div className="relative z-10">
                <div className="fixed top-3 right-2">
                    <Button onClick={() => {
                        store.setShoppingCartOpen(true);
                    }} className="rounded-full w-20 h-20 text-2xl" variant="outline" size="icon">
                        <ShoppingCartIcon className="text-2xl" size={64} />
                        <span className="absolute top-0 right-0 bg-red-500 rounded-full text-white text-xs w-5 h-5 flex items-center justify-center">
                            {cartQty}
                        </span>
                    </Button>
                </div>
            </div>
        </>
    );
}
