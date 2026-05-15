import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginImage from "/src/assets/loginpage.webp";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [errors, setErrors] = useState({ name: "", email: "", password: "", confirmPassword: "", form: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let currentErrors = { name: "", email: "", password: "", confirmPassword: "", form: "" };
    let hasError = false;

    if (!name.trim()) {
      currentErrors.name = "Name is required";
      hasError = true;
    }

    const emailRegex = /^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      currentErrors.email = "Please enter a valid email address";
      hasError = true;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      currentErrors.password = "Password must be at least 8 characters long, and include both uppercase and lowercase letters.";
      hasError = true;
    }

    if (password !== confirmPassword) {
      currentErrors.confirmPassword = "Passwords do not match";
      hasError = true;
    }

    setErrors(currentErrors);
    if (hasError) return;

    try {
      const res = await register({ name, email, password });
      if (!res) {
          // If register returns null, it failed (AuthContext shows toast or we can set form error)
          setErrors(prev => ({ ...prev, form: "Registration failed. Email might be already in use." }));
      }
    } catch (err) {
      setErrors(prev => ({ ...prev, form: "Failed to register. Please try again" }));
    }
  };

  return (
    <div className="w-full h-screen flex bg-[#fafafa] font-sans overflow-hidden">
      {/* 🌟 LEFT PANEL: The Vault */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-24 bg-white relative border-r border-zinc-200/80 shadow-2xl z-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-zinc-50 to-transparent pointer-events-none" />

        <div className="max-w-md w-full mx-auto relative z-10">
          <div className="mb-12 text-center lg:text-left">
            <Link to="/">
               <p className="font-black text-2xl tracking-tighter text-zinc-900 mb-8 inline-block hover:opacity-70">
                 Audibox<span className="text-emerald-500 font-serif">.</span>
               </p>
            </Link>
            <h2 className="text-4xl lg:text-5xl font-black text-zinc-900 tracking-tighter mb-2 uppercase">
              Form Identity
            </h2>
            <p className="text-zinc-400 text-[10px] tracking-[0.3em] font-black uppercase">
              Join the audio revolution
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  className={`w-full bg-zinc-50 border ${errors.name ? 'border-red-500' : 'border-zinc-200'} rounded-2xl px-5 py-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all font-bold text-sm shadow-inner`}
                  onChange={(e) => { setName(e.target.value); setErrors(p => ({...p, name: ""})) }}
                  required
                />
                {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.name}</p>}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className={`w-full bg-zinc-50 border ${errors.email ? 'border-red-500' : 'border-zinc-200'} rounded-2xl px-5 py-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all font-bold text-sm shadow-inner`}
                  onChange={(e) => { setEmail(e.target.value); setErrors(p => ({...p, email: ""})) }}
                  required
                />
                {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.email}</p>}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="New Password"
                  className={`w-full bg-zinc-50 border ${errors.password ? 'border-red-500' : 'border-zinc-200'} rounded-2xl px-5 py-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all font-bold text-sm shadow-inner`}
                  onChange={(e) => { setPassword(e.target.value); setErrors(p => ({...p, password: ""})) }}
                  required
                />
                {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2 leading-tight">{errors.password}</p>}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className={`w-full bg-zinc-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-zinc-200'} rounded-2xl px-5 py-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all font-bold text-sm shadow-inner`}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrors(p => ({...p, confirmPassword: ""})) }}
                  required
                />
                {errors.confirmPassword && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.confirmPassword}</p>}
              </div>
              
              {errors.form && <p className="text-red-500 text-xs font-bold text-center mt-2">{errors.form}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-zinc-900 text-white py-5 rounded-2xl font-bold text-[11px] uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all mt-8 active:scale-[0.98] shadow-xl shadow-zinc-900/10"
            >
              Sign Up Let's Go
            </button>
          </form>

          <p className="text-xs text-zinc-500 mt-8 tracking-wide text-center uppercase font-medium">
            ALREADY PART OF THE COLLECTIVE?{" "}
            <Link to="/login" className="text-zinc-900 hover:text-emerald-500 font-black ml-1 transition-colors">
              SIGN IN
            </Link>
          </p>
        </div>
      </div>

      {/* 🌟 RIGHT PANEL: Visual */}
      <div className="hidden lg:block lg:w-1/2 relative bg-zinc-100 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-l from-white via-transparent to-transparent z-10 mix-blend-overlay opacity-50" />
        <img 
          className="w-full h-full object-cover mix-blend-multiply opacity-90 contrast-[1.1]" 
          src={LoginImage} 
          alt="Audio Brand Visual" 
        />
      </div>
    </div>
  );
};

export default Register;