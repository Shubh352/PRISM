import StatCard from "@/components/dashboard/StatCard";
import {
    CheckCircle,
    XCircle,
    ClipboardList,
} from "lucide-react";

type AttendanceSummaryProps = {
    present: number;
    absent: number;
    total: number;
};

export default function AttendanceSummary({
    present,
    absent,
    total,
}: AttendanceSummaryProps) {
    return (
        <div className="mt-8 grid gap-6 md:grid-cols-3">
            <StatCard
                title="Present"
                value={present}
                subtitle="With punch-in recorded"
                color="bg-green-500"
                icon={CheckCircle}
            />

            <StatCard
                title="Absent"
                value={absent}
                subtitle="Without punch-in recorded"
                color="bg-red-500"
                icon={XCircle}
            />

            <StatCard
                title="Total"
                value={total}
                subtitle="Attendance records"
                color="bg-blue-500"
                icon={ClipboardList}
            />
        </div>
    );
}


