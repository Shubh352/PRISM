"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
    Inbox,
    AlertTriangle,
} from "lucide-react";
import { getCurrentRole } from "@/lib/auth";
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
    status: string;
    punch_in_time: string | null;
};


function getGreeting(hour: number) {
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
}

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
};

/**
 * A small, static echo of the splash screen's prism — same silhouette,
 * same glass gradient, at logo scale. This is the one deliberate "brand"
 * moment on the dashboard; everything else stays quiet around it.
 */
function PrismMark() {
    return (
        <svg width="30" height="28" viewBox="0 0 30 28" aria-hidden="true" className="shrink-0">
            <defs>
                <linearGradient id="prismMarkFill" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#7c6cf2" />
                </linearGradient>
            </defs>
            <polygon
                points="15,2 3,25 27,25"
                fill="url(#prismMarkFill)"
                fillOpacity="0.18"
                stroke="url(#prismMarkFill)"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/**
 * The thin VIBGYOR thread used under the dashboard heading — the same
 * seven-colour sequence the splash screen disperses the beam into,
 * shrunk down into a single quiet accent line instead of a full
 * animation. It draws in once on load, the way the splash's own
 * underline draws in after the wordmark settles.
 */
function SpectrumThread() {
    return (
        <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            style={{ transformOrigin: "left center" }}
            className="h-[3px] w-40 rounded-full"
            aria-hidden="true"
        >
            <div
                className="h-full w-full rounded-full"
                style={{
                    background:
                        "linear-gradient(90deg, #8B6BF2, #6E7BF2, #4E9BF2, #3FD1A6, #F2C463, #F2965B, #F0705F)",
                }}
            />
        </motion.div>
    );
}

export default function Dashboard() {

    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [summaryError, setSummaryError] = useState(false);

    const [recentAttendance, setRecentAttendance] = useState<RecentAttendance[] | null>(null);
    const [attendanceError, setAttendanceError] = useState(false);

    const [role, setRole] = useState<string | null>(null);

    // Computed client-side in an effect (not at render time) so the date
    // string can't cause a server/client hydration mismatch — the same
    // reason `role` below is set this way rather than read inline.
    const [today, setToday] = useState<string>("");
    const [greeting, setGreeting] = useState<string>("Welcome");

    useEffect(() => {
        setRole(getCurrentRole());

        const now = new Date();

        setGreeting(getGreeting(now.getHours()));

        setToday(
            now.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
            })
        );
    }, []);

    useEffect(() => {

        // Split into two independent requests so one endpoint failing
        // doesn't take the other one's data down with it.

        async function fetchSummary() {
            try {
                const response = await api.get("/dashboard/summary");
                setSummary(response.data);
            } catch (error) {
                console.error(error);
                setSummaryError(true);
            }
        }

        async function fetchAttendance() {
            try {
                const response = await api.get("/dashboard/recent-attendance");
                setRecentAttendance(response.data);
            } catch (error) {
                console.error(error);
                setAttendanceError(true);
            }
        }

        fetchSummary();
        fetchAttendance();

    }, []);

    const isAdmin = role === "Admin";

    return (
        // Dark navy backdrop — this is the "dark navy/blue overall application
        // background" the white cards are meant to float on. If your root
        // layout already paints this behind the page content, feel free to
        // drop this wrapper and move the gradient there instead; it's kept
        // self-contained here since layout.tsx wasn't part of this change.
        <div className="relative overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_120%_100%_at_50%_-10%,#132048_0%,#0a1330_45%,#070b1a_80%,#04060c_100%)] p-4 sm:p-6 lg:p-8">

            {/* faint ambient glow, echoes the splash screen's atmosphere —
                static aside from a very slow breathing opacity, never the
                focal point */}
            <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[620px] -translate-x-1/2 rounded-full"
                style={{
                    background: "radial-gradient(circle, rgba(110,150,255,0.16) 0%, rgba(110,150,255,0.04) 45%, transparent 75%)",
                    filter: "blur(20px)",
                }}
                initial={{ opacity: 0.25 }}
                animate={{ opacity: [0.25, 0.4, 0.25] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
                initial="hidden"
                animate="show"
                variants={{ show: { transition: { staggerChildren: 0.08 } } }}
                className="relative"
            >

                {/* ------------------------------------------------------ */}
                {/* Hero                                                    */}
                {/* ------------------------------------------------------ */}
                <motion.div
                    variants={fadeUp}
                    className="relative overflow-hidden rounded-xl border border-white/10 bg-white p-6 shadow-lg sm:p-8"
                >
                    {/* one-time light sweep across the hero on load — a small,
                        single-shot nod to the splash's beam, never repeats */}
                    <motion.div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12"
                        style={{
                            background: "linear-gradient(90deg, transparent, rgba(120,160,255,0.35), transparent)",
                            mixBlendMode: "multiply",
                        }}
                        initial={{ x: "-120%" }}
                        animate={{ x: "220%" }}
                        transition={{ duration: 1.1, delay: 0.35, ease: "easeInOut" }}
                    />

                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-violet-500" aria-hidden="true" />

                    <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                        {greeting}{role ? `, ${role}` : ""}
                    </p>

                    <div className="mt-2 flex items-center gap-3">
                        <PrismMark />
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            PRISM Dashboard
                        </h1>
                    </div>

                    <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
                        Professional Real-time Intelligent Smart Presence Management
                    </p>

                    <div className="mt-4">
                        <SpectrumThread />
                    </div>

                    <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
                        <CalendarDays size={16} aria-hidden="true" />
                        <span>{today || "Loading date…"}</span>
                    </div>
                </motion.div>

                {/* ------------------------------------------------------ */}
                {/* Stat cards — 1 col mobile, 2 col small screens, 4 col   */}
                {/* desktop. Each carries one meaningful colour: blue for  */}
                {/* students/info, green for present, red for absent,     */}
                {/* violet for devices — the same palette family the      */}
                {/* splash disperses the beam into.                       */}
                {/* ------------------------------------------------------ */}
                <motion.div
                    variants={{ show: { transition: { staggerChildren: 0.05 } } }}
                    className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
                >

                    <motion.div variants={fadeUp}>
                        <StatCard
                            title="Students"
                            value={summary?.total_students ?? 0}
                            subtitle="Total Registered"
                            icon={Users}
                            color="bg-blue-600"
                            accent="bg-blue-500"
                            isLoading={!summary && !summaryError}
                        />
                    </motion.div>

                    <motion.div variants={fadeUp}>
                        <StatCard
                            title="Present"
                            value={summary?.present_today ?? 0}
                            subtitle="Today's Attendance"
                            icon={UserCheck}
                            color="bg-emerald-600"
                            accent="bg-emerald-500"
                            isLoading={!summary && !summaryError}
                        />
                    </motion.div>

                    <motion.div variants={fadeUp}>
                        <StatCard
                            title="Absent"
                            value={summary?.absent_today ?? 0}
                            subtitle="Not Yet Marked"
                            icon={UserX}
                            color="bg-red-600"
                            accent="bg-red-500"
                            isLoading={!summary && !summaryError}
                        />
                    </motion.div>

                    <motion.div variants={fadeUp}>
                        <StatCard
                            title="Devices"
                            value={summary?.devices_online ?? 0}
                            subtitle="Currently Online"
                            icon={Monitor}
                            color="bg-violet-600"
                            accent="bg-violet-500"
                            isLoading={!summary && !summaryError}
                        />
                    </motion.div>

                </motion.div>

                {summaryError && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        <AlertTriangle size={16} className="shrink-0" aria-hidden="true" />
                        <span>Couldn&apos;t load dashboard summary. Figures above may be out of date.</span>
                    </div>
                )}

                {/* ------------------------------------------------------ */}
                {/* Main grid: attendance (primary content) + quick actions */}
                {/* ------------------------------------------------------ */}
                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

                    <motion.div
                        variants={fadeUp}
                        className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white shadow-lg lg:col-span-2"
                    >

                        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
                            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-500 to-emerald-500" aria-hidden="true" />
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Recent Attendance
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Latest attendance records received by PRISM
                                </p>
                            </div>
                        </div>

                        {attendanceError ? (

                            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                                <AlertTriangle size={32} className="text-amber-500" aria-hidden="true" />
                                <h3 className="mt-4 text-base font-semibold text-slate-800">
                                    Couldn&apos;t load attendance
                                </h3>
                                <p className="mt-1.5 max-w-sm text-sm text-slate-500">
                                    There was a problem reaching the attendance service. Refresh the page to try again.
                                </p>
                            </div>

                        ) : recentAttendance === null ? (

                            // Loading skeleton — distinct from the "no records" empty
                            // state below, so a slow API never reads as "nothing happened".
                            <div className="space-y-3 px-6 py-6" aria-busy="true" aria-label="Loading recent attendance">
                                {[0, 1, 2, 3].map((i) => (
                                    <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100" />
                                ))}
                            </div>

                        ) : recentAttendance.length === 0 ? (

                            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                                <Inbox size={32} className="text-slate-300" aria-hidden="true" />
                                <h3 className="mt-4 text-base font-semibold text-slate-800">
                                    No attendance yet
                                </h3>
                                <p className="mt-1.5 text-sm text-slate-500">
                                    Records will appear here as students check in.
                                </p>
                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <table className="w-full min-w-[640px]">

                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Student
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Roll Number
                                            </th>
                                            <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 lg:table-cell">
                                                Department
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Status
                                            </th>

                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                                Punch In
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">

                                        {recentAttendance.map((item, index) => {

                                            return (
                                                <motion.tr
                                                    key={`${item.roll_number}-${index}`}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ duration: 0.25, delay: Math.min(index, 8) * 0.03 }}
                                                    className="transition-colors hover:bg-slate-50"
                                                >
                                                    <td className="max-w-[220px] truncate px-6 py-4 text-sm font-medium text-slate-800" title={item.name}>
                                                        {item.name}
                                                    </td>

                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                        {item.roll_number}
                                                    </td>

                                                    <td
                                                        className="hidden max-w-[200px] truncate px-6 py-4 text-sm text-slate-500 lg:table-cell"
                                                        title={`${item.department} · Semester ${item.semester}`}
                                                    >
                                                        {item.department} · Sem {item.semester}
                                                    </td>

                                                    <td className="whitespace-nowrap px-6 py-4">
                                                        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                                                            {item.status}
                                                        </span>
                                                    </td>

                                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                                                        {item.punch_in_time
                                                            ? new Date(item.punch_in_time).toLocaleTimeString("en-IN", {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                hour12: true,
                                                            })
                                                            : "—"}
                                                    </td>
                                                </motion.tr>
                                            );
                                        })}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </motion.div>

                    {/* -------------------------------------------------- */}
                    {/* Quick actions — visually lighter than the table:   */}
                    {/* smaller padding, smaller icon chips, tinted fills  */}
                    {/* on hover instead of a shadow.                      */}
                    {/* -------------------------------------------------- */}
                    <motion.div variants={fadeUp} className="min-w-0 space-y-3">

                        <Link
                            href="/users"
                            className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm transition-colors hover:border-blue-300 hover:bg-blue-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="shrink-0 rounded-md bg-blue-50 p-2.5">
                                    <Users className="text-blue-600" size={20} aria-hidden="true" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="truncate text-sm font-semibold text-slate-800">
                                        {isAdmin ? "Manage Users" : "Users"}
                                    </h3>
                                    <p className="truncate text-xs text-slate-500">
                                        {isAdmin ? "Add, edit or remove users." : "View registered users."}
                                    </p>
                                </div>
                            </div>
                            <ArrowRight size={18} className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        </Link>

                        <Link
                            href="/attendance"
                            className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="shrink-0 rounded-md bg-emerald-50 p-2.5">
                                    <CalendarCheck className="text-emerald-600" size={20} aria-hidden="true" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="truncate text-sm font-semibold text-slate-800">
                                        Attendance
                                    </h3>
                                    <p className="truncate text-xs text-slate-500">
                                        View attendance records.
                                    </p>
                                </div>
                            </div>
                            <ArrowRight size={18} className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        </Link>

                        <Link
                            href="/devices"
                            className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm transition-colors hover:border-violet-300 hover:bg-violet-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="shrink-0 rounded-md bg-violet-50 p-2.5">
                                    <Monitor className="text-violet-600" size={20} aria-hidden="true" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="truncate text-sm font-semibold text-slate-800">
                                        Devices
                                    </h3>
                                    <p className="truncate text-xs text-slate-500">
                                        Monitor ESP32 devices.
                                    </p>
                                </div>
                            </div>
                            <ArrowRight size={18} className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        </Link>

                        <Link
                            href="/settings"
                            className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm transition-colors hover:border-orange-300 hover:bg-orange-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="shrink-0 rounded-md bg-orange-50 p-2.5">
                                    <Settings className="text-orange-600" size={20} aria-hidden="true" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="truncate text-sm font-semibold text-slate-800">
                                        Settings
                                    </h3>
                                    <p className="truncate text-xs text-slate-500">
                                        Configure PRISM.
                                    </p>
                                </div>
                            </div>
                            <ArrowRight size={18} className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        </Link>

                    </motion.div>

                </div>

            </motion.div>

        </div>
    );
}
