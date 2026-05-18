"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const navLinks = [
  { num: "01", label: "Index", href: "#hero" },
  { num: "02", label: "About", href: "#features" },
  { num: "03", label: "Work", href: "#showcase" },
  { num: "04", label: "Contact", href: "#cta" },
];

export default function Navbar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setTime(`${hours}:${minutes}:${seconds}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 mix-blend-difference"
    >
      <div className="px-4 md:px-12 h-14 md:h-20 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2 md:gap-3">
          <span className="label text-white text-[10px] md:text-[11px]">XJS — AI</span>
          <span className="hidden md:inline label text-white/50">© 2026</span>
        </a>

        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group flex items-center gap-2 label text-white"
            >
              <span className="text-white/40">{link.num}</span>
              <span className="link-underline">{link.label}</span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <span className="hidden sm:block label text-white mono text-[10px] md:text-[11px]">{time}</span>
          <a href="#cta" className="label text-white link-underline text-[10px] md:text-[11px]">
            Get In Touch ↗
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
