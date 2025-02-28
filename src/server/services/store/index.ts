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
        }

    }
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
        products: mappedData
    };
}
async function getProductsByStand(standId: string) {
    const productos: Product[] = [];
    const response = await getSellersByStand(standId);
    await Promise.all(response.sellers.map(async seller => {
        const response = await getProductsBySellerId(seller.Id);
        response.products.forEach(p => productos.push(p))
    }))
    return productos;
}
async function storeCart(cart: ShoppingCart, email: string, phone: string) {
    const sessionId = email + phone + Date.now();
    const rows: Record<string, string | number>[] = [];
    cart.items.forEach((item) => {
        rows.push({
            "SessionId": sessionId,
            "ProductId": item.product.id,
            "Qty": item.quantity,
            "Total": item.product.price * item.quantity,
            "Indicaciones": item.specifications
        })
    })
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
            "Rows": rows
        }),
    })
    const data = await response.json() as { Rows: CarritoCompra[] };
    console.log("Cart stored", data);
    const rowsFixed = data.Rows.map((item) => {
        const seller = cart.items.find((i) => i.product.id === item.ProductId);
        item.SellerId = seller?.product.sellerId ?? "";
        return item;
    })
    return rowsFixed;
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
async function placeOrder(cart: ShoppingCart,
    email: string,
    phone: string,
    standId: string
) {
    const storeCartResponse = await storeCart(cart, email, phone);
    const rows = [];
    const groupedCart = groupBySeller(storeCartResponse);
    console.log("Grouped cart", groupedCart);
    for (const group of groupedCart) {
        rows.push({
            "Stand": standId,
            "Vendedor": group.sellerId,
            "Carrito": group.cartId,
            "Aceptada": false,
            "Status": "Pendiente",
            "Email": email,
            "Telefono": phone,
            "Nombre": "",
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
    const data = await response.json() as Order[];
    return data;
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

export { orderService, sellerService, standService, productsService }


