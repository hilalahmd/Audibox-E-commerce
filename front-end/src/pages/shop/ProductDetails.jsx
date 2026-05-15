import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { FaStar, FaShieldAlt } from "react-icons/fa";
import { FiGlobe, FiHeart } from "react-icons/fi";
import { MdWorkspacePremium } from "react-icons/md";
import { FaCartShopping } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlistCart } from "../../context/WishlistCartContext";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { toast } from "react-toastify";
import { mirage } from "ldrs";

mirage.register();

const ProductDetails = () => {
  const { id } = useParams();
  const { products, loading } = useProducts();
  const product = products.find((item) => item.id === id);

  const { requireAuth } = useAuth();
  const { goCart } = useAppNavigation();
  const {
    cart,
    wishlist,
    handleAddToCart,
    handleAddToWishlist,
    handleRemoveFromWishlist,
  } = useWishlistCart();

  const isCart = cart?.some((item) => item.id === id);
  const isWishlisted = wishlist?.some((item) => item.id === id);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#fafafa]">
        <l-mirage size="80" speed="2.5" color="#18181b"></l-mirage>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white text-zinc-900 border-t border-zinc-200">
        <p className="text-xl tracking-widest uppercase text-zinc-400 font-black">Gear Not Found</p>
      </div>
    );
  }

  const toggleWishlist = async () => {
    requireAuth();
    if (isWishlisted) await handleRemoveFromWishlist(id);
    else {
      await handleAddToWishlist({ 
        id: product.id, 
        productName: product.productName, 
        type: product.type, 
        price: product.price, 
        img: product.image 
      });
    }
  };

  const toggleCart = async () => {
    requireAuth();
    if (product.stockCount <= 0) return toast.error("This product is out of stock");
    if (isCart) {
      toast.error("Already in your setup");
    } else {
      await handleAddToCart({ ...product, img: product.image });
      goCart();
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#fafafa] text-zinc-900 pb-24">
      {/* 🌟 HEADER OVERLAY */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-10 lg:pt-32">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* 🌟 LEFT: THE STAGE */}
          <div className="w-full lg:w-1/2 relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-zinc-200 to-transparent rounded-[4rem] opacity-30 blur-2xl pointer-events-none" />
            <div className="relative aspect-square lg:h-[650px] w-full bg-white rounded-[4rem] border border-zinc-200 shadow-sm overflow-hidden flex items-center justify-center p-12 transition-shadow duration-500 hover:shadow-xl">
              <img
                className="h-full w-full object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                src={product.image?.startsWith('http') ? product.image : `/${product.image}`}
                alt={product.productName}
              />
              
              {/* Status Badge */}
              <div className="absolute top-10 left-10 py-1.5 px-5 border border-emerald-200 rounded-full bg-emerald-50/80 backdrop-blur-md">
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-emerald-600">
                  {product.status}
                </p>
              </div>
            </div>
          </div>

          {/* 🌟 RIGHT: THE SPECS */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="mb-10">
              <h4 className="text-xs uppercase tracking-[0.5em] text-zinc-400 font-black mb-4">
                {product.brand} • {product.type}
              </h4>
              <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-[0.9] mb-6 text-zinc-900">
                {product.model}
              </h1>
              <div className="flex items-center gap-4 text-sm font-bold tracking-widest text-zinc-500">
                <div className="flex items-center gap-1.5 bg-zinc-100 px-3 py-1 rounded-lg border border-zinc-200">
                  <FaStar className="text-emerald-500" />
                  <span className="text-zinc-600">{product.rating}</span>
                </div>
                <span className="text-zinc-300">|</span>
                {product.stockCount > 0 ? (
                  <span className="text-emerald-600">IN STOCK: {product.stockCount}</span>
                ) : (
                  <span className="text-red-500 font-black">OUT OF STOCK</span>
                )}
              </div>
            </div>

            <p className="text-lg text-zinc-500 leading-relaxed max-w-xl mb-10 font-medium">
              {product.description}
            </p>

            <div className="mb-12">
              <p className="text-xs uppercase tracking-widest text-zinc-400 mb-2 font-black">Standard Investment</p>
              <p className="text-5xl font-black tracking-tighter italic text-zinc-900">₹{product.price.toLocaleString()}</p>
            </div>

            {/* 🌟 ACTION ROW */}
            <div className="flex gap-6 items-center mb-16">
              {product.stockCount <= 0 ? (
                <button
                  disabled
                  className="flex-1 flex items-center justify-center gap-4 py-5 bg-zinc-200 text-zinc-500 rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] cursor-not-allowed shadow-none"
                >
                  Out of Stock <FaCartShopping size={18} />
                </button>
              ) : (
                <button
                  onClick={toggleCart}
                  className="flex-1 flex items-center justify-center gap-4 py-5 bg-zinc-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-lg shadow-zinc-900/10"
                >
                  Add to Cart <FaCartShopping size={18} />
                </button>
              )}

              <button 
                onClick={toggleWishlist}
                className={`w-20 h-20 flex items-center justify-center border rounded-2xl transition-all shadow-sm ${
                  isWishlisted 
                    ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100" 
                    : "bg-white border-zinc-200 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <FiHeart size={28} className={isWishlisted ? "fill-current" : ""} />
              </button>
            </div>

            {/* 🌟 VALUE PROPS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-zinc-200">
              <div className="flex flex-col gap-3">
                <FiGlobe className="text-2xl text-zinc-400" />
                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase text-zinc-700">Logistics</p>
                  <p className="text-xs text-zinc-500 font-medium">Free All India Delivery</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <FaShieldAlt className="text-2xl text-zinc-400" />
                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase text-zinc-700">Protection</p>
                  <p className="text-xs text-zinc-500 font-medium">3 Years Official Cover</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <MdWorkspacePremium className="text-2xl text-zinc-400" />
                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase text-zinc-700">Assurance</p>
                  <p className="text-xs text-zinc-500 font-medium">100% Genuine Gear</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🌟 FOOTER */}
        <div className="mt-32">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;