"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { isAdmin } from "@/lib/auth";
import {
    PageHeader,
    Section,
} from "@/components/shared";
import ScheduleModal from "@/components/schedules/ScheduleModal";

type ScheduleSession = {
    id: number;
    session_number: number;
    start_time: string;
    attendance_window_minutes: number;
};

type Schedule = {
    id: number;

    department_id: number;
    department_name: string;

    academic_session_id: number;
    academic_session_name: string;

    semester: number;
    day_of_week: string;

    schedule_sessions: ScheduleSession[];
};

export default function SchedulesPage() {

    const [schedules, setSchedules] =
        useState<Schedule[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [admin, setAdmin] =
        useState(false);

    const [showModal, setShowModal] = useState(false);

    const [selectedSchedule, setSelectedSchedule] =
        useState<Schedule | null>(null);


    useEffect(() => {

        setAdmin(isAdmin());

    }, []);


    useEffect(() => {

        fetchSchedules();

    }, []);


    async function fetchSchedules() {

        setLoading(true);

        try {

            const response =
                await api.get("/schedules");

            setSchedules(response.data);

        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to fetch schedules."
            );

        } finally {

            setLoading(false);

        }

    }

    async function handleDelete(schedule: Schedule) {

        const confirmed = window.confirm(
            `Delete the ${schedule.day_of_week} schedule?`
        );

        if (!confirmed) return;

        try {

            await api.delete(
                `/schedules/${schedule.id}`
            );

            toast.success(
                "Schedule deleted successfully!"
            );

            fetchSchedules();

        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to delete schedule."
            );

        }
    }


    function formatTime(time: string) {

        return new Date(
            `1970-01-01T${time}`
        ).toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            }
        );

    }


    if (loading) {

        return (

            <div className="py-20 text-center">

                Loading schedules...

            </div>

        );

    }


    return (

        <>

            <div className="mb-8 flex items-center justify-between">

                <PageHeader
                    title="Schedule Management"
                    subtitle="Manage attendance schedules and session windows."
                />

                {admin && (
                    <button
                        onClick={() => {
                            setSelectedSchedule(null);
                            setShowModal(true);
                        }}
                        className="rounded-lg bg-purple-600 px-5 py-3 font-semibold text-white transition hover:bg-purple-700"
                    >
                        + Add Schedule
                    </button>
                )}

            </div>


            <Section className="mt-6">


                {schedules.length === 0 ? (

                    <div className="py-12 text-center">

                        <div className="text-6xl">
                            📅
                        </div>

                        <h2 className="mt-4 text-xl font-semibold">
                            No Schedules Found
                        </h2>

                        <p className="mt-2 text-gray-500">
                            Attendance schedules will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto rounded-xl bg-white shadow">

                        <table className="min-w-full">

                            <thead className="bg-purple-600 text-white">

                                <tr>

                                    <th className="px-4 py-3 text-left">
                                        Day
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        Department
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        Semester
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        Academic Session
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        Session 1
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        Session 2
                                    </th>

                                    {admin && (
                                        <th className="px-4 py-3 text-left">
                                            Actions
                                        </th>
                                    )}

                                </tr>

                            </thead>


                            <tbody>

                                {schedules.map(
                                    (schedule) => (

                                        <tr
                                            key={schedule.id}
                                            className="border-b hover:bg-gray-50"
                                        >

                                            <td className="px-4 py-4 font-semibold">
                                                {schedule.day_of_week}
                                            </td>


                                            <td className="px-4 py-4">
                                                {schedule.department_name}
                                            </td>


                                            <td className="px-4 py-4">
                                                Semester {schedule.semester}
                                            </td>


                                            <td className="px-4 py-4">
                                                {schedule.academic_session_name}
                                            </td>


                                            {/* Session 1 */}

                                            <td className="px-4 py-4">

                                                {(() => {

                                                    const session =
                                                        schedule.schedule_sessions.find(
                                                            (item) =>
                                                                item.session_number === 1
                                                        );

                                                    if (!session) {
                                                        return "—";
                                                    }

                                                    return (
                                                        <div>

                                                            <div className="font-medium">
                                                                {formatTime(
                                                                    session.start_time
                                                                )}
                                                            </div>

                                                            <div className="text-sm text-gray-500">
                                                                Window:{" "}
                                                                {session.attendance_window_minutes}
                                                                {" min"}
                                                            </div>

                                                        </div>
                                                    );

                                                })()}

                                            </td>


                                            {/* Session 2 */}

                                            <td className="px-4 py-4">

                                                {(() => {

                                                    const session =
                                                        schedule.schedule_sessions.find(
                                                            (item) =>
                                                                item.session_number === 2
                                                        );

                                                    if (!session) {
                                                        return "—";
                                                    }

                                                    return (
                                                        <div>

                                                            <div className="font-medium">
                                                                {formatTime(
                                                                    session.start_time
                                                                )}
                                                            </div>

                                                            <div className="text-sm text-gray-500">
                                                                Window:{" "}
                                                                {session.attendance_window_minutes}
                                                                {" min"}
                                                            </div>

                                                        </div>
                                                    );

                                                })()}

                                            </td>


                                            {/* Actions */}

                                            {admin && (

                                                <td className="px-4 py-4">

                                                    <button
                                                        onClick={() => {
                                                            setSelectedSchedule(schedule);
                                                            setShowModal(true);
                                                        }}
                                                        className="rounded-lg bg-yellow-500 px-3 py-2 text-sm text-white hover:bg-yellow-600"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(schedule)
                                                        }
                                                        className="ml-2 rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>

                                                </td>

                                            )}

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </Section>

            <ScheduleModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setSelectedSchedule(null);
                }}
                onScheduleSaved={fetchSchedules}
                schedule={selectedSchedule}
            />

        </>

    );

}