"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();

    function handleLogout() {
        localStorage.removeItem("prism_access_token");
        router.replace("/login");
    }

    return (
        <nav className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-4">

            <h1 className="text-xl font-bold">
                PROJECT PRISM
            </h1>

            <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
                Logout
            </button>

        </nav>
    );
}