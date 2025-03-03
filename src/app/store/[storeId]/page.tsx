
import ShoppingCart from "@periface/app/_components/main/carts";
import HeaderTitle from "@periface/app/_components/main/headertitle";
import Logos from "@periface/app/_components/main/logos";
import StoreFront from "@periface/app/_components/main/storefront";
import { Toaster } from "@periface/components/ui/sonner";
import { HydrateClient } from "@periface/trpc/server";
import { api } from "@periface/trpc/server";

export default async function Home({ params }: {
    params: Promise<{
        storeId: string;
    }>
}) {
    const storeId = (await params).storeId;
    const sellers = await api.store.getStoreById({ id: storeId });
    if (!sellers) {
        return <div>Store not found</div>
    }
    if (!sellers[0]) {
        return <div>Store not found</div>
    }

    const logos2 = [
        {
            src: "/stella.png",
            alt: "KLC"
        },
        {
            src: "/mercado.png",
            alt: "Consha",
        }
    ]
    return (
        <HydrateClient>
            {sellers && <>
                <ShoppingCart />
                <section className="relative bg-gradient-to-r from-[#e8a11c] to-[#50b7ba] main-font flex min-h-screen flex-col items-center justify-center ">
                    <div className="absolute top-0">
                        <Logos className="w-1/4 m-10" logos={logos2} />
                    </div>
                    <HeaderTitle sellers={sellers} mesa={sellers[0].Nombre} />
                </section>
                <StoreFront byStoreId store={storeId} />
                <Toaster />
            </>}
        </HydrateClient>
    );
}
