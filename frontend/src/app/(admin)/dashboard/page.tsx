"use client";

import { useEffect, useState } from "react";

import api from "@/lib/api";
import StatCard from "@/components/dashboard/StatCard";
import {
    Users,
    UserCheck,
    UserX,
    Monitor,
    CalendarDays,
    CalendarCheck,
    Settings,
    ArrowRight,
} from "lucide-react";

import Link from "next/link";

type DashboardSummary = {
    total_students: number;
    present_today: number;
    absent_today: number;
    devices_online: number;
};

type RecentAttendance = {
    name: string;
    roll_number: string;
    department: string;
    semester: number;
    event: string;
    time: string | null;
};

function getEventColor(event: string) {

    switch (event) {

        case "MORNING_ENTRY":
            return "bg-green-100 text-green-700";

        case "AFTERNOON_ENTRY":
            return "bg-blue-100 text-blue-700";

        case "PUNCH_OUT":
            return "bg-red-100 text-red-700";

        default:
            return "bg-gray-100 text-gray-700";
    }

}

export default function Dashboard() {

    const [summary, setSummary] =
        useState<DashboardSummary>({
            total_students: 0,
            present_today: 0,
            absent_today: 0,
            devices_online: 0,
        });

    const [recentAttendance, setRecentAttendance] =
        useState<RecentAttendance[]>([]);

    useEffect(() => {

        async function fetchDashboard() {

            try {

                const summaryResponse =
                    await api.get("/dashboard/summary");

                setSummary(summaryResponse.data);

                const attendanceResponse =
                    await api.get("/dashboard/recent-attendance");

                setRecentAttendance(
                    attendanceResponse.data
                );

            } catch (error) {

                console.error(error);

            }

        }

        fetchDashboard();

    }, []);

    const today = new Date().toLocaleDateString(
        "en-IN",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    );

    return (
        <>
            <div className="mb-10 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-white shadow-lg">

                <p className="text-lg opacity-90">
                    👋 Welcome Back, Admin
                </p>

                <h1 className="mt-2 text-5xl font-extrabold tracking-wide">
                    SOCSAT
                </h1>

                <p className="mt-3 text-lg opacity-90">
                    Food Processing & Nutrition Science
                    Attendance Management System
                </p>

                <div className="mt-6 flex items-center gap-2 text-sm opacity-80">

                    <CalendarDays size={18} />

                    <span>
                        {today}
                    </span>

                </div>

            </div>

            <div className="mt-10 grid grid-cols-2 gap-6">

                <StatCard
                    title="Students"
                    value={summary.total_students}
                    subtitle="Total Registered"
                    icon={Users}
                    color="bg-blue-600"
                />

                <StatCard
                    title="Present"
                    value={summary.present_today}
                    subtitle="Today's Attendance"
                    icon={UserCheck}
                    color="bg-green-600"
                />

                <StatCard
                    title="Absent"
                    value={summary.absent_today}
                    subtitle="Not Yet Marked"
                    icon={UserX}
                    color="bg-red-600"
                />

                <StatCard
                    title="Devices"
                    value={summary.devices_online}
                    subtitle="Currently Online"
                    icon={Monitor}
                    color="bg-purple-600"
                />

            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">

                <div className="lg:col-span-2 rounded-2xl bg-white shadow-lg">

                    <div className="flex items-center justify-between border-b px-6 py-5">

                        <div>

                            <h2 className="text-2xl font-bold text-gray-800">
                                Recent Attendance
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Latest attendance records received by PRISM
                            </p>

                        </div>

                    </div>

                    {recentAttendance.length === 0 ? (

                        <div className="flex flex-col items-center justify-center py-16">

                            <div className="text-6xl">
                                📭
                            </div>

                            <h3 className="mt-5 text-xl font-semibold">
                                No Attendance Yet
                            </h3>

                            <p className="mt-2 text-gray-500">
                                Attendance records will appear here.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="min-w-full">

                                <thead className="bg-gray-50">

                                    <tr>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                            Name
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                            Roll Number
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                            Event
                                        </th>

                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                            Time
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {recentAttendance.map((item, index) => (

                                        <tr
                                            key={index}
                                            className="border-t hover:bg-blue-50 transition"
                                        >

                                            <td className="px-6 py-4 font-medium">
                                                {item.name}
                                            </td>

                                            <td className="px-6 py-4">
                                                {item.roll_number}
                                            </td>

                                            <td className="px-6 py-4">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getEventColor(item.event)}`}
                                                >
                                                    {item.event.replace("_", " ")}
                                                </span>

                                            </td>

                                            <td className="px-6 py-4 text-gray-600">
                                                {item.time ?? "-"}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>
                <div className="space-y-4">

                    <Link
                        href="/users"
                        className="group block rounded-xl border border-gray-200 p-4 transition hover:border-blue-500 hover:bg-blue-50"
                    >
                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-4">

                                <div className="rounded-lg bg-blue-100 p-3">
                                    <Users className="text-blue-600" size={24} />
                                </div>

                                <div>

                                    <h3 className="font-semibold">
                                        Manage Users
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Add, edit or remove users.
                                    </p>

                                </div>

                            </div>

                            <ArrowRight
                                size={20}
                                className="text-gray-400 transition group-hover:translate-x-1"
                            />

                        </div>
                    </Link>

                    <Link
                        href="/attendance"
                        className="group block rounded-xl border border-gray-200 p-4 transition hover:border-green-500 hover:bg-green-50"
                    >
                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-4">

                                <div className="rounded-lg bg-green-100 p-3">
                                    <CalendarCheck className="text-green-600" size={24} />
                                </div>

                                <div>

                                    <h3 className="font-semibold">
                                        Attendance
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        View attendance records.
                                    </p>

                                </div>

                            </div>

                            <ArrowRight
                                size={20}
                                className="text-gray-400 transition group-hover:translate-x-1"
                            />

                        </div>
                    </Link>

                    <Link
                        href="/devices"
                        className="group block rounded-xl border border-gray-200 p-4 transition hover:border-purple-500 hover:bg-purple-50"
                    >
                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-4">

                                <div className="rounded-lg bg-purple-100 p-3">
                                    <Monitor className="text-purple-600" size={24} />
                                </div>

                                <div>

                                    <h3 className="font-semibold">
                                        Devices
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Monitor ESP32 devices.
                                    </p>

                                </div>

                            </div>

                            <ArrowRight
                                size={20}
                                className="text-gray-400 transition group-hover:translate-x-1"
                            />

                        </div>
                    </Link>

                    <Link
                        href="/settings"
                        className="group block rounded-xl border border-gray-200 p-4 transition hover:border-orange-500 hover:bg-orange-50"
                    >
                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-4">

                                <div className="rounded-lg bg-orange-100 p-3">
                                    <Settings className="text-orange-600" size={24} />
                                </div>

                                <div>

                                    <h3 className="font-semibold">
                                        Settings
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Configure PRISM.
                                    </p>

                                </div>

                            </div>

                            <ArrowRight
                                size={20}
                                className="text-gray-400 transition group-hover:translate-x-1"
                            />

                        </div>
                    </Link>

                </div>

            </div>

        </>
    );
}