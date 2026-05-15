import React from 'react';

const FeatureCard = ({ icon, feature, sub }) => {
  return (
    <div className="group flex flex-col gap-6 items-center justify-center text-center p-10 bg-[#1c1c1e] border border-white/5 rounded-[3rem] shadow-2xl transition-all duration-500 hover:border-white/20 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
      
      {/* ICON CONTAINER - Metallic Glassmorphism */}
      <div className="relative w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent border border-white/10 shadow-inner group-hover:scale-110 transition-transform duration-500">
        {/* Subtle Ambient Pulse behind the icon */}
        <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Rendering the icon with a consistent premium size */}
        <div className="text-white text-4xl relative z-10">
          {icon}
        </div>
      </div>

      {/* TEXT CONTENT - White & Silver Hierarchy */}
      <div className="flex flex-col gap-2">
        <h3 className="text-white font-bold text-2xl tracking-tight leading-tight">
          {feature}
        </h3>
        <p className="text-sm text-gray-500 font-medium tracking-wide leading-relaxed max-w-[200px]">
          {sub}
        </p>
      </div>

    </div>
  );
};

export default FeatureCard;