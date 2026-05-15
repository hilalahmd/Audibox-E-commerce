import React, { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import SubHead from "../../components/ui/SubHead";
import { FaRegUser } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { BsBoxSeam } from "react-icons/bs";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useOrders } from "../../context/OrdersContext";
import { useAppNavigation } from "../../hooks/useAppNavigation";

const User = () => {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [newEmail, setNewEmail] = useState(user?.email || "");

  const { goOrders } = useAppNavigation();
  const { orders } = useOrders();

  const totalOrders = orders.length;
  const totalSpend = orders.reduce((sum, order) => sum + Number(order.total), 0);

  const handleSaveUsername = async () => {
    try {
      setSaving(true);
      const res = await api.patch(`/users/${user.id}`, { username: newUsername });
      const updatedUser = res?.data ? res.data : { ...user, username: newUsername };
      updateUser(updatedUser);
      toast.success("Username updated Successfully");
    } catch (error) {
      toast.error("Failed to update Username");
    } finally {
      setSaving(false);
      setEditingUsername(false);
    }
  };

  const handleSaveEmail = async () => {
    try {
      setSaving(true);
      const res = await api.patch(`/users/${user.id}`, { email: newEmail });
      const updatedUser = res?.data ? res.data : { ...user, email: newEmail };
      updateUser(updatedUser);
      toast.success("Email updated Successfully");
    } catch (error) {
      toast.error("Failed to update Email");
    } finally {
      setSaving(false);
      setEditingEmail(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#fafafa] text-zinc-900 pb-24 font-sans">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-12 lg:pt-32">
        <div className="mb-12">
          <SubHead head="Account Vault" sub="Manage your profile & security" />
          <div className="w-24 h-[2px] bg-gradient-to-r from-zinc-200 to-transparent mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 🌟 LEFT: Profile Details */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Avatar Header */}
            <div className="relative overflow-hidden bg-white p-8 lg:p-12 rounded-[3.5rem] border border-zinc-200/80 shadow-sm group hover:shadow-lg transition-shadow duration-500">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-zinc-50 blur-[50px] rounded-full group-hover:bg-zinc-100 transition-colors" />
              
              <div className="relative z-10 flex items-center gap-8">
                <div className="bg-zinc-100 border border-zinc-200 rounded-full w-24 h-24 flex items-center justify-center shadow-inner">
                  <FaRegUser className="text-4xl text-zinc-400" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-500 font-black mb-1">Authenticated Member</p>
                  <h1 className="text-3xl lg:text-4xl font-black tracking-tighter text-zinc-900">{user?.username}</h1>
                </div>
              </div>
            </div>

            {/* Editable Fields Container */}
            <div className="bg-white p-8 lg:p-10 rounded-[3.5rem] border border-zinc-200/80 shadow-sm flex flex-col gap-10">
              
              {/* Username Field */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xs uppercase tracking-[0.3em] font-black text-zinc-400">Username</h2>
                  {!editingUsername && (
                    <button onClick={() => setEditingUsername(true)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                      <MdEdit size={22} />
                    </button>
                  )}
                </div>
                {editingUsername ? (
                  <div className="flex gap-3 mt-2 animate-in fade-in zoom-in-95 duration-300">
                    <input
                      className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all font-bold text-sm shadow-inner text-zinc-900"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                    />
                    <button onClick={handleSaveUsername} disabled={saving} className="bg-zinc-900 text-white px-6 rounded-xl font-bold text-[10px] uppercase tracking-widest disabled:opacity-50 hover:bg-zinc-800 transition-colors">Save</button>
                    <button onClick={() => setEditingUsername(false)} className="bg-white border border-zinc-200 text-zinc-900 px-6 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-50 transition-colors shadow-sm">Cancel</button>
                  </div>
                ) : (
                  <p className="text-2xl font-black tracking-tight text-zinc-900 bg-zinc-50 w-fit px-4 py-2 rounded-xl border border-zinc-100">{user?.username || "-"}</p>
                )}
              </div>

              <div className="h-[1px] bg-zinc-100" />

              {/* Email Field */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xs uppercase tracking-[0.3em] font-black text-zinc-400">Email Address</h2>
                  {!editingEmail && (
                    <button onClick={() => setEditingEmail(true)} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                      <MdEdit size={22} />
                    </button>
                  )}
                </div>
                {editingEmail ? (
                  <div className="flex gap-3 mt-2 animate-in fade-in zoom-in-95 duration-300">
                    <input
                      className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all font-bold text-sm shadow-inner text-zinc-900"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                    <button onClick={handleSaveEmail} disabled={saving} className="bg-zinc-900 text-white px-6 rounded-xl font-bold text-[10px] uppercase tracking-widest disabled:opacity-50 hover:bg-zinc-800 transition-colors">Save</button>
                    <button onClick={() => setEditingEmail(false)} className="bg-white border border-zinc-200 text-zinc-900 px-6 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-zinc-50 transition-colors shadow-sm">Cancel</button>
                  </div>
                ) : (
                  <p className="text-2xl font-black tracking-tight text-zinc-900 bg-zinc-50 w-fit px-4 py-2 rounded-xl border border-zinc-100">{user?.email || "-"}</p>
                )}
              </div>
            </div>
          </div>

          {/* 🌟 RIGHT: Order Stats */}
          <div className="bg-white p-10 rounded-[3.5rem] border border-zinc-200/80 h-fit shadow-lg relative overflow-hidden group hover:shadow-2xl transition-shadow duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-zinc-900 group-hover:opacity-10 transition-opacity">
              <BsBoxSeam size={120} />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-xs uppercase tracking-[0.3em] font-black text-zinc-400 mb-8">Purchase History</h2>
              
              <div className="flex flex-col gap-8">
                <div>
                  <p className="text-7xl font-black tracking-tighter text-zinc-900">{totalOrders}</p>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-black mt-2">Total Orders Placed</p>
                </div>

                <div className="h-[1px] bg-zinc-100" />

                <div>
                  <p className="text-5xl font-black tracking-tighter text-emerald-500">₹{totalSpend.toLocaleString()}</p>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-black mt-2">Total Investment in Sound</p>
                </div>

                <button
                  onClick={goOrders}
                  className="mt-6 w-full py-5 bg-zinc-900 text-white rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] transition-all hover:bg-zinc-800 active:scale-95 shadow-xl shadow-zinc-900/10"
                >
                  View Order Log
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 pt-16 border-t border-zinc-200">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default User;