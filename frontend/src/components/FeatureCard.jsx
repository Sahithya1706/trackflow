import React from 'react';

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="glass-card p-8 rounded-[2rem] group hover:scale-[1.03] hover:bg-white/[0.08] transition-all duration-300 border border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 blur-[60px] group-hover:bg-primary/10 transition-colors pointer-events-none" />
      
      <div className="relative z-10">
        <div className="w-14 h-14 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all duration-500">
          {React.cloneElement(icon, { className: "text-primary group-hover:text-white transition-colors duration-500" })}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-zinc-500 text-[15px] leading-relaxed group-hover:text-zinc-400 transition-colors">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
