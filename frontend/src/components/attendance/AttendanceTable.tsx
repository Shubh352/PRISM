import StatusBadge from "@/components/shared/StatusBadge";
import type { AttendanceRecord } from "@/types/attendance";

type AttendanceTableProps = {
    attendance: AttendanceRecord[];
    onView: (attendance: AttendanceRecord) => void;
};

export default function AttendanceTable({
    attendance,
    onView,
}: AttendanceTableProps) {

    return (

        <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow">

            <table className="min-w-full">

                <thead className="bg-blue-600 text-white">

                    <tr>

                        <th className="px-4 py-3 text-left">Roll No</th>

                        <th className="px-4 py-3 text-left">Name</th>

                        <th className="px-4 py-3 text-left">Morning</th>

                        <th className="px-4 py-3 text-left">Afternoon</th>

                        <th className="px-4 py-3 text-left">Punch Out</th>

                        <th className="px-4 py-3 text-left">Status</th>

                        <th className="px-4 py-3 text-left">Action</th>

                    </tr>

                </thead>

                <tbody>

                    {attendance.map((record) => (

                        <tr
                            key={record.id}
                            className="border-b hover:bg-gray-50"
                        >

                            <td className="px-4 py-3">
                                {record.roll_number}
                            </td>

                            <td className="px-4 py-3">
                                {record.name}
                            </td>

                            <td className="px-4 py-3">
                                {record.morning_status}
                            </td>

                            <td className="px-4 py-3">
                                {record.afternoon_status}
                            </td>

                            <td className="px-4 py-3">
                                {record.punch_out_status}
                            </td>

                            <td className="px-4 py-3">
                                <StatusBadge
                                    status={record.status}
                                />
                            </td>

                            <td className="px-4 py-3">

                                <button
                                    onClick={() => onView(record)}
                                    className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                                >
                                    👁 View
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}