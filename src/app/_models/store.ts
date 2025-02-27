export type Product = {
    sellerId: string;
    product: string;
    price: number
    tamanio: string;
    description: string
    pImage: string;
    sellerObj: Seller;
}
export type Seller = {
    Id: string;
    Nombre: string;
    Logo: string;
    Contacto: string;
}
export type CartItem = {
    product: Product;
    quantity: number;
    specifications: string;
}
export type ShoppingCart = {
    items: CartItem[];
    total: number;
}
