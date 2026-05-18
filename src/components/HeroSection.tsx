"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const heroH = typeof window !== "undefined" ? window.innerHeight * 2.5 : 1500;
  const progress = Math.min(1, scrollY / heroH);
  const phase = progress < 0.2 ? "idle" : progress < 0.5 ? "approaching" : progress < 0.85 ? "formed" : "dissolving";
  const phaseLabel = {
    idle: "[ 00 / FLOATING ]",
    approaching: "[ 01 / APPROACHING ]",
    formed: "[ 02 / IDENTITY ]",
    dissolving: "[ 03 / DISSOLVING ]",
  }[phase];

  return (
    <section id="hero" className="relative z-10" style={{ height: "250vh" }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.4 }}
          className="absolute top-4 left-4 md:top-10 md:left-10 pointer-events-none"
        >
          <p className="label text-white/40 text-[10px] md:text-[11px]">[ INDEX 01 ]</p>
          <p className="label text-white mt-1 text-[10px] md:text-[11px]">XIAO JI · AI</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="absolute top-4 right-4 md:top-10 md:right-10 text-right pointer-events-none"
        >
          <p className="label text-white/40 text-[10px] md:text-[11px]">CHENGDU / CN</p>
          <p className="hidden md:block label text-white/40 mt-1">31.2304° N · 121.4737° E</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="absolute bottom-4 left-4 md:bottom-10 md:left-10 pointer-events-none max-w-[60vw] md:max-w-none"
        >
          <p className="label text-[#E8275C] mb-1 text-[10px] md:text-[11px]">{phaseLabel}</p>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-20 md:w-32 h-px bg-white/20 overflow-hidden">
              <div
                className="h-full bg-white origin-left"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>
            <span className="label text-white/60 mono text-[10px] md:text-[11px]">{Math.floor(progress * 100).toString().padStart(3, "0")}%</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: progress < 0.05 ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="absolute bottom-4 right-4 md:bottom-10 md:right-10 flex flex-col items-end gap-2 pointer-events-none"
        >
          <p className="label text-white/60 text-[10px] md:text-[11px]">SCROLL ↓</p>
          <div className="w-px h-8 md:h-12 bg-white/20 overflow-hidden">
            <div
              className="w-full h-1/2 bg-white"
              style={{
                animation: "scroll-pulse 2s cubic-bezier(0.65, 0, 0.35, 1) infinite",
              }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
