import React from "react";
import { Link } from "react-router-dom";
import { MdSignalWifiStatusbarConnectedNoInternet4 } from "react-icons/md";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const FourNotFour = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#fafafa] text-zinc-900 flex flex-col font-sans">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className="flex-grow flex items-center justify-center relative overflow-hidden px-6">
        {/* Aesthetic background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-200/50 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-2xl w-full text-center">
          {/* Visual Icon */}
          <div className="flex justify-center mb-8">
            <div className="p-8 bg-white border border-zinc-200 rounded-[2.5rem] shadow-sm">
              <MdSignalWifiStatusbarConnectedNoInternet4 className="text-6xl text-zinc-400 animate-pulse" />
            </div>
          </div>

          {/* Error Text */}
          <div className="space-y-4 relative">
            <h1 className="text-[120px] lg:text-[180px] font-black tracking-tighter leading-none italic opacity-[0.03] select-none text-zinc-900">
              404
            </h1>
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-2 w-full">
              <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase mb-4 text-zinc-900">
                Signal Lost
              </h2>
              <p className="max-w-md mx-auto text-zinc-500 text-sm lg:text-base uppercase tracking-[0.2em] leading-relaxed font-bold">
                The frequency you're looking for doesn't exist or has moved out of range.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-48 lg:mt-56">
            <Link
              to="/"
              className="inline-block px-12 py-5 bg-zinc-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-xl shadow-zinc-900/10"
            >
              Return to Base
            </Link>
          </div>
        </div>
      </div>

      <div className="w-11/12 mx-auto pt-8 border-t border-zinc-200">
        <Footer />
      </div>
    </div>
  );
};

export default FourNotFour;