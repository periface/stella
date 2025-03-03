export type Product = {
    id: string;
    sellerId: string;
    product: string;
    price: number
    tamanio: string;
    descripcion: string
    pImage: string;
    sellerObj: Seller;
    imageUrl: string;
}
export type StandSeller = {
    IdVendedor: string;
    IdStand: string;
    De: string;
    Hasta: string;
}

export type Order = {
    Id: string;
    Stand: string;
    Vendedor: string;
    Carrito: string;
    Aceptada: boolean;
    Status: string;
    Email: string;
    Telefono: string;
    Nombre: string;
}
export type Seller = {
    Id: string;
    Nombre: string;
    Logo: string;
    Contacto: string;
    imageUrl: string;
}
export type CarritoCompra = {
    Id: string;
    SessionId: string;
    ProductId: string;
    Qty: number;
    Total: number;
    Indicaciones: string;
    SellerId: string;
    OrderId: string;
    Stand:string;
}
export type CartItem = {
    product: Product;
    quantity: number;
    specifications: string;
}
export type ShoppingCart = {
    items: CartItem[];
}
