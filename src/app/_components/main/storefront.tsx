import { type Product } from "@periface/app/_models/store";

const StoreFront = () => {

    const productos: Product[] = [
        {
            seller: "LavinCoach",
            product: "Anuncio Neon 30x30",
            price: 500,
            tamanio: "30cm x 30cm",
            description: "Anuncio de neón de 30x30cm, dos colores",
            image: "/klc.png",
            pImage: "/anuncio1.png"
        },
        {
            seller: "Conshita",
            product: "Placa p/correa MDF chica",
            price: 120,
            tamanio: "10cm x 10cm",
            description: "Placa de MDF para correa de perro",
            image: "/consha.svg",
            pImage: "/mdf1.jpeg"
        }
    ]
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
                            <p>{producto.seller}</p>
                            <p>{producto.tamanio}</p>
                        </div>
                        <p>{producto.description}</p>
                        <div className="relative w-full h-full">
                            <img src={producto.pImage} alt={producto.product} />
                            <button className="w-full bg-primary text-white rounded-lg p-2 absolute bottom-0 right-0">LO QUIERO!</button>
                            <div className="bg-white  rounded-lg w-1/3 absolute top-0 right-0" style={{
                                opacity: 0.5,
                            }}>
                                <div className="p-2" >
                                    <img className="w-full" src={producto.image} alt={producto.seller} />
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
