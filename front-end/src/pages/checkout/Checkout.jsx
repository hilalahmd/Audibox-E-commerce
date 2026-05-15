import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { FiArrowLeft, FiLock } from "react-icons/fi";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useWishlistCart } from "../../context/WishlistCartContext";
import { useAuth } from "../../context/AuthContext";

const Checkout = () => {
  const { user } = useAuth();
  const userId = user?.id || user?._id;
  const { goCart, goPayment } = useAppNavigation();
  const { cart, subTotal, total, gst } = useWishlistCart();

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", country: "", city: "", state: "", postalCode: "",
  });

  useEffect(() => {
    if (!userId) return;
    const saved = localStorage.getItem(`addressOf${userId}`);
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, [userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(`addressOf${userId}`, JSON.stringify(formData));
    goPayment();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative min-h-screen w-full bg-[#fafafa] text-zinc-900 pb-24 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-10 lg:pt-32">
        {/* Navigation & Title */}
        <div className="flex items-center gap-6 mb-12 group cursor-pointer w-fit" onClick={goCart}>
          <div className="p-3 rounded-full bg-white border border-zinc-200 text-zinc-400 group-hover:bg-zinc-100 group-hover:text-zinc-900 transition-all shadow-sm">
            <FiArrowLeft size={20} />
          </div>
          <div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase text-zinc-900">Logistics</h1>
            <p className="text-[10px] tracking-[0.3em] text-zinc-400 font-black uppercase mt-1">Shipping Details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* 🌟 Left: Shipping Form */}
          <div className="lg:col-span-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] border border-zinc-200/80 p-8 lg:p-12 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-10">
                <section>
                  <h2 className="text-xs uppercase tracking-[0.4em] font-black text-zinc-400 mb-8 border-b border-zinc-100 pb-4">
                    01. Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CustomInput label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="Steve" required />
                    <CustomInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Jobs" required />
                    <CustomInput label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="steve@apple.com" required />
                    <CustomInput label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+1 800-MY-APPLE" required />
                  </div>
                </section>

                <section>
                  <h2 className="text-xs uppercase tracking-[0.4em] font-black text-zinc-400 mb-8 border-b border-zinc-100 pb-4">
                    02. Destination
                  </h2>
                  <div className="space-y-6">
                    <CustomInput label="Full Address" name="address" value={formData.address} onChange={handleInputChange} placeholder="1 Infinite Loop" required />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <CustomInput label="City" name="city" value={formData.city} onChange={handleInputChange} placeholder="Cupertino" required />
                      <CustomInput label="State" name="state" value={formData.state} onChange={handleInputChange} placeholder="CA" required />
                      <CustomInput label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleInputChange} placeholder="95014" required />
                    </div>
                    <CustomInput label="Country" name="country" value={formData.country} onChange={handleInputChange} placeholder="United States" />
                  </div>
                </section>

                <div className="pt-8">
                  <button
                    type="submit"
                    className="w-full bg-zinc-900 text-white py-6 rounded-2xl font-bold text-[11px] uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-lg shadow-zinc-900/10 flex items-center justify-center gap-3"
                  >
                    Proceed to Secure Payment <FiLock />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* 🌟 Right: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2.5rem] border border-zinc-200/80 p-8 lg:p-10 sticky top-32 shadow-lg overflow-hidden">
              <h3 className="text-2xl font-black tracking-tighter mb-8 uppercase text-zinc-900 border-b border-zinc-100 pb-4">Digital Invoice</h3>

              <div className="space-y-4 mb-8 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center group py-2">
                    <div className="flex-1 pr-4">
                      <p className="text-sm font-black tracking-tighter text-zinc-700 group-hover:text-zinc-900 transition-colors truncate">
                        {item.productName}
                      </p>
                      <p className="text-[9px] text-zinc-400 font-black uppercase tracking-widest mt-1">
                        Unit × {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-sm text-zinc-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-5 pt-6 border-t border-zinc-100">
                <div className="flex justify-between text-[11px] uppercase tracking-widest font-black text-zinc-400">
                  <span>Base Value</span>
                  <span className="text-zinc-900">₹{subTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] uppercase tracking-widest font-black text-zinc-400">
                  <span>Logistics</span>
                  <span className="text-emerald-500">Allocated</span>
                </div>
                <div className="flex justify-between text-[11px] uppercase tracking-widest font-black text-zinc-400">
                  <span>GST (18%)</span>
                  <span className="text-zinc-900">₹{gst.toFixed(0)}</span>
                </div>

                <div className="pt-6 mt-4 border-t border-zinc-200 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black tracking-[0.3em] text-zinc-400 mb-2 uppercase">Total Payable</p>
                    <p className="text-4xl lg:text-5xl font-black tracking-tighter leading-none text-zinc-900">
                      ₹{total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-5 bg-zinc-50 rounded-2xl border border-zinc-200">
                <p className="text-[9px] text-zinc-500 leading-relaxed uppercase tracking-widest font-black flex items-center gap-2">
                  <FiLock className="text-zinc-400 text-lg flex-shrink-0" />
                  Encryption active. Your logistical data is secured using industry-standard protocols.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 border-t border-zinc-200 pt-12">
          <Footer />
        </div>
      </div>
    </div>
  );
};

const CustomInput = ({ label, ...props }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500 ml-1">
      {label} {props.required && <span className="text-emerald-500">*</span>}
    </label>
    <input
      {...props}
      className="bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all text-sm font-bold shadow-inner"
    />
  </div>
);

export default Checkout;