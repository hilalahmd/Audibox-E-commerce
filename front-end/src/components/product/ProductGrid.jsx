import React from "react";
import { useSearch } from "../../context/SearchContext";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { FiArrowUpRight } from "react-icons/fi";
import boseImg from "../../assets/Products/Bose_H2_No.png";
import sonyImg from "../../assets/Products/x.png";

const ProductGrid = () => {
  const { setSearchTerm } = useSearch();
  const { goProducts } = useAppNavigation();

  const handleSearch = (type) => {
    setSearchTerm(type);
    goProducts();
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 pb-20">
      
      {/* 🌟 BOSE CARD - Premium Light Mode */}
      <div
        id="left"
        className="relative flex flex-col items-start h-[700px] bg-white rounded-[3rem] p-10 lg:p-16 border border-zinc-200/60 overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-500"
      >
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-100 blur-[120px] rounded-full pointer-events-none group-hover:bg-orange-200 transition-colors duration-700" />

        <div className="relative z-10 py-1.5 px-5 border border-orange-200 w-fit rounded-full bg-orange-50/50 backdrop-blur-md">
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-orange-600">Flash Sale</p>
        </div>

        <h1 className="relative z-10 text-5xl lg:text-7xl mt-12 font-black text-zinc-900 tracking-tighter leading-none">
          20% OFF <br /> 
          <span className="text-zinc-400 font-light italic">BOSE SERIES</span>
        </h1>
        
        <p className="relative z-10 mt-6 text-zinc-500 font-medium max-w-[320px] text-lg leading-relaxed">
          Level up your hearing experience with precision Bose engineering.
        </p>

        {/* Action Button */}
        <button
          onClick={() => handleSearch("bose")}
          className="relative z-20 mt-12 bg-zinc-900 text-white px-10 py-4 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all duration-300 flex items-center gap-2 group/btn shadow-lg"
        >
          Shop Now
          <FiArrowUpRight size={18} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </button>
        
        {/* IMAGE */}
        <img
          className="absolute -right-4 -bottom-10 h-[500px] lg:h-[550px] object-contain drop-shadow-2xl transition-all duration-1000 group-hover:scale-105 group-hover:-translate-y-2"
          src={boseImg}
          alt="bose"
        />
      </div>

      {/* 🌟 SONY CARD - Premium Light Mode */}
      <div
        id="right"
        className="relative flex flex-col items-start h-[700px] bg-zinc-50 rounded-[3rem] p-10 lg:p-16 border border-zinc-200/60 overflow-hidden group shadow-sm hover:shadow-xl transition-shadow duration-500"
      >
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-100 blur-[120px] rounded-full pointer-events-none group-hover:bg-cyan-200 transition-colors duration-700" />

        <div className="relative z-10 py-1.5 px-5 border border-cyan-200 w-fit rounded-full bg-cyan-50/50 backdrop-blur-md">
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-cyan-600">New Arrival</p>
        </div>

        <h1 className="relative z-10 text-5xl lg:text-7xl mt-12 font-black text-zinc-900 tracking-tighter leading-none">
          SONY PRO <br /> 
          <span className="text-zinc-400 font-light italic">ANC PURE</span>
        </h1>

        <p className="relative z-10 mt-6 text-zinc-500 font-medium max-w-[320px] text-lg leading-relaxed">
          Silence perfected. Industry leading noise cancellation at your fingertips.
        </p>

        <button
          onClick={() => handleSearch("sony")}
          className="relative z-20 mt-12 bg-zinc-900 text-white px-10 py-4 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all duration-300 flex items-center gap-2 group/btn shadow-lg"
        >
          Shop Now
          <FiArrowUpRight size={18} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </button>
        
        <img
          className="absolute -right-4 -bottom-10 h-[500px] lg:h-[550px] object-contain drop-shadow-2xl transition-all duration-1000 group-hover:scale-105 group-hover:-translate-y-2"
          src={sonyImg}
          alt="sony"
        />
      </div>
    </div>
  );
};

export default ProductGrid;