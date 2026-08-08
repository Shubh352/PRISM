"use client";

import { motion } from "framer-motion";

export default function LoginHero() {
    return (
        <motion.div
            initial={{
                opacity: 0,
                x: -80,
            }}
            animate={{
                opacity: 1,
                x: 0,
            }}
            transition={{
                duration: 0.8,
                ease: "easeOut",
            }}
            className="relative hidden overflow-hidden lg:flex flex-col justify-center px-20"
        >
            {/* Background Glow */}

            <div className="absolute -left-40 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-blue-600/10 blur-3xl" />

            <div className="relative z-10">

                <p className="text-blue-400 font-semibold tracking-[0.3em] uppercase">
                    Welcome to
                </p>

                <h1 className="mt-3 text-7xl font-black tracking-wide text-white">
                    PRISM
                </h1>

                <p className="mt-8 max-w-xl text-2xl leading-relaxed text-slate-300">
                    Professional Real-time Intelligent Smart Presence Management
                </p>

                <div className="mt-10 h-1 w-28 rounded-full bg-blue-500" />

                <div className="mt-10 space-y-3">

                    <h2 className="text-2xl font-semibold text-white">
                        Administration Portal
                    </h2>

                    <p className="max-w-lg text-slate-400">
                        School of Community Science and Technology
                    </p>

                    <p className="max-w-lg text-slate-400">
                        Indian Institute of Engineering Science and Technology,
                        Shibpur
                    </p>

                </div>

            </div>

        </motion.div>
    );
}