import { HydrateClient } from "@periface/trpc/server";
import Logos from "./_components/main/logos";
import StoreFront from "./_components/main/storefront";
import HeaderTitle from "./_components/main/headertitle";
export default async function Home() {
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
            <section className="relative bg-gradient-to-r from-[#e8a11c] to-[#50b7ba] main-font flex min-h-screen flex-col items-center justify-center ">
                <div className="absolute top-0">
                    <Logos logos={logos2} />
                </div>
                <HeaderTitle />
            </section>
            <StoreFront />
        </HydrateClient>
    );
}
