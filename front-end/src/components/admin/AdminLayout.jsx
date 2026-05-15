import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiLogOut,
  FiMenu,
  FiX
} from "react-icons/fi";
import authApi from "../../services/authApi";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  const handleLogout = async () => {
    try {
      await authApi.post("/auth/logout");
    } catch (error) {
      console.error("Admin logout failed", error);
    } finally {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      navigate("/admin/login");
    }
  };

  useEffect(() => {
    const verifyAdminSession = async () => {
      try {
        await authApi.get("/admin/profile");
      } catch (error) {
        navigate("/admin/login");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAdminSession();
  }, [navigate]);

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center text-sm text-gray-600">Verifying admin session...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 text-zinc-900 overflow-hidden">
     
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b shadow-sm z-40 flex items-center justify-between px-4">
        <h1 className="text-xl font-black tracking-tighter">AUDIBOX.</h1>
        <button 
          onClick={() => setIsSidebarOpen(true)} 
          className="p-2 text-zinc-600 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition"
        >
          <FiMenu size={24} />
        </button>
      </div>

     
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}


      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        
        <div>
          <div className="h-16 md:h-20 flex items-center justify-between px-6 border-b md:border-transparent bg-white">
            <h1 className="text-2xl font-black tracking-tighter hidden md:block">AUDIBOX.</h1>
            <h1 className="text-xl font-black tracking-tighter md:hidden">Menu</h1>
            
            
            <button 
              className="md:hidden p-2 text-zinc-500 hover:bg-zinc-100 rounded-lg" 
              onClick={() => setIsSidebarOpen(false)}
            >
              <FiX size={20} />
            </button>
          </div>

      
          <nav className="p-4 space-y-2">
            <NavLink
              to="/admin/dashboard"
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`
              }
            >
              <FiGrid size={20} />
              Dashboard
            </NavLink>

            <NavLink
              to="/admin/products"
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`
              }
            >
              <FiBox size={20} />
              Products
            </NavLink>

            <NavLink
              to="/admin/orders"
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`
              }
            >
              <FiShoppingBag size={20} />
              Orders
            </NavLink>

            <NavLink
              to="/admin/users"
              onClick={() => setIsSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`
              }
            >
              <FiUsers size={20} />
              Users
            </NavLink>
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            className="w-full flex items-center gap-3 text-red-600 px-6 py-3 rounded-lg font-bold hover:bg-red-50 hover:text-red-700 transition"
            onClick={handleLogout}
          >
            <FiLogOut size={20} />
            Secure Logout
          </button>
        </div>
      </aside>

      {/* 🌟 MAIN CONTENT INJECTION PORTAL */}
      <main className="flex-1 w-full mt-16 md:mt-0 p-4 md:p-6 overflow-y-auto">
        <Outlet />
      </main>
      
    </div>
  );
};

export default AdminLayout;
