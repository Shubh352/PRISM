type StatCardProps = {
    title: string;
    value: number;
};

export default function StatCard({
    title,
    value,
}: StatCardProps) {
    return (
        <div className="rounded-xl bg-white p-6 shadow">

            <h2 className="text-gray-500 text-sm">
                {title}
            </h2>

            <p className="mt-2 text-4xl font-bold">
                {value}
            </p>

        </div>
    );
}