import { HydrateClient } from "@periface/trpc/server";
import { Link } from "lucide-react";
export default async function Home() {

    return (
        <HydrateClient>
            <section className="relative bg-gradient-to-r from-[#e8a11c] to-[#50b7ba] main-font flex min-h-screen flex-col items-center justify-center ">
                <h1 className="text-4xl text-white">Uy esto aun no esta listo</h1>
                <Link href="/store/63" className="text-white bg-stella2 p-2 cursor-pointer rounded-md">Ir al stand #63</Link>
            </section>
        </HydrateClient>
    );
}
