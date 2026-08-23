"use client";

import { motion } from "framer-motion";

import Image from "next/image";

import LoginForm from "./LoginForm";
import LoginFooter from "./LoginFooter";

export default function LoginCard() {
    return (
        <motion.div

            initial={{
                opacity: 0,
                x: 80,
                scale: 0.95,
            }}

            animate={{
                opacity: 1,
                x: 0,
                scale: 1,
            }}

            transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: 0.2,
            }} className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/80 p-8 shadow-[0_20px_80px_rgba(37,99,235,0.25)] backdrop-blur">

            {/* Logo */}

            <div className="flex flex-col items-center">

                <Image
                    src="/assets/prism-logo.svg"
                    alt="PRISM Logo"
                    width={80}
                    height={80}
                />

                <h1 className="mt-6 text-4xl font-bold tracking-wide text-white">
                    PRISM
                </h1>

                <p className="mt-2 text-center text-sm text-slate-400">
                    Administration Portal
                </p>

            </div>

            {/* Login Form */}

            <div className="mt-8">

                <LoginForm />

            </div>

            {/* Footer */}

            <div className="mt-8">

                <LoginFooter />

            </div>

        </motion.div>
    );
}