import React, { useEffect } from "react";
import { useWishlistCart } from "../../context/WishlistCartContext";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useAuth } from "../../context/AuthContext";
import { IoCheckmarkCircle } from "react-icons/io5"; 

const CheckoutSuccess = () => {
    const { handleClearCart } = useWishlistCart();
    const { goOrders, goProducts } = useAppNavigation();
    const { user } = useAuth();
    const userId = user?.id || user?._id;

    useEffect(() => {
        handleClearCart();
        
        // Check for stripe success redirect
        const params = new URLSearchParams(window.location.search);
        const orderId = params.get('orderId');
        if (orderId) {
            import("../../services/api").then(({ default: api }) => {
                 api.patch(`/orders/${orderId}`, { isPaid: true, status: "Paid" })
                    .catch(err => console.error("Could not secure payment status update", err));
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center px-4 font-sans relative overflow-hidden">
            {/* Massive Green ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100 blur-[200px] rounded-full pointer-events-none" />

            <div className="bg-white border border-zinc-200/80 rounded-[3rem] p-12 max-w-lg w-full text-center shadow-2xl shadow-zinc-200/50 relative overflow-hidden animate-in fade-in zoom-in-95 duration-1000 z-10">
                
                <div className="flex justify-center mb-8 relative">
                    <IoCheckmarkCircle className="text-emerald-500 text-[110px] bg-white rounded-full drop-shadow-xl z-10" />
                    <div className="absolute inset-0 bg-emerald-50 blur-3xl rounded-full translate-y-4" />
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-zinc-900 uppercase mb-4">
                    Payment <br/><span className="text-zinc-300 font-light italic">Secured.</span>
                </h1>
                
                <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px] leading-relaxed mb-12 px-2">
                    Your transmission was a success. We have received your logistical data and your hardware is currently being processed by our automated systems.
                </p>

                <div className="flex flex-col gap-4 w-full">
                    <button 
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-2xl font-bold uppercase tracking-[0.3em] transition-all text-[11px] shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                        onClick={() => goOrders(userId)}
                    >
                        Check Order Status
                    </button>

                    <button 
                        className="w-full bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50 py-5 rounded-2xl font-bold uppercase tracking-widest text-[11px] transition-all shadow-sm active:scale-[0.98]"
                        onClick={goProducts}
                    >
                        Return to Storefront
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSuccess;
