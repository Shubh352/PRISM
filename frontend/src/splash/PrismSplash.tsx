"use client";

/**
 * PrismSplash.tsx
 * ---------------------------------------------------------------------------
 * Cinematic opening splash screen for PRISM
 * (Professional Real-time Intelligent Student Monitoring)
 *
 * Self-contained. No external assets required beyond the fonts referenced
 * below (falls back to system fonts automatically if not loaded).
 *
 * Usage:
 *   import PrismSplash from "@/components/PrismSplash";
 *   <PrismSplash onComplete={() => router.push("/login")} />
 *
 * The component runs once, then calls `onComplete` (if provided) after the
 * full sequence has settled. It does not unmount itself — the parent decides
 * what to do once the sequence finishes (e.g. swap it for the login screen).
 * ---------------------------------------------------------------------------
 */

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

// -----------------------------------------------------------------------------
// Timeline constants (all values in seconds). Centralised so the beam, the
// prism, the spectrum and the wordmark can all be derived from one clock.
// -----------------------------------------------------------------------------
const T = {
  beamStart: 0.45,
  beamDuration: 1.05, // beam tip reaches the prism at beamStart + beamDuration
  prismFadeInDuration: 0.6,
  glowStart: 1.42, // ~impact moment
  glowDuration: 0.55,
  coreFlashStart: 1.42,
  spectrumStart: 1.55,
  spectrumStagger: 0.07,
  spectrumBandDuration: 0.9,
  opticsSettleStart: 3.4, // beam + prism + spectrum begin to relax/dim
  opticsSettleDuration: 0.9,
  wordmarkStart: 3.75,
  wordmarkDuration: 0.85,
  subtitleStart: 4.45,
  subtitleStagger: 0.14,
  ruleStart: 4.95,
  ruleDuration: 0.7,
  doneAt: 5.9,
  creditStart: 5.3,
  creditDuration: 0.9,
} as const;

// Contact points where the beam meets the prism's left face, and where the
// spectrum leaves the right face — derived from the prism geometry below so
// the optics line up exactly instead of by eyeballing pixel values.
//
// The prism is now drawn as a faceted 3D solid (front face + two roof facets
// receding to a back edge), viewBox 240 x 200. The FRONT triangle (the face
// the beam actually hits and refracts through) has vertices:
//   apex  A (112, 24)   bottom-left  B (34, 172)   bottom-right C (190, 172)
// At the front face's vertical midpoint (y=98) the left edge sits at
// viewBox-x 73 and the right edge at viewBox-x 151. Both are expressed below
// as an offset from the viewBox's own horizontal centre (120), then scaled
// to the on-screen render width, so the beam/spectrum always meet the glass
// exactly regardless of the 3D depth facets drawn around it.
const PRISM_VIEWBOX_W = 240;
const PRISM_VIEWBOX_H = 200;
const PRISM_RENDER_WIDTH = 220; // px, on-screen width of the prism SVG
const PRISM_RENDER_HEIGHT = Math.round((PRISM_RENDER_WIDTH * PRISM_VIEWBOX_H) / PRISM_VIEWBOX_W);
const PRISM_SCALE = PRISM_RENDER_WIDTH / PRISM_VIEWBOX_W;
const LEFT_CONTACT_X = Math.round((73 - PRISM_VIEWBOX_W / 2) * PRISM_SCALE); // px, relative to SVG centre
const RIGHT_CONTACT_X = Math.round((151 - PRISM_VIEWBOX_W / 2) * PRISM_SCALE); // px, relative to SVG centre
const STAGE_TOP = "41%"; // vertical anchor for beam / prism / spectrum

