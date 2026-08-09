"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";

type Department = {
    id: number;
    department_name: string;
};

type AcademicSession = {
    id: number;
    session_name: string;
};

type ScheduleSession = {
    id?: number;
    session_number: number;
    start_time: string;
    attendance_window_minutes: number;
};

type Schedule = {
    id: number;
    department_id: number;
    academic_session_id: number;
    semester: number;
    day_of_week: string;
    schedule_sessions: ScheduleSession[];
};

type ScheduleModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onScheduleSaved: () => void;
    schedule: Schedule | null;
};

const days = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
];

export default function ScheduleModal({
    isOpen,
    onClose,
    onScheduleSaved,
    schedule,
}: ScheduleModalProps) {

    const [departmentId, setDepartmentId] =
        useState<number | "">("");

    const [academicSessionId, setAcademicSessionId] =
        useState<number | "">("");

    const [semester, setSemester] =
        useState<number | "">("");

    const [dayOfWeek, setDayOfWeek] =
        useState("");

    const [session1Start, setSession1Start] =
        useState("");

    const [session1Window, setSession1Window] =
        useState(20);

    const [session2Start, setSession2Start] =
        useState("");

    const [session2Window, setSession2Window] =
        useState(20);

    const [departments, setDepartments] =
        useState<Department[]>([]);

    const [academicSessions, setAcademicSessions] =
        useState<AcademicSession[]>([]);

    const [loadingData, setLoadingData] =
        useState(false);

    const [saving, setSaving] =
        useState(false);


    useEffect(() => {

        if (!isOpen) return;

        loadFormData();

    }, [isOpen]);


    useEffect(() => {

        if (!schedule) {

            resetForm();

            return;
        }

        setDepartmentId(
            schedule.department_id
        );

        setAcademicSessionId(
            schedule.academic_session_id
        );

        setSemester(
            schedule.semester
        );

        setDayOfWeek(
            schedule.day_of_week
        );

        const session1 =
            schedule.schedule_sessions?.find(
                (session) =>
                    session.session_number === 1
            );

        const session2 =
            schedule.schedule_sessions?.find(
                (session) =>
                    session.session_number === 2
            );

        setSession1Start(
            session1?.start_time?.slice(0, 5) ?? ""
        );

        setSession1Window(
            session1?.attendance_window_minutes ?? 20
        );

        setSession2Start(
            session2?.start_time?.slice(0, 5) ?? ""
        );

        setSession2Window(
            session2?.attendance_window_minutes ?? 20
        );

    }, [schedule]);


    async function loadFormData() {

        setLoadingData(true);

        try {

            const [
                departmentsResponse,
                sessionsResponse,
            ] = await Promise.all([
                api.get("/departments"),
                api.get("/academic-sessions"),
            ]);

            setDepartments(
                departmentsResponse.data
            );

            setAcademicSessions(
                sessionsResponse.data
            );

        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to load schedule data."
            );

        } finally {

            setLoadingData(false);

        }

    }


    function resetForm() {

        setDepartmentId("");
        setAcademicSessionId("");
        setSemester("");
        setDayOfWeek("");

        setSession1Start("");
        setSession1Window(20);

        setSession2Start("");
        setSession2Window(20);

    }


    async function handleSave() {

        if (departmentId === "") {

            toast.error(
                "Please select a department."
            );

            return;
        }

        if (academicSessionId === "") {

            toast.error(
                "Please select an academic session."
            );

            return;
        }

        if (semester === "") {

            toast.error(
                "Please select a semester."
            );

            return;
        }

        if (!dayOfWeek) {

            toast.error(
                "Please select a day."
            );

            return;
        }

        if (!session1Start) {

            toast.error(
                "Session 1 start time is required."
            );

            return;
        }

        if (!session2Start) {

            toast.error(
                "Session 2 start time is required."
            );

            return;
        }


        setSaving(true);

        try {

            const payload = {

                department_id: departmentId,

                academic_session_id:
                    academicSessionId,

                semester,

                day_of_week: dayOfWeek,

                sessions: [
                    {
                        session_number: 1,

                        start_time:
                            `${session1Start}:00`,

                        attendance_window_minutes:
                            session1Window,
                    },
                    {
                        session_number: 2,

                        start_time:
                            `${session2Start}:00`,

                        attendance_window_minutes:
                            session2Window,
                    },
                ],

            };


            if (schedule) {

                await api.put(
                    `/schedules/${schedule.id}`,
                    payload
                );

                toast.success(
                    "Schedule updated successfully!"
                );

            } else {

                await api.post(
                    "/schedules",
                    payload
                );

                toast.success(
                    "Schedule created successfully!"
                );

            }


            onScheduleSaved();

            onClose();

            resetForm();

        } catch (error: any) {

            console.error(error);

            const message =
                error?.response?.data?.detail;

            toast.error(
                message ||
                "Failed to save schedule."
            );

        } finally {

            setSaving(false);

        }

    }


    if (!isOpen) return null;


    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-xl">

                <h2 className="mb-6 text-2xl font-bold">

                    {schedule
                        ? "Edit Schedule"
                        : "Add New Schedule"}

                </h2>


                <div className="space-y-5">


                    {/* Department */}

                    <select
                        className="w-full rounded-lg border p-3"
                        value={departmentId}
                        onChange={(e) =>
                            setDepartmentId(
                                e.target.value === ""
                                    ? ""
                                    : Number(e.target.value)
                            )
                        }
                        disabled={loadingData}
                    >

                        <option value="">
                            {loadingData
                                ? "Loading..."
                                : "Select Department"}
                        </option>

                        {departments.map(
                            (department) => (

                                <option
                                    key={department.id}
                                    value={department.id}
                                >
                                    {
                                        department.department_name
                                    }
                                </option>

                            )
                        )}

                    </select>


                    {/* Academic Session */}

                    <select
                        className="w-full rounded-lg border p-3"
                        value={academicSessionId}
                        onChange={(e) =>
                            setAcademicSessionId(
                                e.target.value === ""
                                    ? ""
                                    : Number(e.target.value)
                            )
                        }
                        disabled={loadingData}
                    >

                        <option value="">
                            Select Academic Session
                        </option>

                        {academicSessions.map(
                            (session) => (

                                <option
                                    key={session.id}
                                    value={session.id}
                                >
                                    {session.session_name}
                                </option>

                            )
                        )}

                    </select>


                    {/* Semester */}

                    <select
                        className="w-full rounded-lg border p-3"
                        value={semester}
                        onChange={(e) =>
                            setSemester(
                                e.target.value === ""
                                    ? ""
                                    : Number(e.target.value)
                            )
                        }
                    >

                        <option value="">
                            Select Semester
                        </option>

                        {[1, 2, 3, 4, 5, 6, 7, 8]
                            .map((value) => (

                                <option
                                    key={value}
                                    value={value}
                                >
                                    Semester {value}
                                </option>

                            ))}

                    </select>


                    {/* Day */}

                    <select
                        className="w-full rounded-lg border p-3"
                        value={dayOfWeek}
                        onChange={(e) =>
                            setDayOfWeek(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            Select Day
                        </option>

                        {days.map((day) => (

                            <option
                                key={day}
                                value={day}
                            >
                                {day}
                            </option>

                        ))}

                    </select>


                    {/* Session 1 */}

                    <div className="rounded-xl border p-5">

                        <h3 className="mb-4 text-lg font-semibold">
                            Session 1
                        </h3>

                        <div className="grid grid-cols-2 gap-4">

                            <div>

                                <label className="mb-2 block text-sm text-gray-600">
                                    Start Time
                                </label>

                                <input
                                    type="time"
                                    className="w-full rounded-lg border p-3"
                                    value={session1Start}
                                    onChange={(e) =>
                                        setSession1Start(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            <div>

                                <label className="mb-2 block text-sm text-gray-600">
                                    Attendance Window
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    className="w-full rounded-lg border p-3"
                                    value={session1Window}
                                    onChange={(e) =>
                                        setSession1Window(
                                            Number(e.target.value)
                                        )
                                    }
                                />

                            </div>

                        </div>

                    </div>


                    {/* Session 2 */}

                    <div className="rounded-xl border p-5">

                        <h3 className="mb-4 text-lg font-semibold">
                            Session 2
                        </h3>

                        <div className="grid grid-cols-2 gap-4">

                            <div>

                                <label className="mb-2 block text-sm text-gray-600">
                                    Start Time
                                </label>

                                <input
                                    type="time"
                                    className="w-full rounded-lg border p-3"
                                    value={session2Start}
                                    onChange={(e) =>
                                        setSession2Start(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            <div>

                                <label className="mb-2 block text-sm text-gray-600">
                                    Attendance Window
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    className="w-full rounded-lg border p-3"
                                    value={session2Window}
                                    onChange={(e) =>
                                        setSession2Window(
                                            Number(e.target.value)
                                        )
                                    }
                                />

                            </div>

                        </div>

                    </div>


                </div>


                <div className="mt-8 flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="rounded-lg border px-5 py-2"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-lg bg-purple-600 px-5 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
                    >
                        {saving
                            ? "Saving..."
                            : schedule
                                ? "Update"
                                : "Save"}
                    </button>

                </div>

            </div>

        </div>

    );
}