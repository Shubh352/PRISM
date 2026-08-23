"use client";

import { useState } from "react";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import AttendanceDetailsModal from "@/components/attendance/AttendanceDetailsModal";
import AttendanceSummary from "@/components/attendance/AttendanceSummary";
import useAttendance from "@/hooks/useAttendance";
import AttendanceFilters from "@/components/attendance/AttendanceFilters";
import type { AttendanceRecord } from "@/types/attendance";
import {
    PageHeader,
    Section,
} from "@/components/shared";

export default function AttendancePage() {



    const [search, setSearch] = useState("");
    const [semesterFilter, setSemesterFilter] = useState("");


    const [departmentFilter, setDepartmentFilter] = useState("");

    const [statusFilter, setStatusFilter] = useState("");

    const [dateFilter, setDateFilter] = useState("");

    const [selectedAttendance, setSelectedAttendance] =
        useState<AttendanceRecord | null>(null);

    const [isModalOpen, setIsModalOpen] =
        useState(false);

    const {
        attendance,
        departments,
        loading,
    } = useAttendance();

    const filteredAttendance = attendance.filter((record) => {

        const keyword = search.toLowerCase();

        const matchesSearch =
            record.name.toLowerCase().includes(keyword) ||
            record.roll_number.toLowerCase().includes(keyword);

        const matchesSemester =
            semesterFilter === "" ||
            record.semester.toString() === semesterFilter;

        const matchesDepartment =
            departmentFilter === "" ||
            record.department === departmentFilter;

        const matchesStatus =
            statusFilter === "" ||
            record.status === statusFilter;

        const matchesDate =
            dateFilter === "" ||
            record.attendance_date === dateFilter;

        return (
            matchesSearch &&
            matchesSemester &&
            matchesDepartment &&
            matchesStatus &&
            matchesDate
        );

    });

    const presentCount =
        filteredAttendance.filter(
            (record) => record.status === "Present"
        ).length;

    const absentCount =
        filteredAttendance.filter(
            (record) => record.status === "Absent"
        ).length;

    const totalCount =
        filteredAttendance.length;

    if (loading) {

        return (

            <div className="py-20 text-center">

                Loading attendance...

            </div>

        );

    }

    return (

        <>
            <PageHeader
                title="Attendance Management"
                subtitle="View and manage attendance records."
            />
            <AttendanceSummary
                present={presentCount}
                absent={absentCount}
                total={totalCount}
            />

            <AttendanceFilters
                search={search}
                setSearch={setSearch}

                dateFilter={dateFilter}
                setDateFilter={setDateFilter}

                semesterFilter={semesterFilter}
                setSemesterFilter={setSemesterFilter}

                departmentFilter={departmentFilter}
                setDepartmentFilter={setDepartmentFilter}

                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}

                departments={departments}

                onReset={() => {
                    setSearch("");
                    setDateFilter("");
                    setSemesterFilter("");
                    setDepartmentFilter("");
                    setStatusFilter("");
                }}
            />

            <Section className="mt-6">

                {attendance.length === 0 ? (

                    <div className="py-12 text-center">

                        <div className="text-6xl">
                            📭
                        </div>

                        <h2 className="mt-4 text-xl font-semibold">
                            No Attendance Records
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Attendance records will appear here
                            after students scan successfully.
                        </p>

                    </div>

                ) : (
                    <AttendanceTable
                        attendance={filteredAttendance}
                        onView={(record) => {
                            setSelectedAttendance(record);
                            setIsModalOpen(true);
                        }}
                    />
                )}

            </Section>

            <AttendanceDetailsModal
                isOpen={isModalOpen}
                attendance={selectedAttendance}
                onClose={() => setIsModalOpen(false)}
            />

        </>

    );

}