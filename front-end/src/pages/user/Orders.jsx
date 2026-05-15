import React, { useState } from "react";
import { toast } from "react-toastify";
import Header from "../../components/layout/Header.jsx";
import SubHead from "../../components/ui/SubHead.jsx";
import Footer from "../../components/layout/Footer.jsx";
import EmptyMessage from "../../components/ui/EmptyMessage.jsx";
import { useOrders } from "../../context/OrdersContext.jsx";

const Orders = () => {
  const { orders, cancelOrder } = useOrders();
  const [selectedOrderToCancel, setSelectedOrderToCancel] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [activeDetailsId, setActiveDetailsId] = useState(null);

  const cancellationReasons = [
    "Cash issue",
    "I changed my mind",
    "Found a better price elsewhere",
    "Expected delivery time is too long",
    "Ordered by mistake",
    "Other"
  ];

  const handleCancelSubmit = async () => {
    if (!cancellationReason) {
      toast.error("Please select a reason for cancellation");
      return;
    }
    try {
      await cancelOrder(selectedOrderToCancel, cancellationReason);
      toast.success("Order cancelled successfully");
      setSelectedOrderToCancel(null);
      setCancellationReason("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="relative min-h-screen w-full bg-[#fafafa] text-zinc-900 pb-24 font-sans">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-10 lg:pt-32">
        <div className="mb-12">
          <SubHead head="Acquisition History" sub="Track your premium audio gear" />
          <div className="w-24 h-[2px] bg-gradient-to-r from-zinc-200 to-transparent mt-4" />
        </div>

        {orders.length === 0 ? (
          <div className="animate-in fade-in duration-700 bg-white rounded-[3rem] p-10 shadow-sm border border-zinc-200/80">
            <EmptyMessage messageType="Orders" />
          </div>
        ) : (
          <div className="mt-6 lg:mt-12 flex flex-col gap-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="group bg-white border border-zinc-200/80 rounded-[3rem] p-6 lg:p-10 flex flex-col lg:flex-row justify-between items-center gap-8 hover:shadow-xl transition-all duration-500 shadow-sm"
              >
                {/* 🌟 Left Section - Visual Assets */}
                <div className="flex flex-col lg:flex-row gap-8 items-center flex-1 w-full">
                  <div className="flex -space-x-6 hover:space-x-2 transition-all duration-500">
                    {order.items.slice(0, 3).map((it, i) => (
                      <div
                        key={i}
                        className="h-28 w-28 rounded-2xl overflow-hidden border-[6px] border-white bg-zinc-50 shadow-md ring-1 ring-zinc-200 flex-shrink-0"
                      >
                        <img
                          src={(it.image ?? it.img)?.startsWith('http') ? (it.image ?? it.img) : `/${it.image ?? it.img}`}
                          alt={it.productName}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="h-28 w-28 rounded-2xl border-[6px] border-white bg-zinc-100 shadow-md ring-1 ring-zinc-200 flex items-center justify-center flex-shrink-0 z-10">
                        <span className="text-sm font-black text-zinc-500">+{order.items.length - 3}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1 text-center lg:text-left">
                    <span className="text-[9px] uppercase tracking-[0.4em] font-black text-zinc-400">Transaction Ref</span>
                    <h3 className="text-2xl font-black tracking-tighter text-zinc-900 group-hover:text-emerald-500 transition-colors uppercase">
                      {order.id}
                    </h3>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">
                      Processed on {formatDate(order.date)}
                    </p>
                  </div>
                </div>

                {/* 🌟 Right Section - Logistics & Status */}
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full lg:w-auto border-t lg:border-t-0 border-zinc-100 pt-6 lg:pt-0">
                  <div className="text-center lg:text-right">
                    <span className="text-[10px] uppercase tracking-widest font-black text-zinc-400 block mb-1">Investment</span>
                    <p className="text-4xl font-black tracking-tighter text-zinc-900">
                      ₹{order.total.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col items-center lg:items-end gap-3 min-w-[140px]">
                    <div className="flex items-center gap-2 bg-zinc-50 px-4 py-2 rounded-full border border-zinc-200 shadow-sm">
                      <span className={`w-2 h-2 rounded-full animate-pulse ${
                        order.status === "Delivered" ? "bg-emerald-500" : 
                        order.status === "Cancelled" ? "bg-red-500" : "bg-orange-500"
                      }`} />
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                        order.status === "Delivered" ? "text-emerald-500" : 
                        order.status === "Cancelled" ? "text-red-500" : "text-orange-500"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="flex gap-2 relative">
                      {order.status !== "Delivered" && order.status !== "Cancelled" && (
                        <button 
                          onClick={() => setSelectedOrderToCancel(order.id)}
                          className="px-6 py-2.5 bg-red-50 text-red-500 border border-red-200 rounded-xl text-[9px] uppercase tracking-[0.2em] font-black hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
                        >
                          Cancel
                        </button>
                      )}
                      
                      <div 
                        className="relative group"
                        onMouseEnter={() => window.innerWidth >= 1024 && setActiveDetailsId(order.id)}
                        onMouseLeave={() => window.innerWidth >= 1024 && setActiveDetailsId(null)}
                      >
                        <button 
                          onClick={() => window.innerWidth < 1024 && setActiveDetailsId(activeDetailsId === order.id ? null : order.id)}
                          className="px-6 py-2.5 border border-zinc-200 rounded-xl text-[9px] uppercase tracking-[0.2em] font-black text-zinc-400 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all shadow-sm"
                        >
                          Details
                        </button>

                        {/* Premium Tracking Timeline Popover (Notch Style) */}
                        <div className={`absolute bottom-full right-0 mb-4 w-72 lg:w-80 bg-white/95 backdrop-blur-xl border border-zinc-200/80 rounded-[2rem] shadow-[0_20px_40px_-5px_rgba(0,0,0,0.08)] p-6 transition-all duration-500 origin-bottom-right z-50 ${activeDetailsId === order.id ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
                          {/* Notch Tail */}
                          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-b border-r border-zinc-200/80 transform rotate-45"></div>
                          
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Order Trajectory</h4>
                            <span className="text-[9px] font-bold text-zinc-500 bg-zinc-100 px-2 py-1 rounded-full uppercase tracking-widest">{order.id.slice(-6)}</span>
                          </div>

                          <div className="flex flex-col space-y-6 relative ml-1">
                            {/* Vertical Line */}
                            <div className="absolute top-2 left-[11px] bottom-6 w-0.5 bg-gradient-to-b from-zinc-200 to-transparent z-0"></div>
                            
                            {['Ordered', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                              const steps = ['Ordered', 'Processing', 'Shipped', 'Delivered'];
                              const currentStatusIndex = steps.indexOf(order.status);
                              // isActive if this step is or has passed
                              // Except if it's Cancelled, only Ordered is active
                              let isActive = false;
                              if (order.status === 'Cancelled') {
                                isActive = step === 'Ordered';
                              } else {
                                isActive = currentStatusIndex >= idx;
                              }

                              if (order.status === 'Cancelled' && step !== 'Ordered') return null;

                              return (
                                <div key={idx} className="flex items-start gap-5 relative z-10">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-[3px] transition-all duration-500 ${isActive ? 'bg-zinc-900 border-zinc-900 shadow-[0_0_15px_rgba(0,0,0,0.15)]' : 'bg-white border-zinc-200'}`}>
                                    {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                  </div>
                                  <div className="flex flex-col mt-0.5">
                                    <span className={`text-xs font-black uppercase tracking-widest transition-colors duration-500 ${isActive ? 'text-zinc-900' : 'text-zinc-300'}`}>
                                      {step}
                                    </span>
                                    {step === 'Ordered' && <span className="text-[9px] font-semibold text-zinc-400 mt-1 tracking-widest uppercase">{formatDate(order.date)}</span>}
                                    {order.status === step && step !== 'Ordered' && <span className="text-[9px] font-semibold text-emerald-500 mt-1 tracking-widest uppercase">Current Status</span>}
                                  </div>
                                </div>
                              );
                            })}

                            {order.status === 'Cancelled' && (
                              <div className="flex items-start gap-5 relative z-10">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-red-500 border-[3px] border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                </div>
                                <div className="flex flex-col mt-0.5 max-w-[180px]">
                                  <span className="text-xs font-black uppercase tracking-widest text-red-500">
                                    Cancelled
                                  </span>
                                  <span className="text-[9px] font-semibold text-zinc-400 mt-1 tracking-widest uppercase line-clamp-2 leading-tight">
                                    {order.cancellationReason || "No reason"}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        <div className="mt-32 pt-12 border-t border-zinc-200">
          <Footer />
        </div>
      </div>

      {/* Cancellation Modal */}
      {selectedOrderToCancel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full mx-4 shadow-2xl relative">
            <button 
              onClick={() => setSelectedOrderToCancel(null)}
              className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="text-2xl font-black tracking-tighter text-zinc-900 mb-2">Cancel Order</h3>
            <p className="text-sm font-medium text-zinc-500 mb-6">Please let us know why you are cancelling.</p>
            
            <div className="space-y-3 mb-8">
              {cancellationReasons.map((reason, idx) => (
                <label key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-zinc-200 cursor-pointer hover:bg-zinc-50 transition-colors">
                  <input 
                    type="radio" 
                    name="cancellationReason" 
                    value={reason}
                    checked={cancellationReason === reason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    className="w-4 h-4 text-red-500 border-zinc-300 focus:ring-red-500 focus:ring-offset-0"
                  />
                  <span className="text-sm font-semibold text-zinc-700">{reason}</span>
                </label>
              ))}
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={() => setSelectedOrderToCancel(null)}
                className="flex-1 px-6 py-3 border border-zinc-200 rounded-xl text-xs uppercase tracking-widest font-black text-zinc-500 hover:bg-zinc-100 transition-colors"
              >
                Keep Order
              </button>
              <button 
                onClick={handleCancelSubmit}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl text-xs uppercase tracking-widest font-black hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;