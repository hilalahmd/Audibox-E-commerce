import React from "react";
import { motion } from "framer-motion";
import { BiRightArrowAlt } from "react-icons/bi";
import { FaArrowRightLong } from "react-icons/fa6";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useSearch } from "../../context/SearchContext";

const HomeGrid = () => {
  const { goProducts } = useAppNavigation();
  const { setSearchTerm } = useSearch();

  const handleImgSearch = (e) => {
    const imgName = e.target.name;
    if (imgName) {
      setSearchTerm(imgName);
      goProducts();
    }
  };

  return (
    <div className="flex flex-col gap-8 px-4 py-4 w-full font-sans text-zinc-900">
      
      {/* 🌟 TOP: Hero & Featured Card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-auto lg:h-[600px]">

        {/* HERO SECTION - Pristine White Glass */}
        <div className="lg:col-span-3 bg-white rounded-[2.5rem] px-8 lg:px-16 py-16 flex items-center justify-between border border-zinc-200/60 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow duration-500">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-zinc-50 rounded-full blur-3xl pointer-events-none opacity-50 translate-x-1/3 -translate-y-1/3" />
          
          {/* LEFT: Content */}
          <div className="max-w-xl z-10 flex flex-col justify-center h-full">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex px-4 py-1.5 border border-zinc-200 rounded-full text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-8 font-bold bg-zinc-50 backdrop-blur-sm self-start"
            >
              Precision Engineering
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl lg:text-7xl font-black tracking-tighter leading-[1] mb-8 text-zinc-900"
            >
              SOUND <br /> <span className="text-zinc-400 font-light italic">REDEFINED.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-zinc-500 text-lg font-medium leading-relaxed max-w-sm mb-12"
            >
              Experience studio-quality audio enclosed in premium aerospace-grade aluminum.
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
              onClick={goProducts}
              className="bg-zinc-900 text-white w-max px-10 py-5 rounded-full flex items-center gap-3 font-bold text-[11px] uppercase tracking-widest hover:scale-105 hover:bg-zinc-800 transition-all duration-300 shadow-xl shadow-zinc-900/10"
            >
              Discover Collection
              <BiRightArrowAlt size={22} className="text-zinc-400" />
            </motion.button>
          </div>

          {/* IMAGE: Hero Product - Floating Effect via Framer */}
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="hidden lg:block z-10 pr-12 scale-110 translate-x-10"
          >
            <img
              src="/src/assets/cover3.png"
              alt="Beats Hero"
              className="w-[450px] object-contain drop-shadow-2xl"
            />
          </motion.div>
        </div>

        {/* FEATURE CARD - Minimalist Secondary Card */}
        <div className="relative bg-zinc-100 rounded-[2.5rem] overflow-hidden border border-zinc-200/50 group flex flex-col items-center justify-between shadow-sm hover:shadow-md transition-shadow">
          <div className="w-full p-8 pb-0 text-left self-start">
            <h2 className="text-2xl font-black tracking-tight text-zinc-900 mb-2">
              Studio <br/> Pro
            </h2>
            <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-black">
              Pure Bass
            </p>
          </div>

          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
            src="/src/assets/product1.png"
            alt="Feature Product"
            className="w-full h-auto max-h-[250px] object-contain drop-shadow-xl mt-4 mb-10"
          />

          <div className="absolute bottom-6 right-6 flex items-center justify-center">
            <button className="bg-white border border-zinc-200 text-zinc-900 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
              <FaArrowRightLong className="-rotate-45" />
            </button>
          </div>
        </div>
      </div>

      {/* 🌟 BOTTOM: Category Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ITEM: Category Card 1 */}
        <motion.div 
          whileHover={{ y: -8 }}
          className="bg-white rounded-[2rem] p-10 flex flex-col items-center border border-zinc-200/60 group relative overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={() => { setSearchTerm("headphone"); goProducts(); }}
        >
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400 mb-10 z-10">
            Headphones
          </h3>
          <img
            src="/src/assets/headphones.png"
            alt="Headphones"
            className="h-[220px] object-contain z-10 transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl"
          />
        </motion.div>

        {/* ITEM: Category Card 2 */}
        <motion.div 
          whileHover={{ y: -8 }}
          className="bg-white rounded-[2rem] p-10 flex flex-col items-center border border-zinc-200/60 group relative overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={() => { setSearchTerm("speaker"); goProducts(); }}
        >
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400 mb-10 z-10">
            Speakers
          </h3>
          <img
            src="/src/assets/speaker.png"
            alt="Speakers"
            className="h-[220px] object-contain z-10 transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl"
          />
        </motion.div>

        {/* ITEM: Category Card 3 */}
        <motion.div 
          whileHover={{ y: -8 }}
          className="bg-zinc-100 rounded-[2rem] p-10 flex flex-col items-center border border-zinc-200/60 group relative overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={() => { setSearchTerm("tws"); goProducts(); }}
        >
          <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500 mb-10 z-10">
            True Wireless
          </h3>
          <img
            src="/src/assets/tws.png"
            alt="TWS"
            className="h-[220px] object-contain z-10 transition-transform duration-700 group-hover:scale-110 drop-shadow-2xl"
          />
        </motion.div>

      </div>
    </div>
  );
};

export default HomeGrid;