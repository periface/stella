"use client"
import autoAnimate from "@formkit/auto-animate";
import { useEffect, useRef, useState } from "react";

export default function Buttons() {

    const [reveal, setReveal] = useState(false);
    const parent = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (parent.current) {
            console.log("auto animating");
            autoAnimate(parent.current, {
                duration: 1500,
                easing: "ease-in-out",
            });
        }
    }, [parent]);
    setTimeout(() => {
        setReveal(true);
    }, 1000);
    return <div ref={parent} className="flex justify-center items-center w-full">
        {reveal && <>
            <button className="w-1/2 bg-gradient-to-r from-[#e8a11c] to-[#50b7ba] text-white p-2 m-2 rounded-md">Productos/Pedidos</button>
        </>
        }
    </div>;
}
