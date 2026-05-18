"use client";

import { motion } from "framer-motion";

const features = [
  {
    num: "01",
    title: "Mouse Reactive",
    cn: "鼠标引力场",
    desc: "Particles respond to cursor in real time with elastic spring physics. Every interaction leaves a trace.",
  },
  {
    num: "02",
    title: "3D Spatial",
    cn: "三维空间",
    desc: "True volumetric particle system built on Three.js. Depth, perspective, and parallax rendered on GPU.",
  },
  {
    num: "03",
    title: "Scroll Driven",
    cn: "滚动驱动",
    desc: "Scroll position morphs particles between formations. The narrative is in your hands.",
  },
  {
    num: "04",
    title: "Shader Magic",
    cn: "着色器渲染",
    desc: "Custom GLSL vertex and fragment shaders. Additive blending, depth fade, point-sprite glow.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative z-10 py-24 md:py-48 px-6 md:px-12">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-4 items-end mb-16 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="col-span-12 md:col-span-3"
          >
            <p className="label text-white/50 tag-line">02 / Features</p>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="col-span-12 md:col-span-9 huge-text text-white text-5xl md:text-7xl lg:text-8xl"
          >
            Built for<br />
            <span className="text-[#E8275C]">obsessed</span> minds.
          </motion.h2>
        </div>

        <div className="border-t border-white/10">
          {features.map((f, i) => (
            <motion.div
              key={f.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              className="group grid grid-cols-12 gap-3 md:gap-4 py-6 md:py-14 border-b border-white/10 cursor-default transition-colors hover:bg-white/[0.02]"
            >
              <div className="col-span-2 md:col-span-1">
                <span className="label text-white/40 text-[10px] md:text-[11px]">{f.num}</span>
              </div>

              <div className="col-span-10 md:col-span-4">
                <h3 className="text-2xl md:text-5xl font-bold text-white tracking-tight leading-none">
                  {f.title}
                </h3>
                <p className="label text-white/40 mt-2 md:mt-3 text-[10px] md:text-[11px]">{f.cn}</p>
              </div>

              <div className="col-span-12 md:col-span-5 md:col-start-7 mt-3 md:mt-0">
                <p className="text-white/70 text-sm md:text-lg leading-relaxed max-w-md">
                  {f.desc}
                </p>
              </div>

              <div className="hidden md:flex col-span-1 col-start-12 items-center justify-end">
                <span className="text-white/30 text-3xl group-hover:text-[#E8275C] group-hover:translate-x-2 transition-all">
                  →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
