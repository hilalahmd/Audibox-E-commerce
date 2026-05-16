import React from "react";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { FiArrowRight } from "react-icons/fi";
import tailImg from "../../assets/tail.png";

const Tailer = () => {
  const { goProducts } = useAppNavigation();

  return (
    <div className="w-full bg-white py-16">
      
      <div 
        className="relative grid lg:grid-cols-5 grid-cols-1 bg-zinc-50 rounded-[3rem] lg:rounded-[4rem] min-h-[500px] overflow-hidden border border-zinc-200/60 shadow-sm"
      >
        {/* Background Ambient Depth */}
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-zinc-100/50 blur-[150px] rounded-full pointer-events-none" />

        {/* LEFT CONTENT */}
        <div
          id="left"
          className="relative z-10 flex flex-col justify-center gap-12 lg:col-span-3 items-start p-10 lg:p-24"
        >
          <div className="flex flex-col gap-4">
            <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-black">
              The Next Generation
            </p>
            <h1 className="text-zinc-900 text-5xl lg:text-7xl font-black tracking-tighter leading-[0.95]">
              UPGRADE YOUR <br /> 
              <span className="text-zinc-400 font-light italic">SENSES.</span>
            </h1>
            <p className="text-zinc-500 text-lg max-w-md mt-2 font-medium leading-relaxed">
              Experience sound engineering the way it was meant to be heard. 
              Pure, unfiltered, and absolute.
            </p>
          </div>

          <button
            onClick={goProducts}
            className="group flex items-center gap-4 bg-zinc-900 text-white px-10 py-5 rounded-full font-bold text-[12px] uppercase tracking-[0.25em] transition-all duration-500 hover:bg-zinc-800 hover:scale-105 active:scale-95 shadow-xl shadow-zinc-900/10"
          >
            Shop the Collection
            <FiArrowRight className="text-xl group-hover:translate-x-2 transition-transform duration-500" />
          </button>
        </div>

        {/* RIGHT IMAGE - Hero Focus */}
        <div 
          id="right" 
          className="relative lg:col-span-2 flex items-center justify-center p-8 lg:p-0"
        >
          <img
            className="w-full max-w-[500px] lg:max-w-none lg:w-[130%] h-auto object-contain -rotate-6 transition-transform duration-1000 hover:rotate-0 drop-shadow-2xl"
            src={tailImg}
            alt="Premium Audio"
          />
        </div>
      </div>
    </div>
  );
};

export default Tailer;