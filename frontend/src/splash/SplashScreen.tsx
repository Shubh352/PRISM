"use client";

import ParticleBackground from "./ParticleBackground";
import PrismLogo from "./PrismLogo";
import LightBeam from "./LightBeam";

export default function SplashScreen() {

    return (

        <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-slate-950">

            <ParticleBackground />

            <LightBeam />

            <div className="relative z-10">

                <PrismLogo />

            </div>

        </div>

    );

}