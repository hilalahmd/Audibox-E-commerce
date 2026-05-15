import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { IoSearch, IoCartOutline, IoBagOutline } from "react-icons/io5";
import { IoMdHeartEmpty, IoMdClose } from "react-icons/io";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaRegUser } from "react-icons/fa";
import { BsBoxSeam } from "react-icons/bs";
import { FiHeadphones } from "react-icons/fi";
import { MdLogout } from "react-icons/md";

import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useAuth } from "../../context/AuthContext";
import { useWishlistCart } from "../../context/WishlistCartContext";
import { useSearch } from "../../context/SearchContext";

const Header = () => {
  const { searchTerm, setSearchTerm } = useSearch();
  const { user, logOut } = useAuth();
  const { wishlist, cart } = useWishlistCart();

  const wishlistSize = wishlist.length;
  const cartSize = cart.length;

  const {
    goHome, goProducts, goCart, goWishlist, goUser, goOrders, goLogin,
  } = useAppNavigation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleUserClick = () => {
    if (!user) {
      goLogin();
    } else {
      setDropOpen(!dropOpen);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 w-full flex justify-center pointer-events-none">
      <div className="max-w-7xl w-full pointer-events-auto">

        {/* 🌟 DESKTOP HEADER */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex items-center justify-between px-6 py-3 rounded-[2rem] bg-white/70 backdrop-blur-2xl border border-zinc-200/50 shadow-sm"
        >
          {/* LOGO */}
          <h1 onClick={goHome} className="text-2xl font-black text-zinc-900 tracking-tighter cursor-pointer flex items-center">
            Audibox<span className="text-emerald-500 font-serif">.</span>
          </h1>

          {/* SEARCH */}
          <div className="flex items-center w-[400px] bg-zinc-100/80 border border-zinc-200 rounded-full px-4 py-1.5 focus-within:ring-2 focus-within:ring-zinc-300 transition-all">
            <IoSearch className="text-zinc-400 mr-2" />
            <input
              type="text"
              placeholder="Search pristine audio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-zinc-800 outline-none text-sm placeholder:text-zinc-400 font-medium"
            />
            <button
              onClick={goProducts}
              className="bg-zinc-900 text-white px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest hover:scale-105 transition-transform"
            >
              Go
            </button>
          </div>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-6 text-zinc-600">

            <IoBagOutline onClick={goProducts} className="w-[22px] h-[22px] cursor-pointer hover:text-zinc-900 transition" />

            {/* CART */}
            <div className="relative group cursor-pointer" onClick={goCart}>
              {cartSize > 0 && (
                <span className="absolute -top-1 -right-2 bg-emerald-500 text-white font-bold text-[9px] w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                  {cartSize}
                </span>
              )}
              <IoCartOutline className="w-[22px] h-[22px] group-hover:text-zinc-900 transition" />
            </div>

            {/* WISHLIST */}
            <div className="relative group cursor-pointer" onClick={goWishlist}>
              {wishlistSize > 0 && (
                <span className="absolute -top-1 -right-2 bg-emerald-500 text-white font-bold text-[9px] w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                  {wishlistSize}
                </span>
              )}
              <IoMdHeartEmpty className="w-[22px] h-[22px] group-hover:text-zinc-900 transition" />
            </div>

            {/* USER PROFILE */}
            <div className="relative">
              <div
                onClick={handleUserClick}
                className="flex items-center gap-3 px-1 py-1 pr-3 border border-transparent rounded-full hover:bg-zinc-100 cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-500 shadow-inner">
                  {user ? <span className="font-bold text-xs uppercase">{user.username[0]}</span> : <FaRegUser className="text-xs" />}
                </div>
                <span className="text-xs font-semibold text-zinc-700 tracking-wide">
                  {user ? user.username : "Login"}
                </span>
              </div>

              {/* DROPDOWN MENU */}
              <AnimatePresence>
                {dropOpen && user && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                        <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">Account</p>
                        <p className="text-sm font-bold text-zinc-900 truncate">{user.email || user.username}</p>
                    </div>
                    <ul className="text-sm font-medium text-zinc-600 p-2">
                      <li onClick={() => goUser(user.id || user._id)} className="px-4 py-3 hover:bg-zinc-100 hover:text-zinc-900 rounded-xl cursor-pointer flex items-center gap-3 transition-colors">
                        <FaRegUser className="text-zinc-400" /> My Profile
                      </li>
                      <li onClick={() => goOrders(user.id || user._id)} className="px-4 py-3 hover:bg-zinc-100 hover:text-zinc-900 rounded-xl cursor-pointer flex items-center gap-3 transition-colors">
                        <BsBoxSeam className="text-zinc-400" /> Purchase History
                      </li>
                      <li onClick={logOut} className="px-4 py-3 mt-1 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer flex items-center gap-3 transition-colors">
                        <MdLogout /> Secure Logout
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </motion.div>

        {/* 🌟 MOBILE HEADER */}
        <div className="lg:hidden bg-white/90 backdrop-blur-xl border border-zinc-200 shadow-sm rounded-3xl px-5 py-4 text-zinc-900">
          <div className="flex justify-between items-center">
            <h1 onClick={goHome} className="text-2xl font-black tracking-tighter">
              Audibox<span className="text-emerald-500">.</span>
            </h1>

            {menuOpen ? (
              <IoMdClose onClick={() => setMenuOpen(false)} className="text-2xl cursor-pointer text-zinc-500" />
            ) : (
              <RxHamburgerMenu onClick={() => setMenuOpen(true)} className="text-2xl cursor-pointer text-zinc-500" />
            )}
          </div>

          <AnimatePresence>
             {menuOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 border-t border-zinc-100 pt-6 flex flex-col gap-5 text-sm font-semibold tracking-wide text-zinc-600">
                  <button onClick={goProducts} className="text-left w-full hover:text-zinc-900">All Collections</button>
                  <button onClick={goWishlist} className="text-left w-full hover:text-zinc-900">Wishlist ({wishlistSize})</button>
                  <button onClick={goCart} className="text-left w-full hover:text-zinc-900">Cart ({cartSize})</button>
                  <button onClick={handleUserClick} className="text-left w-full text-emerald-600">
                    {user ? `Account: ${user.username}` : "Sign In / Register"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </nav>
  );
};

export default Header;