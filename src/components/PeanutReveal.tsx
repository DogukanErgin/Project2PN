"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { type SiteContent } from "@/src/content/site";
import { Container } from "@/src/components/ui/Container";

const shellPath =
  "M310 28 C266 25 229 50 213 90 C198 126 206 152 186 182 C160 223 172 283 224 307 C255 321 288 312 310 284 C332 312 365 321 396 307 C448 283 460 223 434 182 C414 152 422 126 407 90 C391 50 354 25 310 28 Z";

const wrinklePaths = [
  "M228 78 C214 111 220 144 206 176",
  "M244 74 C232 107 237 143 227 180",
  "M263 72 C254 108 256 146 250 184",
  "M284 72 C280 108 281 146 281 186",
  "M337 72 C341 108 340 146 339 186",
  "M357 74 C368 107 364 143 374 180",
  "M376 78 C390 111 384 144 398 176"
] as const;

const shellDots = [
  { cx: 238, cy: 134, r: 3.4 },
  { cx: 268, cy: 164, r: 2.8 },
  { cx: 288, cy: 98, r: 2.7 },
  { cx: 326, cy: 94, r: 2.8 },
  { cx: 352, cy: 168, r: 3 },
  { cx: 384, cy: 136, r: 3.1 },
  { cx: 304, cy: 218, r: 2.9 }
] as const;

type PeanutRevealProps = {
  content: SiteContent;
};

