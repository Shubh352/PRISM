"use client";

import { InputHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    icon?: ReactNode;
    rightElement?: ReactNode;
};

export default function Input({
    icon,
    rightElement,
    className,
    ...props
}: InputProps) {

    return (

        <div className="relative">

            {icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {icon}
                </div>
            )}

            <input
                {...props}
                className={clsx(

                    "w-full rounded-xl border border-slate-700 bg-slate-800 py-3 text-white outline-none transition",

                    "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30",

                    icon ? "pl-12" : "pl-4",

                    rightElement ? "pr-12" : "pr-4",

                    className

                )}
            />

            {rightElement && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {rightElement}
                </div>
            )}

        </div>

    );

}