"use client";

import StatCard from "@/components/dashboard/StatCard";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Dashboard() {

    const [students, setStudents] = useState(0);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const response = await api.get("/users");
                setStudents(response.data.length);
            } catch (error) {
                console.error(error);
            }
        }

        fetchUsers();
    }, []);

    return (
        <>
            <h1 className="text-4xl font-bold">
                Welcome to PRISM Dashboard
            </h1>

            <p className="mt-4 text-gray-600">
                Smart Attendance Management System
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6">

                <StatCard
                    title="Students"
                    value={students}
                />

                <StatCard
                    title="Present"
                    value={97}
                />

                <StatCard
                    title="Absent"
                    value={31}
                />

                <StatCard
                    title="Reports"
                    value={12}
                />

            </div>
        </>
    );
}