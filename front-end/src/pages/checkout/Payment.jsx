import React, { useState } from "react";
import { useWishlistCart } from "../../context/WishlistCartContext";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../context/OrdersContext";
import { IoShieldCheckmarkSharp, IoCashOutline, IoCardOutline } from "react-icons/io5";
import api from "../../services/api";

const Payment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD"); 
  
  const { total, cart } = useWishlistCart();
  const { goCheckout, goOrders, goHome } = useAppNavigation();
  const { createNewOrder } = useOrders();
  const { user } = useAuth();
  
  const userId = user?.id || user?._id;
  const storedData = JSON.parse(localStorage.getItem(`addressOf${userId}`));

  const handleCODPayment = async () => {
    setIsProcessing(true);
    
    const orderData = {
      id: "ORD-" + Date.now().toString().slice(-5),
      userId,
      items: cart,
      total: total,
      status: "Processing",
      paymentMethod: "Cash on Delivery",
      isPaid: false,
      date: new Date().toISOString(),
      address: storedData
    };

    try {
        await createNewOrder(orderData);
        window.location.href = "/checkout-success";
    } catch (err) {
        toast.error(err.response?.data?.message || "Failed to place COD order");
        console.error(err);
        setIsProcessing(false);
    }
  };

  const handleStripePayment = async () => {
    setIsProcessing(true);
    
    // Create the pending order locally first
    const orderId = "ORD-" + Date.now().toString().slice(-5);
    const orderData = {
      id: orderId,
      userId,
      items: cart,
      total: total,
      status: "Processing Payment",
      paymentMethod: "Stripe",
      isPaid: false, // We'll update this on checkout success
      date: new Date().toISOString(),
      address: storedData
    };

    try {
        await createNewOrder(orderData);
        // Call backend to create Stripe Session
        const response = await api.post('/stripe/create-checkout-session', {
            items: cart,
            orderId: orderId
        });
        
        // Redirect to Stripe Secure Hosted Checkout
        window.location.href = response.data.url;
    } catch (err) {
        toast.error(err.response?.data?.message || "Failed to initiate Stripe Checkout");
        console.error(err);
        setIsProcessing(false);
    }
  };

  const handleMasterSubmit = () => {
      if (paymentMethod === "COD") {
          handleCODPayment();
      } else {
          handleStripePayment();
      }
  }

  if (!storedData) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center px-4 py-12 text-center mt-20 font-sans">
        <h2 className="text-zinc-900 text-3xl font-black tracking-tighter mb-4">Shipping Destination Missing</h2>
        <p className="text-zinc-500 font-medium tracking-wide mb-8">Please complete your shipping details before securely checking out.</p>
        <button onClick={goCheckout} className="px-10 py-4 bg-zinc-900 text-white font-bold text-[11px] tracking-[0.2em] uppercase rounded-full shadow-lg hover:bg-zinc-800 transition-colors">Return to Logistics</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center px-4 py-12 font-sans overflow-hidden">
      
      {/* Decorative ambient background */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-emerald-50 blur-[150px] rounded-full pointer-events-none" />

      <div className="w-full max-w-xl bg-white border border-zinc-200/80 rounded-[3rem] p-10 lg:p-14 shadow-2xl shadow-zinc-200 relative overflow-hidden">
        
        <div className="relative z-10">
          <div className="flex flex-col items-center mb-10 text-center">
            <h1 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase">Payment Gate</h1>
            <h2 className="text-[10px] uppercase tracking-[0.5em] font-black text-zinc-400 mt-2">
              Secure Checkout Framework
            </h2>
          </div>

          <div className="mb-10 bg-zinc-50 border border-zinc-200/50 hover:border-zinc-300 transition-colors rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500">Destination Lock</p>
              <button onClick={goCheckout} className="text-[10px] uppercase font-black text-zinc-900 bg-white border border-zinc-200 px-3 py-1.5 rounded-full hover:bg-zinc-100 shadow-sm transition-colors">Edit</button>
            </div>
            <div className="text-sm text-zinc-600 space-y-1 font-semibold">
              <p className="text-zinc-900 font-black">{storedData.firstName} {storedData.lastName}</p>
              <p>{storedData.address}</p>
              <p className="text-zinc-500 text-xs mt-1">{storedData.city}, {storedData.state} {storedData.postalCode}</p>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500 mb-4 ml-2">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-4">
                
              <button 
                onClick={() => setPaymentMethod("COD")}
                className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all ${
                    paymentMethod === "COD" 
                    ? "bg-white border-zinc-900 text-zinc-900 shadow-md ring-1 ring-zinc-900" 
                    : "bg-zinc-50 border-zinc-200 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600"
                }`}
              >
                  <IoCashOutline size={26} className={paymentMethod === "COD" ? "text-emerald-600" : ""} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">Cash on<br/>Delivery</span>
              </button>

              <button 
                onClick={() => setPaymentMethod("Stripe")}
                className={`flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all ${
                    paymentMethod === "Stripe" 
                    ? "bg-white border-[#635BFF] text-zinc-900 shadow-lg shadow-[#635BFF]/10 ring-1 ring-[#635BFF]" 
                    : "bg-zinc-50 border-zinc-200 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600"
                }`}
              >
                  <IoCardOutline size={26} className={paymentMethod === "Stripe" ? "text-[#635BFF]" : ""} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">Secure<br/>Stripe</span>
              </button>

            </div>
          </div>

          <div className="pt-8 border-t border-zinc-200">
            <div className="flex justify-between items-center mb-10">
              <span className="text-[11px] uppercase tracking-[0.3em] font-black text-zinc-500">Grand Total</span>
              <span className="text-4xl lg:text-5xl font-black tracking-tighter text-zinc-900">₹{total.toLocaleString()}</span>
            </div>

            <div className="flex flex-col items-center gap-6">
              <button
                className={`w-full py-6 rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] transition-all relative overflow-hidden flex justify-center items-center gap-3 shadow-xl ${
                  isProcessing 
                    ? "bg-zinc-200 text-zinc-500 cursor-wait shadow-none" 
                    : paymentMethod === "COD" 
                        ? "bg-zinc-900 text-white hover:bg-zinc-800 shadow-zinc-900/10" 
                        : "bg-[#635BFF] text-white hover:bg-[#524ac4] shadow-[#635BFF]/20"
                }`}
                onClick={handleMasterSubmit}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>
                    <IoShieldCheckmarkSharp size={18} />
                    {paymentMethod === "COD" ? "Confirm Order (COD)" : "Pay Now via Stripe"}
                  </>
                )}
              </button>
              
              <div className="flex items-center gap-2 mt-2">
                <IoShieldCheckmarkSharp className={paymentMethod === "COD" ? "text-emerald-600" : "text-[#635BFF]"} />
                <span className="text-[9px] uppercase tracking-widest font-black text-zinc-500">
                    {paymentMethod === "COD" ? "Cash validation on arrival" : "Secure Encryption by Stripe"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;