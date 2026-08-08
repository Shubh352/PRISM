import { HTMLAttributes } from "react";
import clsx from "clsx";

type CardProps = HTMLAttributes<HTMLDivElement>;

export default function Card({
    children,
    className,
    ...props
}: CardProps) {

    return (

        <div
            {...props}
            className={clsx(

                "rounded-3xl border border-slate-700/60 bg-slate-900/80 backdrop-blur shadow-[0_20px_80px_rgba(37,99,235,0.20)]",

                className

            )}
        >

            {children}

        </div>

    );

}