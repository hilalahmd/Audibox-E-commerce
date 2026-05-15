import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import authApi from "../../services/authApi";

const AdminLogin = () => {
  const [adminMail, setAdminMail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const navigate = useNavigate();

  const handleForm = async (e) => {
    e.preventDefault();

    // Fix for browser autofill not triggering onChange
    const formData = new FormData(e.target);
    const email = formData.get("email") || adminMail;
    const password = formData.get("password") || adminPassword;

    try {
      const res = await authApi.post("/admin/login", {
        email,
        password,
      });

      sessionStorage.setItem("user", JSON.stringify(res.data));
      sessionStorage.setItem("token", res.data.token);

      navigate("/admin/dashboard");

      toast.success("Admin logged in", {
        style: {
          background: "#fff",
          color: "#000",
          border: "1px solid #ddd",
        },
      });
    } catch (error) {
      console.error("Error happened:", error);
      toast.error(error.response?.data?.message || "Authentication failed", {
        style: {
          background: "#fff",
          color: "#000",
          border: "1px solid #ddd",
        },
      });
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        {/* Title */}
        <div className="mb-10">
          <p
            id="logo-text"
            className="font-bold text-center text-3xl tracking-tighter cursor-pointer mb-1"
          >
            AUDIBOX.
          </p>
          <p className="text-center text-gray-500 text-sm mb-8">
            Access the admin control panel
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleForm}>
          <div className="space-y-1">
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              onChange={(e) => setAdminMail(e.target.value)}
              placeholder="admin@dec.com"
              className="w-full p-3 rounded-xl border bg-gray-50 focus:outline-none 
                         focus:ring-2 focus:ring-black"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              name="password"
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="password"
              className="w-full p-3 rounded-xl border bg-gray-50 focus:outline-none 
                         focus:ring-2 focus:ring-black"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-black text-white font-medium py-3 rounded-xl
                       hover:bg-black/85 transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
