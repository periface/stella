"use client"
import autoAnimate from "@formkit/auto-animate";
import { useEffect, useRef, useState } from "react";
import Image from "next/image"
export type LogoProps = {
    src: string;
    alt: string;
}
export type LogosProps = {
    logos: LogoProps[];
};
const Logos = (input: LogosProps) => {
    const [reveal, setReveal] = useState(false);
    const parent = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (parent.current) {
            console.log("auto animating");
            autoAnimate(parent.current,{
                duration: 1500,
                easing: "ease-in-out",
            });
        }
    }, [parent]);
    setTimeout(() => {
        setReveal(true);
    }, 1000);
    return <div ref={parent} className="flex justify-center items-center">
        {reveal && input.logos.map((logo, i) => <Image width={100} height={100} key={i} src={logo.src} alt={logo.alt} className="logo p-2 m-2 rounded-md" />)}
    </div>;
}
export default Logos;
