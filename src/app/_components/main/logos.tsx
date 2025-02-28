"use client"
import autoAnimate from "@formkit/auto-animate";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import AppSheetImg from "./appsheetimg";
export type LogoProps = {
    src: string;
    alt: string;

}
export type LogosProps = {
    logos: LogoProps[];
    useAppSheet?: boolean;
    style?: CSSProperties
    className: string
};
const Logos = (input: LogosProps) => {
    const [reveal, setReveal] = useState(false);
    const parent = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (parent.current) {
            autoAnimate(parent.current, {
                duration: 1500,
                easing: "ease-in-out",
            });
        }
    }, [parent]);
    setTimeout(() => {
        setReveal(true);
    }, 1000);
    return <><div ref={parent} className="flex justify-center items-center">
        {reveal && input.logos.map((logo, i) => {
            if (input.useAppSheet) {
                return <AppSheetImg style={input.style} key={i} url={logo.src}
                    className={input.className} />
            }
            return <img key={i}
                src={logo.src}
                alt={logo.alt}
                style={input.style}
                className={input.className} />
        }
        )}
    </div>
    </>
        ;
}
export default Logos;
