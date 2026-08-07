"use client";

import Modal from "@/components/shared/Modal";
import StatusBadge from "@/components/shared/StatusBadge";
import {
    User,
    Calendar,
    Clock,
} from "lucide-react";

import type { AttendanceRecord } from "@/types/attendance";

type Props = {

    isOpen: boolean;

    attendance: AttendanceRecord | null;

    onClose: () => void;

};

function formatDate(date: string) {

    return new Date(date).toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );

}

function formatTime(time: string | null) {

    if (!time) return "—";

    return new Date(time).toLocaleTimeString(
        "en-IN",
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        }
    );

}

export default function AttendanceDetailsModal({

    isOpen,

    attendance,

    onClose,

}: Props) {

    if (!attendance) return null;

    return (

        <Modal
            isOpen={isOpen}
            title="Attendance Details"
            onClose={onClose}
        >

            <div className="space-y-6">

                <div>

                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">

                        <User size={20} />

                        Student Information

                    </h3>

                    <div className="grid grid-cols-2 gap-5">

                        <Info
                            label="Name"
                            value={attendance.name}
                        />

                        <Info
                            label="Roll Number"
                            value={attendance.roll_number}
                        />

                        <Info
                            label="Department"
                            value={attendance.department}
                        />

                        <Info
                            label="Semester"
                            value={attendance.semester}
                        />

                    </div>

                </div>

                <hr />

                <div>

                    <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">

                        <Clock size={20} />

                        Attendance Timeline

                    </h3>

                    <div className="grid grid-cols-2 gap-5">

                        <Info
                            label="Date"
                            value={formatDate(attendance.attendance_date)}
                            icon={<Calendar size={16} />}
                        />

                        <Info
                            label="Morning Entry"
                            value={formatTime(attendance.entry_1_time)}
                        />

                        <Info
                            label="Afternoon Entry"
                            value={formatTime(attendance.entry_2_time)}
                        />

                        <Info
                            label="Punch Out"
                            value={formatTime(attendance.punch_out_time)}
                        />

                    </div>

                </div>

                <hr />

                <div>

                    <p className="mb-2 text-sm text-gray-500">

                        Overall Status

                    </p>

                    <StatusBadge status={attendance.status} />

                </div>

            </div>

        </Modal>

    );

}

function Info({

    label,

    value,

    icon,

}: {

    label: string;

    value: React.ReactNode;

    icon?: React.ReactNode;

}) {

    return (

        <div>

            <p className="mb-1 flex items-center gap-2 text-sm text-gray-500">

                {icon}

                {label}

            </p>

            <p className="font-semibold">

                {value}

            </p>

        </div>

    );

}