"use client";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10">
      <div className="px-6 md:px-12 py-8 md:py-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="huge-text text-white text-[22vw] md:text-[18vw] leading-none mb-8 md:mb-12 select-none">
            XJS·AI
          </div>

          <div className="grid grid-cols-12 gap-3 md:gap-4 items-end pt-6 md:pt-8 border-t border-white/10">
            <div className="col-span-12 md:col-span-3 mb-3 md:mb-0">
              <p className="label text-white/40 mb-1 md:mb-2 text-[10px] md:text-[11px]">© 2026</p>
              <p className="label text-white text-[10px] md:text-[11px]">XIAO JI AI Studio</p>
            </div>

            <div className="col-span-6 md:col-span-3">
              <p className="label text-white/40 mb-1 md:mb-2 text-[10px] md:text-[11px]">Built With</p>
              <p className="label text-white text-[10px] md:text-[11px]">Three.js · Next.js</p>
            </div>

            <div className="col-span-6 md:col-span-3">
              <p className="label text-white/40 mb-1 md:mb-2 text-[10px] md:text-[11px]">Location</p>
              <p className="label text-white text-[10px] md:text-[11px]">Chengdu, CN</p>
            </div>

            <div className="col-span-12 md:col-span-3 md:text-right mt-3 md:mt-0">
              <a href="#hero" className="label text-white link-underline text-[10px] md:text-[11px]">
                Back to Top ↑
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
