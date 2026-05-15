import React from "react";
import { BiSolidQuoteRight } from "react-icons/bi";

const TestimonialGrid = () => {
  const testimonials = [
    {
      user: "Sarah John",
      profession: "Music Producer",
      userImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      feed: "Never experienced sound this pure. The clarity, the bass, everything feels balanced. Definitely worth every rupee!",
    },
    {
      user: "Alex Jordan",
      profession: "Podcast Artist",
      userImg: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      feed: "Exceptional clarity and comfort. The sound feels rich and balanced, and the noise cancellation makes a huge difference. Premium build, premium sound.",
    },
    {
      user: "Parague Marc",
      profession: "Audio Editor",
      userImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80",
      feed: "These completely elevated my daily listening. Clean vocals, deep bass, and a smooth tone. Definitely worth it for anyone who loves high-quality sound.",
    },
  ];

  return (
    <div className="w-full bg-[#fafafa] py-12">
      <div className="relative overflow-hidden bg-white text-zinc-900 py-20 lg:py-28 rounded-[3rem] lg:rounded-[4rem] border border-zinc-200/60 shadow-sm">
        
        {/* Background Ambient Glow */}
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-zinc-50 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-10 lg:px-20 relative z-10">
          
          {/* Header Section */}
          <div className="w-full flex flex-col gap-4 items-center text-center mb-16 lg:mb-24">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-zinc-900">
              COMMUNITY <span className="text-zinc-400 font-light italic">VOICES</span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="w-12 h-[1px] bg-zinc-200" />
              <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-black">
                Join Thousands Of Satisfied Listeners
              </p>
              <div className="w-12 h-[1px] bg-zinc-200" />
            </div>
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {testimonials.map((item, i) => (
              <div 
                key={i} 
                className="group relative flex flex-col gap-8 items-start bg-zinc-50 rounded-[2.5rem] p-10 border border-zinc-200/60 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:bg-white cursor-default"
              >
                {/* Minimalist Quote Icon */}
                <BiSolidQuoteRight className="absolute top-8 right-10 text-zinc-200 text-6xl group-hover:text-zinc-100 transition-colors duration-500" />

                {/* User Info Section */}
                <div className="flex gap-5 items-center relative z-10">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm ring-2 ring-zinc-100 group-hover:ring-zinc-200 transition-colors">
                    <img
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                      src={item.userImg}
                      alt={item.user}
                    />
                  </div>

                  <div className="flex flex-col">
                    <h3 className="font-bold text-zinc-900 tracking-tight">{item.user}</h3>
                    <p className="text-[9px] uppercase tracking-widest text-zinc-500 font-black">
                      {item.profession}
                    </p>
                  </div>
                </div>

                {/* Feedback Text */}
                <div className="relative z-10">
                  <p className="text-zinc-600 leading-relaxed font-medium">
                    "{item.feed}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialGrid;