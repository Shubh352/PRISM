"use client";

import Link from "next/link";

export default function Sidebar() {
    return (
        <aside className="w-64 min-h-screen border-r bg-white p-6">

            <h2 className="mb-6 text-lg font-bold">
                Navigation
            </h2>

            <ul className="space-y-2">

                <li>
                    <Link
                        href="/dashboard"
                        className="block rounded-lg p-3 hover:bg-blue-50 hover:text-blue-600"
                    >
                        Dashboard
                    </Link>
                </li>

                <li>
                    <Link
                        href="/users"
                        className="block rounded-lg p-3 hover:bg-blue-50 hover:text-blue-600"
                    >
                        Users
                    </Link>
                </li>

                <li>
                    <Link
                        href="/attendance"
                        className="block rounded-lg p-3 hover:bg-blue-50 hover:text-blue-600"
                    >
                        Attendance
                    </Link>
                </li>

                <li>
                    <Link
                        href="/reports"
                        className="block rounded-lg p-3 hover:bg-blue-50 hover:text-blue-600"
                    >
                        Reports
                    </Link>
                </li>

            </ul>

        </aside>
    );
}