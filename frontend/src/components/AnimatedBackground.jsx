import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-background">
      {/* Animated Blobs - Lower opacity and more subtle */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] animate-blob" />
      <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] bg-purple-500/5 rounded-full blur-[120px] animate-blob animation-delay-4000" />
      
      {/* Subtle Grid Overlay - Even more subtle */}
      <div 
        className="absolute inset-0 opacity-[0.02]" 
        style={{ 
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} 
      />

      {/* Very soft gradient overlay for the slightly blue/purple tint */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-primary/5" />
    </div>
  );
};

export default AnimatedBackground;
