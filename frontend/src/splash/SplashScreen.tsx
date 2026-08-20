"use client";

import { useRouter } from "next/navigation";
import PrismSplash from "./PrismSplash";

export default function SplashScreen() {
    const router = useRouter();

    return (
        <PrismSplash
            onComplete={() => router.replace("/login")}
        />
    );
}