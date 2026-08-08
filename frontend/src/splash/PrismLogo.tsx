"use client";

import { motion } from "framer-motion";

export default function PrismLogo() {

    return (

        <motion.img
            src="/assets/prism-logo.svg"
            alt="PRISM Logo"
            className="w-44"

            initial={{
                opacity: 0,
                scale: 0.7,
                rotate: -8,
            }}

            animate={{
                opacity: 1,
                scale: 1,
                rotate: 0,
            }}

            transition={{
                duration: 1,
                ease: "easeOut",
            }}
        />

    );

}