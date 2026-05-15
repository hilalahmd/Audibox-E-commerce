import React from "react";
import { motion } from "framer-motion";
import Header from "../../components/layout/Header";
import SubHead from "../../components/ui/SubHead";
import Footer from "../../components/layout/Footer";
import Card from "../../components/ui/Card";
import EmptyMessage from "../../components/ui/EmptyMessage";
import { useWishlistCart } from "../../context/WishlistCartContext";
import { useProducts } from "../../context/ProductContext";
import { mirage } from "ldrs";

// Registering the loader
mirage.register();

const Wishlist = () => {
  const { wishlist, loading } = useWishlistCart();
  const { products } = useProducts();

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#fafafa]">
        <l-mirage size="80" speed="2.5" color="#18181b"></l-mirage>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#fafafa] text-zinc-900 pb-24 font-sans">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-10 lg:pt-32">
        
        {/* Header Section */}
        <div className="w-full flex justify-between items-end mb-12 lg:mb-20">
          <div className="flex flex-col gap-2">
            <SubHead head="My Wishlist" sub="Your Curated Audio Collection" />
            <div className="w-24 h-[2px] bg-gradient-to-r from-zinc-300 to-transparent mt-2" />
          </div>
          
          <p className="text-zinc-400 text-[10px] font-black tracking-[0.3em] uppercase hidden md:block border border-zinc-200 px-4 py-2 rounded-full bg-white shadow-sm">
            Vault: {wishlist.length} {wishlist.length === 1 ? 'ITEM' : 'ITEMS'}
          </p>
        </div>

        {/* Empty State Logic */}
        {wishlist.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mt-20">
            <EmptyMessage messageType="Wishlist" />
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
          >
            {wishlist.map((item) => {
              const liveProduct = products.find(p => p.id === item.id);
              return (
                <div key={item.id}>
                  <Card
                    id={item.id}
                    productName={item.productName}
                    type={item.type}
                    price={item.price}
                    img={item.img || item.image}
                    stockCount={liveProduct?.stockCount || 0}
                  />
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Footer Integration */}
        <div className="mt-32 pt-16">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Wishlist;