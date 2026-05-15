import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { useWishlistCart } from "../../context/WishlistCartContext";
import EmptyMessage from "../../components/ui/EmptyMessage";
import { mirage } from "ldrs";
import { useAppNavigation } from "../../hooks/useAppNavigation";

mirage.register();

const Cart = () => {
  const {
    cart,
    handleRemoveFromCart,
    handleUpdateQuantity,
    subTotal,
    total,
    loading,
    gst,
  } = useWishlistCart();

  const { goCheckout, goDetails } = useAppNavigation();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#fafafa]">
        <l-mirage size="80" speed="2.5" color="#18181b"></l-mirage>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#fafafa] text-zinc-900 pb-24 font-sans">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-10 lg:pt-32">
        {/* Page Title */}
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-400 mb-2">Review Inventory</p>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-zinc-900 uppercase">Your Cart</h1>
        </div>

        {cart.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="py-20">
            <EmptyMessage messageType={"Cart"} />
          </motion.div>
        ) : (
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10">
            
            {/* 🌟 Left: Product List */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <AnimatePresence>
                {cart.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="group relative flex flex-col md:flex-row items-center gap-6 p-6 bg-white border border-zinc-200/80 rounded-[2rem] hover:border-zinc-300 transition-colors shadow-sm hover:shadow-md"
                  >
                    {/* Product Image */}
                    <div className="relative h-32 w-full md:w-32 overflow-hidden rounded-[1.5rem] bg-zinc-50 border border-zinc-100 flex-shrink-0">
                      <img
                        className="h-full w-full object-contain cursor-pointer hover:scale-110 transition-transform duration-700 p-2"
                        src={product.img}
                        alt={product.productName}
                        onClick={() => goDetails(product.id)}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-grow space-y-1 text-center md:text-left h-full flex flex-col justify-center">
                      <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-black">
                        {product.type}
                      </p>
                      <h3 className="text-xl font-black tracking-tighter text-zinc-900 group-hover:text-zinc-600 transition-colors">
                        {product.productName}
                      </h3>
                      <p className="text-lg font-bold text-zinc-900 mt-2">
                        ₹{product.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-row md:flex-col items-center justify-between gap-6 w-full md:w-auto h-full px-2 md:px-6">
                      <div className="flex items-center bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                        <button
                          className="p-3 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 transition-colors"
                          onClick={() => handleUpdateQuantity(product.id, Math.max(1, product.quantity - 1))}
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-zinc-900">{product.quantity}</span>
                        <button
                          className="p-3 hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900 transition-colors"
                          onClick={() => {
                            if (product.stockCount === undefined || product.quantity < product.stockCount) {
                              handleUpdateQuantity(product.id, product.quantity + 1);
                            } else {
                              toast.error(`Only ${product.stockCount} left in stock!`);
                            }
                          }}
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between w-full md:w-auto md:justify-center gap-6 md:gap-4">
                        <p className="hidden md:block text-xs font-bold text-zinc-400">
                          ₹{(product.price * product.quantity).toLocaleString()}
                        </p>
                        <button 
                          onClick={() => handleRemoveFromCart(product.id)}
                          className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                          <MdDeleteOutline size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* 🌟 Right: Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 bg-white border border-zinc-200/80 rounded-[2.5rem] p-8 lg:p-10 shadow-lg overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-50 blur-[50px] rounded-full pointer-events-none" />
                
                <h3 className="text-2xl font-black tracking-tighter uppercase mb-8 pb-4 border-b border-zinc-100 text-zinc-900">
                  Order Summary
                </h3>

                <div className="space-y-5 mb-8">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-zinc-500">
                    <span>Subtotal</span>
                    <span className="text-zinc-900 font-bold">₹{subTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-zinc-500">
                    <span>Logistics</span>
                    <span className="text-emerald-500">FREE</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-zinc-500">
                    <span>GST (18%)</span>
                    <span className="text-zinc-900 font-bold">₹{gst.toFixed(0)}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100">
                  <div className="flex justify-between items-end mb-8">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Total Payable</p>
                    <p className="text-4xl lg:text-5xl font-black tracking-tighter text-zinc-900 leading-none">
                      ₹{total.toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={goCheckout}
                    className="w-full flex items-center justify-center gap-3 bg-zinc-900 text-white py-5 rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-xl shadow-zinc-900/10"
                  >
                    <FiShoppingBag size={18} />
                    Secure Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-32 pt-12 border-t border-zinc-200">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Cart;