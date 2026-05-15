import React from "react";
import { FaInstagram } from "react-icons/fa6";
import { PiXLogoBold } from "react-icons/pi";
import { FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white text-zinc-500 px-6 py-16 border-t border-zinc-200">
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* 🌟 BRAND */}
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-zinc-900 mb-4 cursor-pointer">
            Audibox<span className="text-emerald-500 font-serif">.</span>
          </h2>
          <p className="text-zinc-500 leading-relaxed text-sm font-medium">
            Experience audio the way it’s meant to be heard. Premium headphones,
            TWS, and speakers designed for absolute clarity.
          </p>
        </div>

        {/* 🌟 SHOP */}
        <div>
          <h3 className="text-zinc-900 font-bold text-lg mb-4 tracking-tight">
            Shop
          </h3>
          <ul className="space-y-3 text-sm font-medium">
            <li className="hover:text-emerald-500 transition cursor-pointer">Headphones</li>
            <li className="hover:text-emerald-500 transition cursor-pointer">TWS</li>
            <li className="hover:text-emerald-500 transition cursor-pointer">Speakers</li>
            <li className="hover:text-emerald-500 transition cursor-pointer">Bestsellers</li>
          </ul>
        </div>

        {/* 🌟 SUPPORT */}
        <div>
          <h3 className="text-zinc-900 font-bold text-lg mb-4 tracking-tight">
            Support
          </h3>
          <ul className="space-y-3 text-sm font-medium">
            <li className="hover:text-emerald-500 transition cursor-pointer">Order Tracking</li>
            <li className="hover:text-emerald-500 transition cursor-pointer">Warranty & Service</li>
            <li className="hover:text-emerald-500 transition cursor-pointer">Refund Policy</li>
            <li className="hover:text-emerald-500 transition cursor-pointer">Contact Us</li>
          </ul>
        </div>

        {/* 🌟 SOCIAL */}
        <div>
          <h3 className="text-zinc-900 font-bold text-lg mb-4 tracking-tight">
            Connect
          </h3>

          <div className="flex gap-4">
            <div className="p-3 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:border-zinc-300 hover:scale-105 transition cursor-pointer shadow-sm">
              <FaInstagram />
            </div>
            <div className="p-3 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:border-zinc-300 hover:scale-105 transition cursor-pointer shadow-sm">
              <PiXLogoBold />
            </div>
            <div className="p-3 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:border-zinc-300 hover:scale-105 transition cursor-pointer shadow-sm">
              <FaLinkedinIn />
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 BOTTOM */}
      <div className="max-w-7xl mx-auto border-t border-zinc-200 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-zinc-400 font-medium">
        
        <p className="mb-3 md:mb-0">
          © {year} Audibox. All rights reserved.
        </p>

        <div className="flex gap-6">
          <p className="hover:text-zinc-900 cursor-pointer transition">
            Privacy Policy
          </p>
          <p className="hover:text-zinc-900 cursor-pointer transition">
            Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;