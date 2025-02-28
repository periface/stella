"use client"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@periface/components/ui/dialog";
import { Button } from "@periface/components/ui/button";
import { Label } from "@periface/components/ui/label";
import { Input } from "@periface/components/ui/input";
import { useMainStore } from "@periface/app/_stores/main.store";
import AppSheetImg from "./appsheetimg";
import { Textarea } from "@periface/components/ui/textarea";
import React, { useEffect } from "react";
import { type Product } from "@periface/app/_models/store";
import { toast } from "sonner";
const AddToCart = () => {
    const store = useMainStore();
    const [total, setTotal] = React.useState(0);
    const [quantity, setQuantity] = React.useState(1);
    const [instructions, setInstructions] = React.useState("");
    const [totalPrice, setTotalPrice] = React.useState(0);
    function addToCart(product: Product) {
        const shoppingCart = store.shoppingCart;
        // look for the product in the shopping cart
        const existingProduct = shoppingCart.items.find((item) => item.product.id === product.id);
        if (existingProduct) {
            // if the product exists, update the quantity
            existingProduct.quantity += quantity;
            existingProduct.specifications = instructions;
            console.log("existingProduct", existingProduct);
            store.setShoppingCart({
                items: shoppingCart.items,
            });
            store.selectProduct(null);
            setTotal(0);
            setQuantity(1);
            setInstructions("");
            setTotalPrice(0);
            toast.success("Producto agregado al carrito");
            return;
        }
        store.setShoppingCart({
            items: [
                ...store.shoppingCart.items,
                {
                    product: product,
                    quantity: quantity,
                    specifications: instructions
                }
            ],
        });
        store.selectProduct(null);

        setTotal(0);
        setQuantity(1);
        setInstructions("");
        setTotalPrice(0);
        toast.success("Producto agregado al carrito");
    }

    useEffect(() => {
        if (quantity < 1) {
            setQuantity(1);
        }
        if (store.selectedProduct !== null) {
            setTotalPrice(store.selectedProduct.price * quantity);
        }
        setTotal(totalPrice);
    }, [quantity, total, totalPrice, store.selectedProduct]);
    return <>
        <Dialog open={store.selectedProduct !== null}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Agregar al Carrito</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                </DialogHeader>

                <h2 className="text-2xl text-stella font-bold mb-2">{store.selectedProduct?.product}</h2>
                <div className="grid grid-cols-[30%_70%] items-center justify-center">
                    <div>
                        <AppSheetImg className="w-full rounded-lg" url={store.selectedProduct?.pImage ?? ""} />
                    </div>
                    <div className="grid grid-cols-1 justify-center justify-items-end">
                        <div className="w-1/2">
                            <Label>Cantidad</Label>
                            <Input type="number" step={1} min={1} value={quantity} onChange={(e) => {
                                setQuantity(parseInt(e.target.value));
                            }} />
                        </div>
                        <div>
                            <p className="text-xl mt-2 text-stella font-bold">Total: ${totalPrice}MXN</p>
                        </div>
                    </div>
                </div>
                <div className="grid gap-4 py-4">
                    <p>
                        {store.selectedProduct?.descripcion}
                        <br />
                    </p>
                    <Textarea placeholder="Instrucciones adicionales" value={instructions} onChange={(e) => {
                        setInstructions(e.target.value);
                    }} />
                </div>
                <DialogFooter>
                    <Button type="button" onClick={() => {
                        store.selectProduct(null);
                    }
                    }>Cancelar</Button>
                    <Button type="button" onClick={() => {
                        addToCart(store.selectedProduct!);
                    }}>Agregar al carrito</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
}
export default AddToCart;
