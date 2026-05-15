import React from "react";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { IoBagHandleOutline } from "react-icons/io5";

const EmptyMessage = ({ messageType }) => {
  const { goProducts } = useAppNavigation();

  return (
    <div className="flex items-center justify-center bg-transparent z-40 py-10 w-full h-full">
      <div className="flex flex-col items-center text-center px-6 max-w-md">
        
        {/* Visual Cue */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="absolute w-32 h-32 bg-zinc-200/50 blur-[40px] rounded-full" />
          <IoBagHandleOutline size={80} className="text-zinc-300 relative z-10" />
        </div>

        {/* Content */}
        <h2 className="text-3xl font-black text-zinc-900 tracking-tighter mb-3 capitalize">
          {messageType} is Empty
        </h2>
        <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-10 tracking-wide">
          Your curated selection is waiting. <br /> Discover our latest audio engineering.
        </p>

        {/* Action Button */}
        <button
          onClick={goProducts}
          className="group relative flex items-center justify-center gap-3 bg-zinc-900 text-white px-10 py-5 rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] transition-all duration-500 hover:bg-zinc-800 hover:scale-105 active:scale-95 shadow-xl shadow-zinc-900/10"
        >
          Explore Collection
        </button>
      </div>
    </div>
  );
};

export default EmptyMessage;