import { ReactNode } from "react";

type StatCardProps = {
    title: string;
    value: number | string;
    icon?: ReactNode;
    color?: string;
    subtitle?: string;
};

export default function StatCard({
    title,
    value,
    icon,
    color = "text-blue-600",
    subtitle,
}: StatCardProps) {

    return (

        <div className="rounded-2xl bg-white p-6 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm text-gray-500">
                        {title}
                    </p>

                    <h2 className={`mt-2 text-4xl font-bold ${color}`}>
                        {value}
                    </h2>

                    {subtitle && (
                        <p className="mt-2 text-sm text-gray-400">
                            {subtitle}
                        </p>
                    )}

                </div>

                {icon && (
                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                        {icon}
                    </div>
                )}

            </div>

        </div>

    );

}