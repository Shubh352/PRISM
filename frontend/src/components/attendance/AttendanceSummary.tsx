import StatCard from "@/components/shared/StatCard";

import {
    CheckCircle,
    AlertTriangle,
    XCircle,
    ClipboardList,
} from "lucide-react";

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

            <StatCard
                title="Present"
                value={present}
                color="text-green-600"
                icon={<CheckCircle size={28} />}
            />

            <StatCard
                title="Partial"
                value={partial}
                color="text-yellow-500"
                icon={<AlertTriangle size={28} />}
            />

            <StatCard
                title="Absent"
                value={absent}
                color="text-red-600"
                icon={<XCircle size={28} />}
            />

            <StatCard
                title="Total Records"
                value={total}
                color="text-blue-600"
                icon={<ClipboardList size={28} />}
            />
        </div>

    );

}

type SummaryCardProps = {
    title: string;
    value: number;
    color: string;
};

