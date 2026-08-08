"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentRole } from "@/lib/auth";

export default function Navbar() {
    const router = useRouter();

    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        setRole(getCurrentRole());
    }, []);

    function handleLogout() {
        localStorage.removeItem("prism_access_token");
        router.replace("/login");
    }

    return (
        <nav className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">

            <h1 className="text-xl font-bold">
                PROJECT PRISM
            </h1>

            <div className="flex items-center gap-4">

                {role && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                        {role}
                    </span>
                )}

                <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                    Logout
                </button>

            </div>

        </nav>
    );
}