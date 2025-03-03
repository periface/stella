"use client"
import { api } from "@periface/trpc/react";
import AppSheetImg from "./appsheetimg";
import { type Product } from "@periface/app/_models/store";
import { useMainStore } from "@periface/app/_stores/main.store";
import AddToCart from "./addToCartDialog";
import { useEffect } from "react";
export type StoreFrontProps = {
    store: string
    byStoreId?: boolean
}
const StoreFront = (props: StoreFrontProps) => {

    useEffect(() => {
        const onBeforeUnload = () => {
            //#############
            console.log("SOME CODE HERE");
            //#############
            return "Anything here as well, doesn't matter!";
        };
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
        };
    }, []);
    const store = useMainStore();
    const { data, error } = api.store.getProducts.useQuery({
        stand: props.store,
        byStoreId: props.byStoreId
    });
    if (error) {
        return <div className="text-center">Error: {error.message}</div>;
    }
    if (!data) {
        return <div className="text-center">Cargando productos...</div>;
    }
    const productos = data.products;
    const openAddToCart = (producto: Product) => {
        store.selectProduct(producto);
    }
    const isEven = (num: number) => num % 2 === 0;
    return <>
        <AddToCart />
        {productos.map((producto, index) => (
            <section key={index} className="main-font text-black bg-white flex min-h-screen flex-col items-center justify-center">
                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white rounded-lg p-5">
                        <div className="flex justify-between relative">
                            <h2 className="text-2xl text-stella font-bold ">{producto.product}</h2>
                            <p className="text-xl font-bold text-stella2">${producto.price}MXN</p>
                        </div>
                        <div className="flex justify-between">
                            <p>{producto.sellerObj.Nombre}</p>
                            <p>{producto.tamanio}</p>
                        </div>
                        <p>{producto.descripcion}</p>
                        <div className="relative w-full h-full">
                            <AppSheetImg url={producto.imageUrl} />
                            <button type="button" onClick={() => {
                                openAddToCart(producto)
                            }}
                                className={
                                    isEven(index) ?
                                        "w-full bg-stella2 text-white rounded-lg p-2 absolute bottom-0 right-0"
                                        : "w-full bg-stella text-white rounded-lg p-2 absolute bottom-0 right-0"}>
                                LO QUIERO!</button>
                            <div className="bg-white  w-1/4 absolute top-0 right-0" style={{
                                opacity: 0.5,
                            }}>
                                <div className="p-2" >
                                    <AppSheetImg url={producto.sellerObj.imageUrl} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        ))}


    </>
}

export default StoreFront;
