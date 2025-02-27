"use client"

import { useState } from "react";
import Buttons from "./buttons";
import Logos from "./logos";
import Title from "./title";

const HeaderTitle = () => {
    const [showIcon, setShowIcon] = useState(true);
    const logos = [
        {
            src: "/klc.png",
            alt: "KLC"
        },
        {
            src: "/consha.svg",
            alt: "Consha",
        }
    ]
    return <>
        <div className="bg-white rounded-lg p-5">
            {showIcon && <img src="/stella.png" alt="Stella" style={{
                width: "64px",
                height: "64px",

            }} />}
            <Title onReveal={
                () => {
                    setShowIcon(false);
                }
            } />
            <Logos logos={logos} />
            <Buttons />
        </div>
    </>
}
export default HeaderTitle;
