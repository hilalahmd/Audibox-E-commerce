import React from "react";
import { HiMiniArrowLongRight } from "react-icons/hi2";
import Card from "../ui/Card"; // The internal dark mode of Card.jsx might need an update later!
import SubHead from "../ui/SubHead";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useProducts } from "../../context/ProductContext";

const Bestsellers = () => {
  const { goProducts } = useAppNavigation();
  const { bestsellers } = useProducts();

  return (
    <div id="bestseller-sec" className="py-24 relative overflow-hidden bg-white">
      {/* Background Depth: Subtle White Glow */}
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-zinc-50/50 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="flex flex-col md:flex-row w-full items-end justify-between gap-8 mb-16">
          <div className="flex-1">
            <h2 className="text-3xl lg:text-5xl font-black tracking-tighter mb-4 text-zinc-900">
              Bestsellers.
            </h2>
            <p className="text-zinc-500 font-medium tracking-wide">
              Our Most Loved Sounds.
            </p>
          </div>

          {/* Premium Metallic Button: Light Mode transition border */}
          <button 
            onClick={goProducts} 
            className="group flex items-center justify-center gap-4 min-w-[170px] px-8 py-4 rounded-full border border-zinc-200 bg-white text-zinc-900 font-bold text-[11px] uppercase tracking-[0.25em] hover:bg-zinc-50 hover:shadow-sm transition-all duration-300 shadow-sm active:scale-95"
          >
            Explore All
            <HiMiniArrowLongRight className="text-xl group-hover:translate-x-2 transition-transform duration-500" />
          </button>
        </div>

        {/* Product Grid */}
        <div 
          id="product-grid" 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
        >
          {bestsellers.map((product) => (
            <div 
              key={product.id} 
              className="relative transition-all duration-500 hover:-translate-y-2 hover:z-10"
            >
              <Card 
                id={product.id} 
                productName={product.productName} 
                type={product.type} 
                price={product.price} 
                img={product.image} 
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bestsellers;