import React from "react";
import { motion } from "framer-motion";
import Header from "../../components/layout/Header";
import HomeGrid from "../../components/product/HomeGrid";
import Bestsellers from "../../components/product/Bestsellers";
import Features from "../../components/product/Features";
import Footer from "../../components/layout/Footer";
import ProductGrid from "../../components/product/ProductGrid";
import TestimonialGrid from "../../components/product/TestimonialGrid";
import Tailer from "../../components/layout/Tailer";

// 🌟 Now the animation resets and replays EVERY TIME it enters the screen!
const fadeUpVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
};

const Home = () => {
  return (
    <div
      id="container"
      className="relative w-full bg-[#fafafa] text-zinc-900 selection:bg-zinc-200 selection:text-black overflow-hidden"
    >
      {/* 🌟 HEADER OVERLAY LAYER */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      {/* 🌟 HERO & HOMEGRID LAYER */}
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUpVariant}
        className="w-full max-w-7xl mx-auto pt-4 lg:pt-24 pb-12 relative z-10"
      >
        <HomeGrid />
      </motion.div>

      {/* 🌟 BESTSELLERS */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={fadeUpVariant}
        className="relative w-full py-12 lg:py-20 bg-white"
      >
        <div className="w-full max-w-7xl mx-auto">
          <Bestsellers />
        </div>
      </motion.section>

      {/* 🌟 PRODUCT GRID SECTION */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.1 }} variants={fadeUpVariant}
        className="w-full py-12 lg:py-24 bg-[#fafafa]"
      >
        <div className="w-full max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tighter mb-4 text-zinc-900">
              The Collection.
            </h2>
            <p className="text-zinc-500 font-medium tracking-wide">
              Engineering sound into an art form.
            </p>
          </div>
          <ProductGrid />
        </div>
      </motion.section>

      {/* 🌟 FEATURES */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={fadeUpVariant}
        className="bg-white py-16 lg:py-24 border-y border-zinc-100"
      >
        <div className="w-full max-w-7xl mx-auto">
          <Features />
        </div>
      </motion.section>

      {/* 🌟 TESTIMONIALS */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.3 }} variants={fadeUpVariant}
        className="py-16 lg:py-24 bg-[#fafafa]"
      >
        <div className="w-full max-w-7xl mx-auto">
          <TestimonialGrid />
        </div>
      </motion.section>

      {/* 🌟 FOOTER LAYER */}
      <Tailer />
      <Footer />
      
    </div>
  );
};

export default Home;