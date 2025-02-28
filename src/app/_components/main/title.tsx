"use client"
import autoAnimate from "@formkit/auto-animate";
import { useEffect, useRef, useState } from "react";
export type TitleProps = {
    onReveal?: () => void;
    mesa: string;
}
export default function Title(props?: TitleProps) {

    const [reveal, setReveal] = useState(false);
    const parent = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (parent.current) {
            console.log("auto animating");
            autoAnimate(parent.current, {
                duration: 500,
                easing: "ease-in-out",
            });
        }
    }, [parent]);
    setTimeout(() => {
        if (props?.onReveal) {
            if (typeof props.onReveal === "function")
            props.onReveal();
        }
        setTimeout(() => {
            setReveal(true);
        }, 100);
    }, 1000);
    return <div ref={parent} className="flex justify-center items-center">
        {reveal && <>
            <h1 className="text-5xl">Stand
                #{props?.mesa}</h1>
        </>
        }
    </div>
}
