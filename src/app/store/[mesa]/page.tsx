import ShoppingCart from "@periface/app/_components/main/carts";
import HeaderTitle from "@periface/app/_components/main/headertitle";
import Logos from "@periface/app/_components/main/logos";
import StoreFront from "@periface/app/_components/main/storefront";
import { Toaster } from "@periface/components/ui/sonner";
import { HydrateClient } from "@periface/trpc/server";
import { api } from "@periface/trpc/server";

export default async function Home({ params }: {
    params: Promise<{
        mesa: string;
    }>
}) {
    const mesa = (await params).mesa;
    const sellers = await api.store.getSellersByStand({ stand: mesa });
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
            <ShoppingCart />

            <section className="relative bg-gradient-to-r from-[#e8a11c] to-[#50b7ba] main-font flex min-h-screen flex-col items-center justify-center ">
                <div className="absolute top-0">
                    <Logos className="w-1/4 m-10" logos={logos2} />
                </div>
                <HeaderTitle sellers={sellers.sellers} mesa={mesa} />
            </section>
            <StoreFront store={mesa} />
            <Toaster />
        </HydrateClient>
    );
}
