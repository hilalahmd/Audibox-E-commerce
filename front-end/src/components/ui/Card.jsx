import { FiHeart } from "react-icons/fi";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useWishlistCart } from "../../context/WishlistCartContext";
import { useAppNavigation } from "../../hooks/useAppNavigation";

const Card = ({ id, productName, type, price, img, stockCount }) => {
  const { goDetails } = useAppNavigation();
  const { requireAuth } = useAuth();
  const { wishlist, handleAddToWishlist, handleRemoveFromWishlist, cart, handleAddToCart } = useWishlistCart();

  const isWishlisted = wishlist.some((item) => item.id === id);
  const isCart = cart.some((item) => item.id === id);

  const toggleCart = async () => {
    requireAuth();
    if (stockCount <= 0) return toast.error("This product is out of stock");
    if (isCart) toast.info("Already in your collection");
    else {
      await handleAddToCart({ id, productName, type, price, img, stockCount });
    }
  };

  const toggleWishlist = async () => {
    requireAuth();
    if (isWishlisted) await handleRemoveFromWishlist(id);
    else {
      await handleAddToWishlist({ id, productName, type, price, img });
    }
  };

  return (
    <div className="group relative flex flex-col gap-6 rounded-[2.5rem] p-5 bg-white border border-zinc-200/80 shadow-sm transition-all duration-500 hover:border-zinc-300 hover:shadow-xl hover:-translate-y-2">
      
      {/* 🌟 IMAGE CONTAINER - Premium Light Studio Backing */}
      <div id="upper" className="w-full aspect-square bg-zinc-50/80 rounded-[2rem] overflow-hidden relative flex items-center justify-center border border-zinc-100 shadow-inner">
        <img
          className="w-4/5 h-4/5 object-contain cursor-pointer transition-transform duration-700 group-hover:scale-110 drop-shadow-xl"
          src={img}
          alt={productName}
          onClick={() => goDetails(id)}
        />
        
        {/* 🌟 WISHLIST BUTTON */}
        <button
          onClick={toggleWishlist}
          className="absolute right-4 top-4 rounded-full p-3 bg-white/50 backdrop-blur-md border border-zinc-200 text-zinc-500 transition-all hover:bg-white hover:text-red-500 hover:border-red-200 z-10 shadow-sm"
        >
          <FiHeart
            className={isWishlisted ? "fill-red-500 text-red-500" : ""}
            size={18}
          />
        </button>
      </div>

      {/* 🌟 INFO SECTION - Crisp Dark Typography */}
      <div id="lower" className="w-full flex flex-col gap-4 px-2 pb-2">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black">
            {type}
          </p>
          <p id="pname" className="text-xl font-black text-zinc-900 tracking-tighter truncate transition-colors">
            {productName}
          </p>
        </div>

        <div className="flex justify-between items-center mt-2">
          {/* Price */}
          <p className="text-2xl font-light text-zinc-900 tracking-tighter">
            ₹{price.toLocaleString()}
          </p>
          
          {/* 🌟 ACTION BUTTON */}
          {stockCount <= 0 ? (
            <button 
              disabled
              className="bg-zinc-200 text-zinc-500 px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest cursor-not-allowed"
            >
              Out of Stock
            </button>
          ) : (
            <button 
              onClick={toggleCart} 
              className="bg-zinc-900 text-white px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest transition-all duration-300 hover:bg-zinc-800 hover:scale-105 active:scale-95 shadow-md shadow-zinc-900/10"
            >
              {isCart ? "In Cart" : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;