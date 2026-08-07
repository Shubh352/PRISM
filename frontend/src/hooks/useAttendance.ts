"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { AttendanceRecord } from "@/types/attendance";

type Department = {
    id: number;
    department_name: string;
};

export default function useAttendance() {

    const [attendance, setAttendance] =
        useState<AttendanceRecord[]>([]);

    const [departments, setDepartments] =
        useState<Department[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        async function loadData() {

            try {

                const [attendanceResponse, departmentResponse] =
                    await Promise.all([

                        api.get("/attendance"),

                        api.get("/departments"),

                    ]);

                setAttendance(attendanceResponse.data);

                setDepartments(departmentResponse.data);

            }

            catch (error) {

                console.error(error);

            }

            finally {

                setLoading(false);

            }

        }

        loadData();

    }, []);

    return {

        attendance,

        departments,

        loading,

        refresh: () => window.location.reload(),

    };

}