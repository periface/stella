import { type StandSeller, type Product, type Seller, type ShoppingCart, type CartItem, type CarritoCompra, type Order } from "@periface/app/_models/store";
import { env } from "@periface/env";

const APPSHEETSID = env.APPSHEETSID;
const APPSHEETSSECRET = env.APPSHEETSSECRET;
const APPSHEETCONFIG = {
    rest: {
        products: {
            url: `https://www.appsheet.com/api/v2/apps/${APPSHEETSID}/tables/Productos/Action?applicationAccessKey=${APPSHEETSSECRET}`,
        },
        vendedor: {
            url: `https://www.appsheet.com/api/v2/apps/${APPSHEETSID}/tables/Vendedor/Action?applicationAccessKey=${APPSHEETSSECRET}`,
        },
        standsVendedor: {
            url: `https://www.appsheet.com/api/v2/apps/${APPSHEETSID}/tables/StandVendedor/Action?applicationAccessKey=${APPSHEETSSECRET}`,
        },
        ordenes: {
            url: `https://www.appsheet.com/api/v2/apps/${APPSHEETSID}/tables/Ordenes/Action?applicationAccessKey=${APPSHEETSSECRET}`,
        },
        carritoCompra: {
            url: `https://www.appsheet.com/api/v2/apps/${APPSHEETSID}/tables/CarritoCompra/Action?applicationAccessKey=${APPSHEETSSECRET}`,
        },
        notificacionesEnviadas: {
            url: `https://www.appsheet.com/api/v2/apps/${APPSHEETSID}/tables/NOTIFICACIONES%20DE%20CORREO/Action?applicationAccessKey=${APPSHEETSSECRET}`,
        }
    }
}
export type NotificacionEnviada = {
    ID_Notificacion: string;
    Correos: string;
    Contenido: string;
    Fecha_De_Notificacion: string;
    Revision: string;
    Leido: boolean;
    FechaLeido: string;
    Lecturas: string
}
async function getNotificacionesEnviadas() {
    const response = await fetch(APPSHEETCONFIG.rest.notificacionesEnviadas.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },

        body: JSON.stringify({
            "Action": "Find"
        }),
    })
    const data = await response.json() as NotificacionEnviada[];
    return {
        notificaciones: data
    };

}
async function updateLeido(notificacionId: string) {

    const responseFind = (await fetch(APPSHEETCONFIG.rest.notificacionesEnviadas.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "Action": "Find",
            "Properties": {
            },
            "Rows": [
                {
                    "ID_Notificacion": notificacionId,
                }
            ]
        }),
    }))
    const notificacion = (await responseFind.json()) as NotificacionEnviada[]
    // dont annoy appsheets
    await new Promise(resolve => {
        setTimeout(() => {
            resolve([]);
        }, 500)
    })
    let lecturasCtr = 0;
    if (notificacion[0]) {
        lecturasCtr = parseInt(notificacion[0].Lecturas);
    }
    const lecturasCounter = lecturasCtr + 1;
    const response = await fetch(APPSHEETCONFIG.rest.notificacionesEnviadas.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "Action": "Edit",
            "Properties": {
            },
            "Rows": [
                {
                    "ID_Notificacion": notificacionId,
                    "Leido": true,
                    "FechaLeido": new Date().toISOString(),
                    "Lecturas": (lecturasCounter)
                }
            ]
        }),
    })
    const data = await response.json() as NotificacionEnviada[];
    return data;
}
async function getSellersByStand(standId: string) {
    const response = await fetch(APPSHEETCONFIG.rest.standsVendedor.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "Action": "Find",
            "Properties": {
                "Selector": `Filter(StandVendedor, [IdStand] = "${standId}")`
            }
        }),
    })
    let data = await response.json() as StandSeller[];
    data = data.filter((stand) => stand.IdStand === standId);
    const sellerInfos = await Promise.all(data.map(async (stand) => {
        const seller = await getSellerById(stand.IdVendedor);
        return seller.find((s) => s.Id === stand.IdVendedor);
    }));
    const filteredSellerInfos = sellerInfos.filter((seller) => seller !== undefined);
    return {
        sellers: filteredSellerInfos
    };
}
async function getSellerById(sellerId: string) {
    const response = await fetch(APPSHEETCONFIG.rest.vendedor.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },

        body: JSON.stringify({
            "Action": "Find",
            "Properties": {
                "Selector": `Filter(Vendedor, [Id] = "${sellerId}")`
            }
        }),
    })
    const data = await response.json() as Seller[];
    return data ?? [];
}
async function mapDataProductsAsync(data: Product[]) {
    const mappedData = await Promise.all(data.map(async (product) => {
        product.price = parseFloat(product.price.toString());
        const seller = await getSellerById(product.sellerId);
        const foundSeller = seller.find((s) => s.Id === product.sellerId);
        return {
            ...product,
            sellerObj: foundSeller ?? { Id: "", Nombre: "", Logo: "", Contacto: "" }
        }
    }))
    return mappedData;
}
async function getAllProducts() {
    const response = await fetch(APPSHEETCONFIG.rest.products.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },

        body: JSON.stringify({
            "Action": "Find"
        }),
    })
    const data = await response.json() as Product[];
    const mappedData = await mapDataProductsAsync(data);
    return {
        products: mappedData
    };

}
async function getProductsBySellerId(sellerId: string) {

    const response = await fetch(APPSHEETCONFIG.rest.products.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },

        body: JSON.stringify({
            "Action": "Find",
            "Properties": {
                "Selector": `Filter(Productos, [sellerId] = "${sellerId}")`
            }
        }),
    })
    const data = await response.json() as Product[];
    const mappedData = await mapDataProductsAsync(data);
    return {
        products: mappedData as Product[]
    };
}
async function getProductsByStand(standId: string) {
    const productos: Product[] = [];
    const response = await getSellersByStand(standId);
    await Promise.all(response.sellers.map(async seller => {
        const response = await getProductsBySellerId(seller.Id);
        response.products.forEach(p => {
            productos.push({
                ...p,
                sellerObj: seller
            })
        })
    }))
    return productos;
}
async function storeCart(cartRows: Record<string, string | number>[]) {
    try {
        console.log("Cart rows", cartRows);
        const response = await fetch(APPSHEETCONFIG.rest.carritoCompra.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },

            body: JSON.stringify({
                "Action": "Add",
                "Properties": {
                },
                "Rows": cartRows
            }),
        })
        const data = await response.json() as { Rows: CarritoCompra[] };
        return data.Rows;
    }
    catch (e) {
        console.error(e);
        return [];
    }
}
export type GroupedCart = {
    sellerId: string;
    items: CarritoCompra[]
    cartId: string;
}
function groupBySeller(cart: CarritoCompra[]) {
    console.log("Cart", cart);
    const groups: GroupedCart[] = []
    cart.forEach((item) => {
        const group = groups.find((g) => g.sellerId === item.SellerId);
        if (group) {
            group.items.push(item);
        } else {
            groups.push({
                sellerId: item.SellerId,
                cartId: item.Id,
                items: [item]
            })
        }
    })
    return groups;
}
const makeCartRows = (cart: ShoppingCart, orderId: string, sessionId: string) => {

    const rows: Record<string, string | number>[] = [];
    cart.items.forEach((item) => {
        rows.push({
            "SessionId": sessionId,
            "ProductId": item.product.id,
            "Qty": item.quantity,
            "Total": item.product.price * item.quantity,
            "Indicaciones": item.specifications,
            "OrderId": orderId
        })
    })
    return rows;
}
async function storeOrder(standId: string, cart: ShoppingCart, email: string, phone: string) {
    const cartItems = cart.items.map((item) => {
        return {
            "SessionId": "",
            "ProductId": item.product.id,
            "Qty": item.quantity,
            "Total": item.product.price * item.quantity,
            "Indicaciones": item.specifications,
            "SellerId": item.product.sellerId,
            "OrderId": "",
            "Stand": standId
        } as CarritoCompra
    })
    const rows: Record<string, string | number | boolean>[] = [];
    const groupedCart = groupBySeller(cartItems);
    for (const group of groupedCart) {
        rows.push({
            "Stand": standId,
            "Vendedor": group.sellerId,
            "Aceptada": false,
            "Status": "Pendiente",
            "Email": email,
            "Telefono": phone,
            "Nombre": "",
            "Total": group.items.reduce((acc, item) => acc + item.Total, 0)
        }) // add the group to the order
    }
    const response = await fetch(APPSHEETCONFIG.rest.ordenes.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },

        body: JSON.stringify({
            "Action": "Add",
            "Properties": {
            },
            "Rows": rows
        }),
    })
    const data = await response.json() as { Rows: Order[] };
    return {
        orders: data,
        groupedCart
    };
}
async function placeOrder(cart: ShoppingCart,
    email: string,
    phone: string,
    standId: string
) {

    const sessionId = email + phone + Date.now();
    const { orders, groupedCart } = await storeOrder(standId, cart, email, phone);
    for (const group of groupedCart) {
        const order = orders.Rows.find((order) => order.Vendedor === group.sellerId);
        if (!order) {
            throw new Error("Order not found");
        }
        const rows = makeCartRows(cart, order?.Id, sessionId);
        const storedCarts = await storeCart(rows);
        console.log("Stored carts", storedCarts);
    }
}
const sellerService = {
    getSellerById,
    getSellersByStand,
    getProducts: getProductsBySellerId
}
const productsService = {
    getAllProducts
}
const standService = {
    getProducts: getProductsByStand
}
const orderService = {
    placeOrder
}
const notificationService = {
    getNotificacionesEnviadas,
    updateLeido
}

export { notificationService, orderService, sellerService, standService, productsService }


