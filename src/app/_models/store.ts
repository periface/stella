export type Product = {
    seller: string;
    product: string;
    price: number
    tamanio: string;
    description: string
    image: string;
    pImage: string;
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
