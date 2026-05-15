import React from "react";

const SubHead = ({ head, sub, className = "" }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* SECTION HEADER - Bold Apple Light Mode */}
      <h1 className="text-4xl lg:text-5xl font-black text-zinc-900 tracking-tighter leading-none">
        {head}
      </h1>
      
      {/* SUB-HEADER - Muted Slate */}
      <div className="flex items-center gap-3 mt-1">
        {/* Decorative Divider */}
        <div className="w-8 h-[1px] bg-zinc-300 hidden md:block" />
        
        <p className="text-sm lg:text-base text-zinc-500 font-bold uppercase tracking-[0.2em]">
          {sub}
        </p>
      </div>
    </div>
  );
};

export default SubHead;