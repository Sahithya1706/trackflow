import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, UserPlus, Ticket, Kanban, ArrowRight } from 'lucide-react';

const Step = ({ number, icon, title, description, isLast }) => (
  <div className="relative flex flex-col items-center group flex-1">
    {/* Connecting Line (Desktop) */}
    {!isLast && (
      <div className="hidden lg:block absolute top-[45px] left-[calc(50%+40px)] w-[calc(100%-80px)] h-[2px] bg-gradient-to-r from-primary/50 to-indigo-500/20 z-0" />
    )}

    {/* Step Icon & Number */}
    <div className="relative z-10 mb-8">
      <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(var(--primary),0.1)] transition-all duration-500 relative overflow-hidden">
        {/* Subtle background glow for icon */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {React.cloneElement(icon, { className: "text-primary group-hover:scale-110 transition-transform duration-500", size: 32 })}
      </div>
      <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center text-xs font-black text-white shadow-xl z-20">
        0{number}
      </div>
    </div>

    {/* Step Content Card */}
    <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl text-center group-hover:bg-slate-800 group-hover:border-secondary transition-all duration-300 w-full max-w-[280px]">
      <h4 className="text-lg font-bold text-white mb-3 tracking-tight group-hover:text-primary transition-colors">{title}</h4>
      <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

const HowItWorks = () => {
  const steps = [
    {
      icon: <PlusCircle />,
      title: "Create Project",
      description: "Initialize your workspace and define project milestones to get started."
    },
    {
      icon: <UserPlus />,
      title: "Add Team",
      description: "Invite contributors and assign granular roles for secure collaboration."
    },
    {
      icon: <Ticket />,
      title: "Log Issues",
      description: "Capture bugs and feature requests with rich context and attachments."
    },
    {
      icon: <Kanban />,
      title: "Track Flow",
      description: "Monitor progress in real-time using our high-performance Kanban board."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            Process
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            How TrackFlow Works
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Our streamlined workflow is designed to get your team from "reported" to "resolved" faster than ever before.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-start justify-between relative">
          {steps.map((step, index) => (
            <Step 
              key={index} 
              number={index + 1} 
              {...step} 
              isLast={index === steps.length - 1}
            />
          ))}
        </div>

        {/* Feature Teaser */}
        <div className="mt-20 flex justify-center">
           <Link to="/docs" className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer group">
              <span className="text-sm font-medium">Want a deep dive? Read the documentation →</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
