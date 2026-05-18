"use client";

import { motion } from "framer-motion";

const marqueeText = "Let's make something obsessed · 一起做点东西 · ";

export default function CTASection() {
  return (
    <section id="cta" className="relative z-10 overflow-hidden">
      <div className="border-t border-white/10 py-4 md:py-8 overflow-hidden whitespace-nowrap">
        <div className="marquee inline-block">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="huge-text text-white text-3xl md:text-8xl px-4 md:px-8 inline-block">
              {marqueeText}
            </span>
          ))}
        </div>
      </div>

      <div className="px-6 md:px-12 py-20 md:py-48">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-4 items-end mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="col-span-12 md:col-span-3"
            >
              <p className="label text-white/50 tag-line">04 / Contact</p>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="col-span-12 md:col-span-9 mega-text text-white text-[14vw] md:text-[10vw]"
            >
              <span className="text-white">Have an</span><br />
              <span className="text-[#E8275C] italic font-light">idea?</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-12 gap-4 mt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-span-12 md:col-span-5"
            >
              <p className="label text-white/40 mb-4">Reach Out</p>
              <a
                href="mailto:hello@xiaoji.ai"
                className="block link-underline text-white text-3xl md:text-5xl font-bold tracking-tight"
              >
                hello@xiaoji.ai
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="col-span-12 md:col-span-3 md:col-start-7"
            >
              <p className="label text-white/40 mb-4">Follow</p>
              <div className="space-y-2">
                <a href="#" className="block link-underline text-white text-xl md:text-2xl">
                  Twitter ↗
                </a>
                <a href="#" className="block link-underline text-white text-xl md:text-2xl">
                  GitHub ↗
                </a>
                <a href="#" className="block link-underline text-white text-xl md:text-2xl">
                  Bilibili ↗
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="col-span-12 md:col-span-2 md:col-start-11"
            >
              <p className="label text-white/40 mb-4">Press</p>
              <a href="#" className="block link-underline text-white text-xl md:text-2xl">
                press@xiaoji.ai
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
