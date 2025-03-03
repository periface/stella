import { Product, type ShoppingCart } from "@periface/app/_models/store";
import {
    createTRPCRouter,
    publicProcedure,
} from "@periface/server/api/trpc";
import { orderService, sellerService, standService } from "@periface/server/services/store";
import { z } from "zod";
export const storeRouter = createTRPCRouter({
    getStoreById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async (props) => {
            try {
                const response = await sellerService.getSellerById(props.input.id)
                return response;
            }
            catch (e) {
                console.log(e)
                return null;
            }
        }),
    getSellersByStand: publicProcedure.input(z.object({ stand: z.string() }))
        .query(async (props) => {
            try {
                const response = await sellerService
                    .getSellersByStand(props.input.stand)
                return response;
            }
            catch (e) {
                console.log(e)
                return {
                    sellers: []
                };
            }
        }),
    getProducts: publicProcedure
        .input(z.object({
            stand: z.string(),
            byStoreId: z.boolean().optional()
        }))
        .query(async (props) => {
            try {
                let productos: Product[] = []
                if (props.input.byStoreId) {
                    productos = (await sellerService.getProducts(props.input.stand)).products
                }
                else {

                    productos = await standService.getProducts(props.input.stand)
                }
                return {
                    products: productos
                }
            }
            catch (e) {
                console.log(e)
                return {
                    products: []
                };
            }
        }),

    //export type CartItem = {
    //    product: Product;
    //    quantity: number;
    //    specifications: string;
    //}
    //export type ShoppingCart = {
    //    items: CartItem[];
    //}
    //
    //id: string;
    //sellerId: string;
    //product: string;
    //price: number
    //tamanio: string;
    //descripcion: string
    //pImage: string;
    //sellerObj: Seller;
    placeOrder: publicProcedure.input(z.object({
        cart: z.object({
            items: z.array(z.object({
                product: z.object({
                    id: z.string(),
                    sellerId: z.string(),
                    product: z.string(),
                    price: z.number(),
                    tamanio: z.string(),
                    descripcion: z.string(),
                    pImage: z.string(),
                    sellerObj: z.object({
                        Id: z.string(),
                        Nombre: z.string(),
                        Logo: z.string(),
                        Contacto: z.string(),
                    }),
                }),
                specifications: z.string(),
                quantity: z.number(),
            })),
        }),
        email: z.string(),
        phone: z.string(),
        standId: z.string(),
    })).mutation(async (props) => {
        try {
            const response = await orderService.placeOrder(
                props.input.cart as ShoppingCart,
                props.input.email,
                props.input.phone,
                props.input.standId
            )
            return response;
        }
        catch (e) {
            console.log(e)
            return [];
        }
    }),
});
