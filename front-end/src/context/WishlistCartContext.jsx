import { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../services/wishlistService";
import {
  addToCart,
  getCartItems,
  removeFromCart,
  clearCart,
  updateCartQuantity
} from "../services/cartService";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const WishlistCartContext = createContext();

export const WishlistCartProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const userId = user?.id || user?._id;

  useEffect(() => {
    const fetchWishlistCartDatas = async () => {
      if (!userId) return;
      setLoading(true);

      const wishlist = await getWishlist(userId);
      setWishlist(wishlist);

      const cart = await getCartItems(userId);
      setCart(cart);

      setLoading(false); // ✅ inside async — runs after data is fetched
    };

    fetchWishlistCartDatas();
  }, [userId]);

  const handleAddToCart = async (product) => {
    if (!userId) return;
    if (product.stockCount !== undefined && product.stockCount <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    setLoading(true);
    await addToCart(product.id);
    setCart((prev) => [...prev, { ...product, quantity: 1 }]);

    playUIInteractionSound('add');

    setLoading(false);
    toast.dismiss();
    toast.success("Product added to cart");
    
  };

  const handleUpdateQuantity = async (productId, newQty) => {
    // Optimistic UI update
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item
      )
    );

    // Call backend API to persist the change
    await updateCartQuantity(productId, newQty);
  };


  const subTotal = useMemo(() => cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ), [cart]);

  const gst = useMemo(() => subTotal * 0.18, [subTotal]);
  const total = useMemo(() => (subTotal + gst).toFixed(2), [subTotal, gst]);

  const handleRemoveFromCart = async (productId) => {
    setLoading(true);
    await removeFromCart(productId);

    setCart((prev) => prev.filter((item) => item.id !== productId));

    playUIInteractionSound('remove');

    setLoading(false);
    toast.dismiss();
    toast.info("Product removed from the cart");
  };


  const handleClearCart = () => {
    clearCart();
    setCart([]);
    playUIInteractionSound('remove');
  }


  const playUIInteractionSound = (type = 'add') => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      const now = audioCtx.currentTime;
      osc.type = "sine";

      if (type === 'add') {
        // Soft, satisfying "Plop" (Premium, gentle interaction)
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.05);
      } else {
        // Deep, warm "Tong!"
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);
      }
        
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (err) {
      console.warn("Web Audio API not supported or blocked", err);
    }
  };

  // Add to wishlist
  const handleAddToWishlist = async (product) => {
    if (!userId) return;

    setLoading(true);
    await addToWishlist(userId, product);
    setWishlist((prev) => [...prev, product]);

    // Play "Ting!"
    playUIInteractionSound('add');

    setLoading(false);
    toast.dismiss();
    toast.success("Product added to wishlist");
  };

  // Remove from wishlist
  const handleRemoveFromWishlist = async (productId) => {
    if (!userId) return;

    setLoading(true);
    await removeFromWishlist(userId, productId);
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
    
    // Play "Tong!"
    playUIInteractionSound('remove');
    
    setLoading(false);
  };

  return (
    <WishlistCartContext.Provider
      value={{
        // state
        cart,
        handleAddToCart,
        handleRemoveFromCart,
        handleClearCart,
        wishlist,
        handleAddToWishlist,
        handleRemoveFromWishlist,
        handleUpdateQuantity,
        // derived totals
        subTotal,
        gst,
        loading,
        total,
      }}
    >
      {children}
    </WishlistCartContext.Provider>
  );
};

export const useWishlistCart = () => useContext(WishlistCartContext);
