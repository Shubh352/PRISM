"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("prism_access_token");

        if (!token) {
            router.replace("/login");
            return;
        }

        setChecking(false);
    }, [router]);

    if (checking) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950">
                <div className="text-sm text-slate-400">
                    Checking authentication...
                </div>
            </div>
        );
    }

    return <>{children}</>;
}