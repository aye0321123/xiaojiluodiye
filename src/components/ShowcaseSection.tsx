"use client";

import { motion } from "framer-motion";

const projects = [
  {
    num: "001",
    title: "Nebula Vortex",
    cn: "星云漩涡",
    year: "2026",
    role: "Creative Tech",
    color: "#E8275C",
  },
  {
    num: "002",
    title: "Aurora Wave",
    cn: "极光波纹",
    year: "2026",
    role: "WebGL",
    color: "#7B61FF",
  },
  {
    num: "003",
    title: "Deep Space",
    cn: "深空穿越",
    year: "2026",
    role: "Interaction",
    color: "#00D9FF",
  },
];

export default function ShowcaseSection() {
  return (
    <section id="showcase" className="relative z-10 py-24 md:py-48 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-4 items-end mb-16 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="col-span-12 md:col-span-3"
          >
            <p className="label text-white/50 tag-line">03 / Selected Work</p>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="col-span-12 md:col-span-9 huge-text text-white text-5xl md:text-7xl lg:text-8xl"
          >
            Things we made,<br />
            <span className="italic font-light text-white/60">recently.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {projects.map((p, i) => (
            <motion.a
              key={p.num}
              href="#"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="group block"
            >
              <div
                className="relative aspect-[4/5] overflow-hidden mb-6 transition-transform duration-700 group-hover:scale-[1.02]"
                style={{ background: `linear-gradient(135deg, ${p.color}22, #000000)` }}
              >
                <div
                  className="absolute inset-0 mix-blend-screen opacity-60"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${p.color}66 0%, transparent 70%)`,
                  }}
                />
                <div className="absolute inset-0 flex items-end justify-between p-6">
                  <span className="label text-white">{p.num}</span>
                  <span className="label text-white">{p.year}</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-24 h-24 rounded-full opacity-70 group-hover:scale-150 transition-transform duration-700"
                    style={{ background: p.color, filter: "blur(40px)" }}
                  />
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white text-2xl md:text-3xl font-bold tracking-tight mb-2">
                    {p.title}
                  </h3>
                  <p className="label text-white/40">{p.cn} · {p.role}</p>
                </div>
                <span className="text-white/30 text-2xl group-hover:text-[#E8275C] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all">
                  ↗
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
