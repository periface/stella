"use client"
import { useMainStore } from "@periface/app/_stores/main.store";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from "@periface/components/ui/dialog";
import { Button } from "@periface/components/ui/button";
import { Label } from "@periface/components/ui/label";
import { Input } from "@periface/components/ui/input";
import { type ShoppingCart, type Product } from "@periface/app/_models/store";
import React, { useEffect, useState } from "react";
import { api } from "@periface/trpc/react";
const CartDialog = () => {
    const store = useMainStore();
    console.log("store", store);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [isOrderValid, setIsOrderValid] = useState(false);
    const { mutateAsync } = api.store.placeOrder.useMutation();
    function placeOrder() {
        const cart = store.shoppingCart;
        console.log("Placing order", cart);
        store.setShoppingCartOpen(false);
        const requestOrder = {
            cart: cart,
            email: email,
            phone: phone,
            standId: store.standId,
        }
        mutateAsync(requestOrder).then((data) => {
            console.log("Order placed", data);
            store.setShoppingCart({
                items: []
            });
        }).catch((e) => {
            console.log("Error placing order", e);
        });
    }

    function reduceQuantity(product: Product) {
        const item = store.shoppingCart.items.find((item) => item.product.id === product.id);
        if (item) {
            item.quantity -= 1;
            if (item.quantity < 1) {
                // remove the item from the cartInfo
                const newItems = store.shoppingCart.items.filter((i) => i.product.id !== product.id);
                store.setShoppingCart({
                    items: newItems,
                });
            } else {
                store.setShoppingCart({
                    items: store.shoppingCart.items,
                });
            }
        }
    }
    function getCartTotal(cart: ShoppingCart) {
        return cart.items.reduce((acc, item) => {
            return acc + item.product.price * item.quantity
        }, 0);
    }
    function increaseQuantity(product: Product) {
        const item = store.shoppingCart.items.find((item) => item.product.id === product.id);
        if (item) {
            item.quantity += 1;
            store.setShoppingCart({
                items: store.shoppingCart.items,
            });
        }
    }
    useEffect(() => {
        if (email.length > 0 && phone.length > 0 && store.shoppingCart.items.length > 0) {
            setIsOrderValid(true);
        } else {
            setIsOrderValid(false);
        }
    }, [phone, email, store.shoppingCart.items]);
    return <>
        <Dialog open={store.shoppingCartOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Mi carrito</DialogTitle>
                </DialogHeader>
                {store.shoppingCart.items.length === 0 && <p>No hay productos en tu carrito</p>}
                {store.shoppingCart.items.map((item, index) => {
                    return <div key={index} className="flex border-b-2 justify-between items-center">
                        <div>
                            <Label>{item.product.product}</Label>
                            <p className="text-sm">${item.product.price} MXN x {item.quantity} = ${item.product.price * item.quantity} MXN
                            </p>
                            <p className="text-xs">{item.specifications}</p>
                        </div>
                        <div className="flex w-1/3">
                            <Button onClick={() => reduceQuantity(item.product)} variant="outline" size="icon">-</Button>
                            <Input type="number" value={item.quantity} readOnly />
                            <Button onClick={() => increaseQuantity(item.product)} variant="outline" size="icon">+</Button>
                        </div>
                    </div>
                })}
                <div className="flex justify-between">
                    <Label>Total</Label>
                    <p>${getCartTotal(store.shoppingCart)} MXN</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <Label>Email</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Label>Teléfono</Label>
                    <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => {
                        store.setShoppingCartOpen(false);
                    }}>Cerrar</Button>
                    <Button variant="outline" disabled={!isOrderValid} onClick={() => {

                        placeOrder();
                    }}>Confirmar orden</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
}
export default CartDialog;
