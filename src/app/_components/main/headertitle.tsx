"use client"

import { useState } from "react";
import Buttons from "./buttons";
import Logos from "./logos";
import Title from "./title";
import { type Seller } from "@periface/app/_models/store";
import { useMainStore } from "@periface/app/_stores/main.store";
export type HeaderTitleProps = {
    sellers: Seller[];
    mesa: string;
};
const HeaderTitle = (props: HeaderTitleProps) => {
    const store = useMainStore();
    const [showIcon, setShowIcon] = useState(true);
    const logos = props.sellers.map((seller) => {
        return {
            src: seller.Logo,
            alt: seller.Nombre,
        }
    });
    return <>
        <div className="p-2">
            {showIcon && <img src="/stella.png" alt="Stella" style={{
                width: "64px",
                height: "64px",
            }} />}
            <div className="bg-white p-3 rounded-lg">
                <Title onReveal={
                    () => {
                        setShowIcon(false);
                    }
                } mesa={props.mesa} />
                <Logos className="w-1/5" useAppSheet={true} logos={logos} />
                <Buttons />
            </div>
        </div>
    </>
}
export default HeaderTitle;
