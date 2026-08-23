import StatusBadge from "@/components/shared/StatusBadge";
import type { AttendanceRecord } from "@/types/attendance";

type AttendanceTableProps = {
    attendance: AttendanceRecord[];
    onView: (attendance: AttendanceRecord) => void;
};

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatTime(time: string | null) {
    if (!time) return "—";

    return new Date(time).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

export default function AttendanceTable({
    attendance,
    onView,
}: AttendanceTableProps) {
    return (
        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-slate-900 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">
                                Date
                            </th>

                            <th className="px-4 py-3 text-left text-sm font-semibold">
                                Roll No
                            </th>

                            <th className="px-4 py-3 text-left text-sm font-semibold">
                                Name
                            </th>

                            <th className="px-4 py-3 text-left text-sm font-semibold">
                                Department
                            </th>

                            <th className="px-4 py-3 text-left text-sm font-semibold">
                                Punch In
                            </th>

                            <th className="px-4 py-3 text-left text-sm font-semibold">
                                Status
                            </th>

                            <th className="px-4 py-3 text-left text-sm font-semibold">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {attendance.map((record) => (
                            <tr
                                key={record.id}
                                className="border-b border-slate-100 transition hover:bg-slate-50"
                            >
                                <td className="px-4 py-3 text-sm text-slate-600">
                                    {formatDate(record.attendance_date)}
                                </td>

                                <td className="px-4 py-3 text-sm font-medium text-slate-700">
                                    {record.roll_number}
                                </td>

                                <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                                    {record.name}
                                </td>

                                <td className="px-4 py-3 text-sm text-slate-600">
                                    {record.department}
                                </td>

                                <td className="px-4 py-3 text-sm font-medium text-slate-700">
                                    {formatTime(record.punch_in_time)}
                                </td>

                                <td className="px-4 py-3">
                                    <StatusBadge status={record.status} />
                                </td>

                                <td className="px-4 py-3">
                                    <button
                                        type="button"
                                        onClick={() => onView(record)}
                                        className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}