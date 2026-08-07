type AttendanceSummaryProps = {
    present: number;
    partial: number;
    absent: number;
    total: number;
};

export default function AttendanceSummary({
    present,
    partial,
    absent,
    total,
}: AttendanceSummaryProps) {

    return (

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <SummaryCard
                title="Present"
                value={present}
                color="text-green-600"
            />

            <SummaryCard
                title="Partial"
                value={partial}
                color="text-yellow-500"
            />

            <SummaryCard
                title="Absent"
                value={absent}
                color="text-red-600"
            />

            <SummaryCard
                title="Total Records"
                value={total}
                color="text-blue-600"
            />

        </div>

    );

}

type SummaryCardProps = {
    title: string;
    value: number;
    color: string;
};

function SummaryCard({
    title,
    value,
    color,
}: SummaryCardProps) {

    return (

        <div className="rounded-2xl bg-white p-6 shadow">

            <p className="text-sm text-gray-500">

                {title}

            </p>

            <h2 className={`mt-2 text-4xl font-bold ${color}`}>

                {value}

            </h2>

        </div>

    );

}