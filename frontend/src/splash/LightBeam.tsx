"use client";

import { motion } from "framer-motion";

export default function LightBeam() {

    return (

        <motion.div

            initial={{
                x: "-120%",
                opacity: 0,
            }}

            animate={{
                x: "0%",
                opacity: 1,
            }}

            transition={{
                duration: 1.2,
                ease: "easeInOut",
            }}

            className="
                absolute
                left-0
                top-1/2
                h-[3px]
                w-1/2
                -translate-y-1/2
                bg-white
                shadow-[0_0_20px_white]
            "
        />

    );

}