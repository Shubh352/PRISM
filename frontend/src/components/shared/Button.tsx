import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger";
};

export default function Button({
    variant = "primary",
    className,
    children,
    ...props
}: ButtonProps) {

    return (

        <button
            {...props}
            className={clsx(

                "w-full rounded-xl py-3 font-semibold transition-all duration-300",

                {
                    "bg-blue-600 text-white hover:bg-blue-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/30 active:scale-95":
                        variant === "primary",

                    "bg-slate-700 text-white hover:bg-slate-600":
                        variant === "secondary",

                    "bg-red-600 text-white hover:bg-red-500":
                        variant === "danger",
                },

                className

            )}
        >

            {children}

        </button>

    );

}