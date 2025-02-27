
import {
    createTRPCRouter,
    publicProcedure,
} from "@periface/server/api/trpc";
import { env } from "@periface/env";
import { type Seller, type Product } from "@periface/app/_models/store";
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
    }
}
async function getSeller(sellerId: string) {
    console.log('sellerId', sellerId)
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
        const seller = await getSeller(product.sellerId);
        const foundSeller = seller.find((s) => s.Id === product.sellerId);
        console.log('foundSeller', foundSeller)
        return {
            ...product,
            sellerObj: foundSeller ?? { Id: "", Nombre: "", Logo: "", Contacto: "" }
        }
    }))
    return mappedData;
}
export const storeRouter = createTRPCRouter({
    getProducts: publicProcedure
        .query(async () => {
            try {
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
            catch (e) {
                console.log(e)
                return {
                    products: []
                };
            }
        }),
});
