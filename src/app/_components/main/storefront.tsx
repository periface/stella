"use client"
import { type Product } from "@periface/app/_models/store";
import { api } from "@periface/trpc/react";
import AppSheetImg from "./appsheetimg";
const StoreFront = () => {
    const { data, error } = api.store.getProducts.useQuery();
    if (error) {
        return <div>Error: {error.message}</div>;
    }
    if (!data) {
        return <div className="text-center">Cargando productos...</div>;
    }
    const productos = data.products;
    const randomizedArray = productos.sort(() => Math.random() - 0.5);
    return <>
        {randomizedArray.map((producto, index) => (
            <section key={index} className="main-font text-black bg-white flex min-h-screen flex-col items-center justify-center">
                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white rounded-lg p-5">
                        <div className="flex justify-between relative">
                            <h2 className="text-xl text-primary font-bold ">{producto.product}</h2>
                            <p className="text-lg font-bold text-secondary">${producto.price}MXN</p>
                        </div>
                        <div className="flex justify-between">
                            <p>{producto.sellerObj.Nombre}</p>
                            <p>{producto.tamanio}</p>
                        </div>
                        <p>{producto.description}</p>
                        <div className="relative w-full h-full">
                            <AppSheetImg url={producto.pImage}  />
                            <button className="w-full bg-primary text-white rounded-lg p-2 absolute bottom-0 right-0">LO QUIERO!</button>
                            <div className="bg-white  rounded-lg w-1/3 absolute top-0 right-0" style={{
                                opacity: 0.5,
                            }}>
                                <div className="p-2" >
                                    <AppSheetImg url={producto.sellerObj.Logo} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        ))}
    </>

}

export default StoreFront;