// VIBGYOR, in acronym order (top band = violet, bottom band = red), tuned to
// premium/desaturated tones rather than saturated "cartoon rainbow" hues.
// `spread` is the vertical separation (px) applied immediately at the base
// of the fan (not just via rotation) so all seven bands read as distinct
// beams from the moment they leave the prism, instead of overlapping near
// the origin and blending into a single muddy colour.
const SPECTRUM_BANDS = [
  { name: "Violet", color: "#8B6BF2", angle: -9, spread: -33 },
  { name: "Indigo", color: "#6E7BF2", angle: -6, spread: -22 },
  { name: "Blue", color: "#4E9BF2", angle: -3, spread: -11 },
  { name: "Green", color: "#3FD1A6", angle: 0, spread: 0 },
  { name: "Yellow", color: "#F2C463", angle: 3, spread: 11 },
  { name: "Orange", color: "#F2965B", angle: 6, spread: 22 },
  { name: "Red", color: "#F0705F", angle: 9, spread: 33 },
] as const;

interface PrismSplashProps {
  /** Called once the full cinematic sequence has settled. */
  onComplete?: () => void;
  /** Optional extra classes on the root element. */
  className?: string;
}

export default function PrismSplash({ onComplete, className = "" }: PrismSplashProps) {
  const prefersReducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    if (!onComplete) return;
    const ms = (prefersReducedMotion ? 0.6 : T.doneAt) * 1000;
    const id = setTimeout(onComplete, ms);
    return () => clearTimeout(id);
  }, [onComplete, prefersReducedMotion]);

  // When reduced motion is requested, skip straight to the resting state:
  // prism + wordmark visible, no beam sweep, no staggered spectrum reveal.
  const reduced = !!prefersReducedMotion;

  const beamVariants: Variants = useMemo(
    () => ({
      hidden: { scaleX: 0, opacity: 0 },
      show: {
        scaleX: 1,
        opacity: 1,
        transition: reduced
          ? { duration: 0.01 }
          : {
              opacity: { duration: 0.25, delay: T.beamStart },
              scaleX: { duration: T.beamDuration, delay: T.beamStart, ease: [0.16, 0.8, 0.2, 1] },
            },
      },
      settle: {
        opacity: reduced ? 0 : [1, 1, 0],
        transition: { duration: T.opticsSettleDuration, delay: T.opticsSettleStart, times: [0, 0.3, 1] },
      },
    }),
    [reduced]
  );

  const prismVariants: Variants = useMemo(
    () => ({
      hidden: { opacity: 0, scale: 0.94 },
      show: {
        opacity: 1,
        scale: 1,
        transition: reduced ? { duration: 0.01 } : { duration: T.prismFadeInDuration, delay: 0.15, ease: "easeOut" },
      },
    }),
    [reduced]
  );

  const glowVariants: Variants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      show: {
        opacity: reduced ? 0.55 : [0, 0.95, 0.55],
        transition: reduced
          ? { duration: 0.01 }
          : { duration: T.glowDuration, delay: T.glowStart, times: [0, 0.35, 1], ease: "easeOut" },
      },
      settle: {
        opacity: reduced ? 0.25 : [0.55, 0.55, 0.22],
        transition: { duration: T.opticsSettleDuration, delay: T.opticsSettleStart, times: [0, 0.3, 1] },
      },
    }),
    [reduced]
  );

  const coreFlashVariants: Variants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      show: {
        opacity: reduced ? 0 : [0, 1, 0],
        transition: reduced ? { duration: 0.01 } : { duration: 0.5, delay: T.coreFlashStart, times: [0, 0.25, 1] },
      },
    }),
    [reduced]
  );

  const spectrumWrapVariants: Variants = useMemo(
    () => ({
      hidden: {},
      show: {},
      settle: {
        opacity: reduced ? 0.35 : [1, 1, 0.35],
        transition: { duration: T.opticsSettleDuration, delay: T.opticsSettleStart, times: [0, 0.3, 1] },
      },
    }),
    [reduced]
  );

  const wordmarkVariants: Variants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 10, letterSpacing: "0.35em" },
      show: {
        opacity: 1,
        y: 0,
        letterSpacing: "0.28em",
        transition: reduced
          ? { duration: 0.01 }
          : { duration: T.wordmarkDuration, delay: T.wordmarkStart, ease: [0.16, 0.8, 0.2, 1] },
      },
    }),
    [reduced]
  );

  const subtitleVariants: Variants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 6 },
      show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: reduced
          ? { duration: 0.01 }
          : { duration: 0.6, delay: T.subtitleStart + i * T.subtitleStagger, ease: "easeOut" },
      }),
    }),
    [reduced]
  );

  const ruleVariants: Variants = useMemo(
    () => ({
      hidden: { scaleX: 0, opacity: 0 },
      show: {
        scaleX: 1,
        opacity: 1,
        transition: reduced ? { duration: 0.01 } : { duration: T.ruleDuration, delay: T.ruleStart, ease: "easeOut" },
      },
    }),
    [reduced]
  );

  if (!ready) return null;

  return (
    <div
      className={
        "relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#04060c] " +
        className
      }
      style={{
        fontFamily:
          "'Space Grotesk', 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ---------------------------------------------------------------- */}
      {/* Ambient background: deep navy vignette + faint radial atmosphere */}
      {/* ---------------------------------------------------------------- */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, #0b1330 0%, #060912 45%, #030408 100%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[41%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(130,170,255,0.16) 0%, rgba(130,170,255,0.05) 45%, transparent 75%)",
          filter: "blur(10px)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: reduced ? 0.5 : [0, 0.35, 0.5, 0.3] }}
        transition={{ duration: 4, delay: 0.3, times: [0, 0.35, 0.6, 1], ease: "easeInOut" }}
      />
      {/* faint scanline / grain texture for a "premium optics lab" feel */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff 0px, transparent 1px, transparent 3px)",
        }}
      />

      {/* ---------------------------------------------------------------- */}
      {/* Optics stage: beam / prism / spectrum share the same vertical    */}
      {/* anchor (STAGE_TOP) and horizontal centre so contact points align */}
      {/* ---------------------------------------------------------------- */}

      {/* Beam ------------------------------------------------------------*/}
      <motion.div
        aria-hidden
        className="absolute origin-left"
        style={{
          top: STAGE_TOP,
          left: 0,
          width: `calc(50% + ${LEFT_CONTACT_X}px)`,
          height: 0,
          transform: "translateY(-50%)",
        }}
        variants={beamVariants}
        initial="hidden"
        animate={reduced ? "show" : ["show", "settle"]}
      >
        {/* soft bloom, wide and blurred, behind the core */}
        <div
          className="absolute right-0 top-1/2 h-10 w-full -translate-y-1/2"
          style={{
            background:
              "linear-gradient(90deg, rgba(140,180,255,0) 0%, rgba(140,180,255,0.35) 55%, rgba(210,230,255,0.55) 100%)",
            filter: "blur(10px)",
          }}
        />
        {/* sharp white core */}
        <div
          className="absolute right-0 top-1/2 h-[2.5px] w-full -translate-y-1/2"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.85) 40%, #ffffff 100%)",
            boxShadow: "0 0 8px 1px rgba(255,255,255,0.9), 0 0 24px 6px rgba(150,190,255,0.5)",
          }}
        />
      </motion.div>

      {/* Prism ------------------------------------------------------------*/}
      <div
        className="absolute left-1/2"
        style={{ top: STAGE_TOP, transform: "translate(-50%, -50%)" }}
      >
        {/* impact flash at the moment the beam lands on the left face */}
        <motion.div
          aria-hidden
          className="absolute rounded-full"
          style={{
            left: LEFT_CONTACT_X + PRISM_RENDER_WIDTH / 2,
            top: "50%",
            width: 26,
            height: 26,
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)",
            filter: "blur(1px)",
          }}
          variants={coreFlashVariants}
          initial="hidden"
          animate="show"
        />

        {/* glow halo behind the prism, pulses on impact */}
        <motion.div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[240px] w-[260px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(170,200,255,0.45) 0%, rgba(170,200,255,0.12) 45%, transparent 72%)",
            filter: "blur(6px)",
          }}
          variants={glowVariants}
          initial="hidden"
          animate={reduced ? "show" : ["show", "settle"]}
        />

        <motion.svg
          width={PRISM_RENDER_WIDTH}
          height={PRISM_RENDER_HEIGHT}
          viewBox={`0 0 ${PRISM_VIEWBOX_W} ${PRISM_VIEWBOX_H}`}
          variants={prismVariants}
          initial="hidden"
          animate="show"
          className="relative"
        >
          {/*
            A genuine faceted solid, not a flat triangle:
            - front face  A(112,24) B(34,172) C(190,172)  — what the beam hits
            - back edge   A'(138,8) B'(60,156) C'(216,156) — offset up-right,
              giving the sense of a triangular glass rod receding in depth
            - two "roof" quads (A,B,B',A') and (A,C,C',A') connect front to
              back, reading as the top-left (lit) and top-right (shadow)
              facets of the prism — this is what sells the 3D read.
          */}
          <defs>
            <linearGradient id="glassFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e7efff" stopOpacity="0.20" />
              <stop offset="45%" stopColor="#8fb2ff" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.04" />
            </linearGradient>
            <linearGradient id="edgeStroke" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#a9c6ff" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="roofLit" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f3f7ff" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#a9c6ff" stopOpacity="0.06" />
            </linearGradient>
            <linearGradient id="roofShadow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6f89d6" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#1a2550" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* right roof facet — shadow side, drawn first so front face sits above it */}
          <polygon
            points="112,24 190,172 216,156 138,8"
            fill="url(#roofShadow)"
            stroke="#7891d9"
            strokeOpacity="0.35"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* left roof facet — lit side */}
          <polygon
            points="112,24 34,172 60,156 138,8"
            fill="url(#roofLit)"
            stroke="#dbe6ff"
            strokeOpacity="0.5"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* front face — the main glass surface the beam refracts through */}
          <polygon
            points="112,24 34,172 190,172"
            fill="url(#glassFill)"
            stroke="url(#edgeStroke)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* top ridge — the ege where the two roof facets meet; the brightest line on the whole solid */}
          <line
            x1="112"
            y1="24"
            x2="138"
            y2="8"
            stroke="#ffffff"
            strokeOpacity="0.9"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          {/* subtle back-edge side ridges, hint at the receding depth without clutter */}
          <line x1="34" y1="172" x2="60" y2="156" stroke="#ffffff" strokeOpacity="0.22" strokeWidth="1" />
          <line x1="190" y1="172" x2="216" y2="156" stroke="#ffffff" strokeOpacity="0.16" strokeWidth="1" />
          {/* inner facet highlight on the front face, gives it a cut-glass feel without clutter */}
          <line x1="112" y1="24" x2="112" y2="172" stroke="#ffffff" strokeOpacity="0.12" strokeWidth="1" />
          <line x1="73" y1="98" x2="151" y2="98" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="1" />
        </motion.svg>
      </div>

      {/* Internal ray — the short bright segment that appears to pass      */}
      {/* through the glass from the left contact to the right contact.    */}
      <motion.div
        aria-hidden
        className="absolute origin-left"
        style={{
          top: STAGE_TOP,
          left: `calc(50% + ${LEFT_CONTACT_X}px)`,
          width: RIGHT_CONTACT_X - LEFT_CONTACT_X,
          height: 2,
          transform: "translateY(-50%)",
          background: "linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.4))",
          boxShadow: "0 0 10px 2px rgba(255,255,255,0.6)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: reduced ? 0 : [0, 0.9, 0] }}
        transition={{ duration: 0.5, delay: T.coreFlashStart, times: [0, 0.3, 1] }}
      />

      {/* Spectrum ----------------------------------------------------------*/}
      <motion.div
        aria-hidden
        className="absolute"
        style={{
          top: STAGE_TOP,
          left: `calc(50% + ${RIGHT_CONTACT_X}px)`,
          width: `calc(50% - ${RIGHT_CONTACT_X}px)`,
          height: 0,
        }}
        variants={spectrumWrapVariants}
        initial="hidden"
        animate={reduced ? "show" : ["show", "settle"]}
      >
        {SPECTRUM_BANDS.map((band, i) => (
          <motion.div
            key={band.name}
            className="absolute left-0 top-1/2"
            style={{
              width: "100%",
              height: 4,
              // `spread` separates the seven bands immediately at the base of
              // the fan (a fixed px offset), while `rotate` fans them further
              // apart along their length — together the bands stay visually
              // distinct all the way from the prism instead of overlapping
              // into a single blended line near the origin.
              y: band.spread,
              rotate: `${band.angle}deg`,
              transformOrigin: "left center",
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: 1,
              opacity: reduced ? 0.85 : 1,
            }}
            transition={
              reduced
                ? { duration: 0.01 }
                : {
                    scaleX: {
                      duration: T.spectrumBandDuration,
                      delay: T.spectrumStart + i * T.spectrumStagger,
                      ease: [0.16, 0.8, 0.2, 1],
                    },
                    opacity: {
                      duration: 0.4,
                      delay: T.spectrumStart + i * T.spectrumStagger,
                    },
                  }
            }
          >
            {/* blurred bloom layer — screen blend so overlapping hues add like real light instead of one hiding the rest */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, ${band.color} 0%, ${band.color}99 55%, transparent 100%)`,
                filter: "blur(5px)",
                mixBlendMode: "screen",
                opacity: 0.85,
              }}
            />
            {/* crisp core layer — kept on normal blend so each band reads as a clean, saturated line */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${band.color} 0%, ${band.color}cc 65%, transparent 100%)`,
                boxShadow: `0 0 5px 0.5px ${band.color}99`,
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* ---------------------------------------------------------------- */}
      {/* Branding                                                          */}
      {/* ---------------------------------------------------------------- */}
      <div className="absolute left-1/2 top-[68%] w-full -translate-x-1/2 -translate-y-1/2 px-6 text-center">
        <motion.h1
          variants={wordmarkVariants}
          initial="hidden"
          animate="show"
          className="select-none bg-gradient-to-b from-white to-[#9fbdf5] bg-clip-text text-[3.2rem] font-semibold uppercase text-transparent sm:text-[4rem]"
          style={{ letterSpacing: "0.28em", textShadow: "0 0 40px rgba(140,175,255,0.25)" }}
        >
          PRISM
        </motion.h1>

        <motion.div
          variants={ruleVariants}
          initial="hidden"
          animate="show"
          className="mx-auto mt-3 h-px w-40 origin-center bg-gradient-to-r from-transparent via-[#9fbdf5]/70 to-transparent"
        />

        <div className="mt-4 space-y-1">
          {["Professional Real-time", "Intelligent Student Monitoring"].map((line, i) => (
            <motion.p
              key={line}
              custom={i}
              variants={subtitleVariants}
              initial="hidden"
              animate="show"
              className="text-[0.7rem] font-medium uppercase text-[#9fb2d9] sm:text-xs"
              style={{ letterSpacing: "0.32em" }}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Credit line — quiet, small, arrives last so it never competes    */}
      {/* with the wordmark for attention.                                 */}
      {/* ---------------------------------------------------------------- */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: reduced ? 0.55 : 0.55 }}
        transition={
          reduced ? { duration: 0.01 } : { duration: T.creditDuration, delay: T.creditStart, ease: "easeOut" }
        }
        className="absolute bottom-6 left-1/2 -translate-x-1/2 select-none text-[0.65rem] font-normal text-[#8a97b8]"
        style={{ letterSpacing: "0.04em" }}
      >
        Made with ❤️ by Shubham Swami
      </motion.p>
    </div>
  );
}
