import { LucideIcon } from "lucide-react";

type StatCardProps = {
    title: string;
    value: number;
    subtitle: string;
    icon: LucideIcon;
    color: string;
};

export default function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
}: StatCardProps) {

    return (

        <div className="rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-sm font-medium text-gray-500">
                        {title}
                    </h2>

                    <p className="mt-3 text-5xl font-bold text-gray-800">
                        {value}
                    </p>

                    <p className="mt-2 text-sm text-gray-400">
                        {subtitle}
                    </p>

                </div>

                <div
                    className={`rounded-xl p-4 ${color}`}
                >
                    <Icon
                        size={34}
                        className="text-white"
                    />
                </div>

            </div>

        </div>

    );
}