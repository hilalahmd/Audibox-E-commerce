import React, { useEffect, useState } from "react";
import { FiLock, FiUnlock, FiEye, FiX, FiPackage } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStats } from "../../context/admin/AdminStatsContext";
import api from "../../services/api";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const { stats } = useAdminStats();
  const [usersList, setUsersList] = useState([]);
  const [isBlock, setIsBlock] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // fetch users
  useEffect(() => {
    if (stats.users) setUsersList(stats.users);
  }, [stats.users]);

  // toggle block
  const toggleBlock = async (userId, isBlocked) => {
    try {
      const user = await api.get(`/users/${userId}`);
      const userName = user.data.username;

      const response = await api.patch(`/users/${userId}`, {
        isBlocked: !isBlocked,
      });

      // update the block state
      setIsBlock(!isBlock);

      if (response.status === 200 || response.status === 201) {
        toast.info(`User ${userName} is ${isBlock ? "Blocked" : "Unblocked"}`);

        setUsersList((prev) =>
          prev.map((user) =>
            user.id === userId ? { ...user, isBlocked: !user.isBlocked } : user
          )
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error("Failed to update:", error);
    }
  };

  // fetch and view orders modal
  const handleViewOrders = async (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setLoadingOrders(true);
    try {
      const response = await api.get(`/orders?userId=${user.id || user._id}`);
      setUserOrders(response.data);
    } catch (error) {
      toast.error("Failed to fetch user orders");
      console.error(error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const closeOrderModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedUser(null);
      setUserOrders([]);
    }, 300);
  };

  // filtered products
  const filteredUsers = usersList.filter(
    (user) =>
      user.id.toLowerCase().toString().includes(searchQuery) ||
      user.username.toLowerCase().toString().includes(searchQuery) ||
      user.email.toLowerCase().toString().includes(searchQuery)
  );

  const statusColors = {
    true: "text-green-600",
    false: "text-gray-500",
  };

  const totalSpent = userOrders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + (order.total || 0), 0);
  const activeOrdersCount = userOrders.filter(
    (order) => !["Delivered", "Cancelled"].includes(order.status)
  ).length;

  return (
    <div className="p-6 w-full min-h-screen bg-gray-50">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Users</h1>

      {/* Search Bar */}
      <div className="flex mb-6">
        <input
          type="text"
          placeholder="Search users"
          className="px-4 py-2 border rounded-lg shadow-sm w-72 focus:outline-none focus:ring-2 focus:ring-gray-700"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Users ({usersList.length})
        </h2>

        <div className="w-full overflow-x-auto pb-4">
          <table className="w-full text-left table-auto min-w-[800px]">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-2 w-[15%]">User ID</th>
              <th className="py-2 w-[20%]">Username</th>
              <th className="py-2 w-[30%]">Email</th>
              <th className="py-2 w-[15%]">Status</th>
              <th className="py-2 w-[20%]">Action</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="py-3 font-medium">{user.id}</td>

                <td className="py-3">{user.username}</td>

                <td className="py-3">{user.email}</td>

                <td className="py-3">
                  <span
                    className={`capitalize font-semibold ${
                      statusColors[user.isOnline]
                    }`}
                  >
                    {user.isOnline ? "online" : "offline"}
                  </span>
                </td>

                <td className="py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleViewOrders(user)}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider transition bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:shadow-sm"
                    >
                      <FiEye size={14} /> View Orders
                    </button>
                    <button
                      onClick={() => toggleBlock(user.id, user.isBlocked)}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider transition shadow-sm
                        ${
                          user.isBlocked
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-gray-800 text-white hover:bg-gray-900"
                        }`}
                    >
                      {user.isBlocked ? <FiUnlock size={14} /> : <FiLock size={14} />}
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
          </table>
        </div>
      </div>

      {/* PREMIUM ANIMATED ORDERS MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeOrderModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tighter flex items-center gap-3">
                    <FiPackage className="text-indigo-600" /> Order History
                  </h2>
                  <p className="text-sm font-semibold text-gray-500 mt-1">
                    Viewing secure logs for <span className="text-indigo-600 font-black tracking-wide">{selectedUser?.username}</span>
                  </p>
                </div>
                <button
                  onClick={closeOrderModal}
                  className="p-2.5 rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors shadow-sm"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto flex-1 bg-white custom-scrollbar">
                {loadingOrders ? (
                  <div className="flex flex-col items-center justify-center h-64 gap-5">
                    <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-bold tracking-widest uppercase text-[10px]">Decrypting secure logs...</p>
                  </div>
                ) : userOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-5 shadow-inner">
                      <FiPackage className="text-4xl text-gray-300" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2 tracking-tight">No Orders Found</h3>
                    <p className="text-sm font-medium text-gray-500">This user hasn't made any purchases yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Premium Stats Panel */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                    >
                      <div className="bg-gradient-to-br from-indigo-50 to-white p-5 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                          <FiPackage className="w-16 h-16" />
                        </div>
                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Total Orders</p>
                        <p className="text-3xl font-black text-indigo-900 tracking-tighter">{userOrders.length}</p>
                      </div>
                      <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-2xl border border-emerald-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                          <svg className="w-16 h-16 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">Total Spent</p>
                        <p className="text-3xl font-black text-emerald-900 tracking-tighter">₹{totalSpent.toLocaleString()}</p>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-2xl border border-amber-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                          <svg className="w-16 h-16 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Active Orders</p>
                        <p className="text-3xl font-black text-amber-900 tracking-tighter">{activeOrdersCount}</p>
                      </div>
                    </motion.div>

                    <h3 className="text-lg font-black text-gray-800 mb-4 tracking-tight border-b border-gray-100 pb-2">Order Timeline</h3>
                    <div className="space-y-5">
                    {userOrders.map((order) => (
                      <div key={order.id} className="border border-gray-100 rounded-3xl p-6 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 group bg-white">
                        
                        {/* Order Header Row */}
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-[10px] font-black px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg uppercase tracking-widest border border-gray-200 shadow-sm">
                                {order.id}
                              </span>
                              <span className={`text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-sm
                                ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                                  order.status === 'Cancelled' ? 'bg-red-100 text-red-700 border border-red-200' : 
                                  'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 font-bold mt-2">
                              {new Date(order.date || order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                            </p>
                          </div>

                          <div className="flex items-center gap-8 bg-gray-50 px-5 py-3 rounded-2xl border border-gray-100">
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Value</p>
                              <p className="text-2xl font-black text-gray-900 tracking-tighter">₹{order.total?.toLocaleString()}</p>
                            </div>
                            <div className="w-px h-10 bg-gray-200"></div>
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Method</p>
                              <p className="text-sm font-black text-indigo-600 tracking-wide uppercase mt-1">{order.paymentMethod}</p>
                            </div>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="mt-6 pt-5 border-t border-gray-100 flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex-shrink-0 flex items-center gap-4 bg-white border border-gray-100 px-4 py-3 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center p-1 border border-gray-100">
                                <img 
                                  src={(item.image || item.img)?.startsWith('http') ? (item.image || item.img) : `/${item.image || item.img}`} 
                                  alt={item.productName} 
                                  className="max-w-full max-h-full object-contain" 
                                />
                              </div>
                              <div className="flex flex-col justify-center">
                                <p className="text-xs font-black text-gray-800 line-clamp-1 w-36 tracking-tight">{item.productName}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Qty: {item.quantity || 1}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                      </div>
                    ))}
                  </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminUsers;