export function PeanutReveal({ content }: PeanutRevealProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 26, mass: 0.2 });
  const leftRotate = useTransform(smoothProgress, [0.12, 0.92], [0, -56]);
  const rightRotate = useTransform(smoothProgress, [0.12, 0.92], [0, 56]);
  const leftX = useTransform(smoothProgress, [0.12, 0.92], [0, -86]);
  const rightX = useTransform(smoothProgress, [0.12, 0.92], [0, 86]);
  const shellLift = useTransform(smoothProgress, [0.12, 0.92], [0, -8]);
  const glowOpacity = useTransform(smoothProgress, [0.18, 0.88], [0.1, 1]);
  const glowScale = useTransform(smoothProgress, [0.18, 0.88], [0.8, 1.24]);
  const kernelOpacity = useTransform(smoothProgress, [0.34, 0.84], [0, 1]);
  const kernelScale = useTransform(smoothProgress, [0.34, 0.84], [0.9, 1]);
  const textOpacity = useTransform(smoothProgress, [0.42, 0.92], [0, 1]);
  const textY = useTransform(smoothProgress, [0.42, 0.92], [24, 0]);

  return (
    <section ref={sectionRef} className="relative h-[120vh]" aria-label="Peanut shell reveal animation">
      <div className="sticky top-14 flex h-[calc(100vh-56px)] items-center">
        <Container className="relative">
          <div className="relative mx-auto flex max-w-4xl flex-col items-center justify-center py-10">
            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(239,171,100,0.95),rgba(196,123,61,0.34)_46%,rgba(17,14,11,0)_74%)] blur-[14px]"
              style={
                reducedMotion
                  ? { opacity: 1, scale: 1.14 }
                  : {
                      opacity: glowOpacity,
                      scale: glowScale
                    }
              }
            />

            <motion.svg
              viewBox="0 0 620 340"
              className="relative z-10 w-full max-w-[780px]"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="shellLeft" x1="180" y1="42" x2="330" y2="318" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#D8A470" />
                  <stop offset="0.4" stopColor="#BB7E4A" />
                  <stop offset="1" stopColor="#85522E" />
                </linearGradient>
                <linearGradient id="shellRight" x1="440" y1="44" x2="286" y2="314" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#D9A775" />
                  <stop offset="0.45" stopColor="#BE8351" />
                  <stop offset="1" stopColor="#8A5732" />
                </linearGradient>
                <radialGradient id="shellSoft" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(310 182) rotate(90) scale(132 106)">
                  <stop offset="0" stopColor="rgba(255,231,192,0.76)" />
                  <stop offset="1" stopColor="rgba(255,231,192,0)" />
                </radialGradient>
                <linearGradient id="kernelPaint" x1="270" y1="150" x2="358" y2="234" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#B53A2A" />
                  <stop offset="0.55" stopColor="#8F2118" />
                  <stop offset="1" stopColor="#72140E" />
                </linearGradient>
                <linearGradient id="kernelLight" x1="281" y1="154" x2="303" y2="210" gradientUnits="userSpaceOnUse">
                  <stop stopColor="rgba(255,214,182,0.7)" />
                  <stop offset="1" stopColor="rgba(255,214,182,0)" />
                </linearGradient>
                <clipPath id="leftShellClip">
                  <rect x="0" y="0" width="310" height="340" />
                </clipPath>
                <clipPath id="rightShellClip">
                  <rect x="310" y="0" width="310" height="340" />
                </clipPath>
              </defs>

              <motion.g
                style={
                  reducedMotion
                    ? { rotate: -56, x: -86, y: -8, transformOrigin: "310px 170px" }
                    : { rotate: leftRotate, x: leftX, y: shellLift, transformOrigin: "310px 170px" }
                }
              >
                <g clipPath="url(#leftShellClip)">
                  <path d={shellPath} fill="url(#shellLeft)" stroke="#D6A372" strokeWidth="3" />
                  <path d="M302 47 C286 96 282 140 292 188 C299 224 300 251 294 281" stroke="#7F4B28" strokeWidth="3.2" strokeLinecap="round" />
                  <ellipse cx="290" cy="178" rx="66" ry="94" fill="url(#shellSoft)" opacity="0.34" />
                  {wrinklePaths.map((d) => (
                    <path key={`left-${d}`} d={d} stroke="#7C4D2C" strokeWidth="2.2" strokeLinecap="round" opacity="0.52" />
                  ))}
                  {shellDots.map((dot) => (
                    <circle key={`left-dot-${dot.cx}-${dot.cy}`} cx={dot.cx} cy={dot.cy} r={dot.r} fill="#6E4324" opacity="0.32" />
                  ))}
                </g>
              </motion.g>

              <motion.g
                style={
                  reducedMotion
                    ? { rotate: 56, x: 86, y: -8, transformOrigin: "310px 170px" }
                    : { rotate: rightRotate, x: rightX, y: shellLift, transformOrigin: "310px 170px" }
                }
              >
                <g clipPath="url(#rightShellClip)">
                  <path d={shellPath} fill="url(#shellRight)" stroke="#D3A06D" strokeWidth="3" />
                  <path d="M318 47 C334 96 338 140 328 188 C321 224 320 251 326 281" stroke="#7F4B28" strokeWidth="3.2" strokeLinecap="round" />
                  <ellipse cx="330" cy="178" rx="66" ry="94" fill="url(#shellSoft)" opacity="0.32" />
                  {wrinklePaths.map((d) => (
                    <path key={`right-${d}`} d={d} stroke="#7B4C2B" strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
                  ))}
                  {shellDots.map((dot) => (
                    <circle key={`right-dot-${dot.cx}-${dot.cy}`} cx={dot.cx} cy={dot.cy} r={dot.r} fill="#6F4526" opacity="0.34" />
                  ))}
                </g>
              </motion.g>

              <motion.g
                style={
                  reducedMotion
                    ? { opacity: 1, scale: 1, transformOrigin: "310px 178px" }
                    : { opacity: kernelOpacity, scale: kernelScale, transformOrigin: "310px 178px" }
                }
              >
                <ellipse cx="283" cy="182" rx="28" ry="47" fill="url(#kernelPaint)" transform="rotate(-8 283 182)" />
                <ellipse cx="337" cy="182" rx="28" ry="47" fill="url(#kernelPaint)" transform="rotate(8 337 182)" />
                <ellipse cx="286" cy="178" rx="11" ry="33" fill="url(#kernelLight)" transform="rotate(-8 286 178)" />
                <ellipse cx="334" cy="178" rx="11" ry="33" fill="url(#kernelLight)" transform="rotate(8 334 178)" />
              </motion.g>
            </motion.svg>

            <motion.p
              className="mt-8 font-display text-2xl text-cream md:text-4xl"
              style={
                reducedMotion
                  ? { opacity: 1, y: 0 }
                  : {
                      opacity: textOpacity,
                      y: textY
                    }
              }
            >
              {content.peanutReveal.tagline}
            </motion.p>
          </div>
        </Container>
      </div>
    </section>
  );
}
