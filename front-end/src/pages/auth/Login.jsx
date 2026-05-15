import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginImage from "/src/assets/premium_audio_login.png";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import api from "../../services/api";

const 
Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      

      try {
        const success = await login({ email, password });
        if (success) toast.success("Access Granted");
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  return (
    <div className="w-full h-screen flex bg-[#fafafa] text-zinc-900 overflow-hidden font-sans">
      {/* 🌟 LEFT: AUTH INTERFACE */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 lg:p-16 relative bg-white border-r border-zinc-200/80 shadow-2xl z-20">
        
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-zinc-100 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="z-10">
          <Link to="/" className="inline-block">
            <p className="font-black text-2xl tracking-tighter hover:opacity-70 transition-opacity">
              Audibox<span className="text-emerald-500 font-serif">.</span>
            </p>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto z-10">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-3 uppercase text-zinc-900">
              Welcome Back
            </h2>
            <p className="text-zinc-400 text-[10px] uppercase tracking-[0.3em] font-black">
              Resume your sonic journey
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500 ml-1">
                Identity
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-300 transition-all focus:bg-white focus:ring-2 focus:ring-zinc-900 font-bold text-sm shadow-inner"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-500 ml-1">
                Access Key
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-5 py-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-300 transition-all focus:bg-white focus:ring-2 focus:ring-zinc-900 font-bold text-sm shadow-inner"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-zinc-900 text-white py-5 rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-xl shadow-zinc-900/10"
            >
              Authorize Access
            </button>
          </form>

          <p className="text-xs text-zinc-500 mt-8 text-center font-medium">
            New to the ecosystem?{" "}
            <Link to="/register" className="text-zinc-900 hover:text-emerald-500 uppercase tracking-widest font-black ml-1 transition-colors">
              Create Account
            </Link>
          </p>
        </div>

        {/* Footer nuance */}
        <div className="text-[9px] text-zinc-400 uppercase tracking-widest text-center lg:text-left z-10 font-black">
          © 2026 Audibox HIGH-FIDELITY SYSTEMS
        </div>
      </div>

      {/* 🌟 RIGHT: THE VISUAL */}
      <div className="hidden lg:block lg:w-1/2 relative bg-zinc-100 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent z-10 mix-blend-overlay opacity-50" />
        <img
          className="w-full h-full object-cover mix-blend-multiply opacity-90 contrast-[1.1]"
          src={LoginImage}
          alt="Premium Audio Gear"
        />
        <div className="absolute bottom-16 right-16 z-20 text-right">
          <p className="text-white/40 text-8xl font-black italic tracking-tighter select-none drop-shadow-2xl">
            01
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;