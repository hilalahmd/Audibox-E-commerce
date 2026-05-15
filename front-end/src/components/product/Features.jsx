import React from 'react'
import SubHead from '../ui/SubHead'
import FeatureCard from './FeatureCard'
import { MdOutlineShield } from "react-icons/md";
import { LuTruck } from "react-icons/lu";
import { MdOutlineWorkspacePremium } from "react-icons/md";

const Features = () => {
  return (
    <div className="w-full bg-white py-12">
      
      <div 
        id='features-sec' 
        className='relative overflow-hidden bg-zinc-50 text-zinc-900 py-20 lg:py-24 rounded-[3rem] lg:rounded-[4rem] border border-zinc-100 shadow-sm'
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-20 relative z-10">
          
          <div className="mb-12 lg:mb-20 text-center">
             <h2 className="text-3xl lg:text-4xl font-black tracking-tighter mb-4 text-zinc-900">
               Audibox Guarantee.
             </h2>
             <p className="text-zinc-500 font-medium tracking-wide">
               Trusted By Sound Lovers Worldwide.
             </p>
          </div>

          <div 
            id="features-grid" 
            className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
          >
            {/* FeatureCard internal styles will be updated by Tailwind propagation, or overridden if needed */}
            <FeatureCard 
              icon={<MdOutlineShield className="text-emerald-500" />} 
              feature="3 Year Warranty" 
              sub="Full Protection Coverage" 
            />

            <FeatureCard 
              icon={<LuTruck className="text-emerald-500" />} 
              feature="Free Shipping" 
              sub="For Every Order Across India" 
            />
            
            <FeatureCard 
              icon={<MdOutlineWorkspacePremium className="text-emerald-500" />} 
              feature="Premium Quality" 
              sub="Individually Certified Products" 
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features