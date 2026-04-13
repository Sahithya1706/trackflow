import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeatureCard from '../components/FeatureCard';
import HowItWorks from '../components/HowItWorks';
import AnimatedBackground from '../components/AnimatedBackground';
import { 
  Bug, 
  Layout, 
  Users, 
  Zap, 
  ShieldCheck, 
  Paperclip, 
  ChevronRight,
  ArrowRight,
  Target,
  Clock,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FloatingCard = ({ icon, text, delay, position }) => (
  <div className={`absolute ${position} glass animate-in shadow-2xl rounded-xl p-3 flex items-center gap-3 z-20 border border-white/10`} style={{ animationDelay: `${delay}ms` }}>
    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
      {icon}
    </div>
    <span className="text-xs font-bold text-white whitespace-nowrap">{text}</span>
  </div>
);

const Home = () => {
  const features = [
    {
      icon: <Bug size={24} />,
      title: "Issue Tracking",
      description: "Robust bug tracking with customizable fields, priorities, and labels to keep your team organized."
    },
    {
      icon: <Layout size={24} />,
      title: "Kanban Board",
      description: "Visualize your workflow with a modern drag-and-drop board. Track progress from To-Do to Done."
    },
    {
      icon: <Users size={24} />,
      title: "Team Collaboration",
      description: "Assign tickets, add comments, and tag teammates. Keep everyone in the loop with real-time updates."
    },
    {
      icon: <Zap size={24} />,
      title: "Real-time Updates",
      description: "Instant notifications and dashboard updates ensure you never miss a critical bug or update."
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Smart Permissions",
      description: "Control access intelligently across your team. Assign permissions for viewing, editing, and managing projects with ease."
    },
    {
      icon: <Paperclip size={24} />,
      title: "File Attachments",
      description: "Upload screenshots and logs directly to issues. Provide full context for faster resolutions."
    }
  ];

  return (
    <div className="bg-background min-h-screen relative">
      <AnimatedBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Content */}
            <div className="text-left space-y-8">
              <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
                Track Bugs.<br />
                Manage Projects.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">
                  Deliver Faster.
                </span>
              </h1>
              
              <p className="text-zinc-400 text-lg md:text-xl max-w-xl leading-relaxed">
                The modern issue management system built for high-performance engineering teams. 
                Focus on shipping quality code while TrackFlow handles the rest.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link 
                  to="/signup" 
                  className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group"
                >
                  Get Started for Free
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href="#features" 
                  className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-2xl border border-white/5 transition-all flex items-center justify-center gap-2"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Right Column: Visual Component */}
            <div className="relative group perspective-1000">
              {/* Floating Mini Cards */}
              <FloatingCard 
                icon={<CheckCircle2 size={16} />} 
                text="Bug Fixed #452" 
                delay={200} 
                position="-top-6 -left-12" 
              />
              <FloatingCard 
                icon={<MessageSquare size={16} />} 
                text="New Comment on Task" 
                delay={400} 
                position="top-1/2 -right-16" 
              />
              <FloatingCard 
                icon={<Users size={16} />} 
                text="Member Assigned" 
                delay={600} 
                position="-bottom-8 left-12" 
              />

              {/* Main Dashboard Preview Card */}
              <div className="relative z-10 glass-card rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_80px_rgba(var(--primary),0.15)] border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent backdrop-blur-2xl transition-transform duration-700 group-hover:rotate-1 group-hover:scale-[1.02]">
                <div className="flex justify-between items-center mb-10">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Project Overview</h3>
                    <p className="text-sm text-zinc-500">TrackFlow Web App App</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 text-primary">
                    <BarChart3 size={24} />
                  </div>
                </div>

                <div className="space-y-10">
                  {/* Progress Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-400 font-medium">Completion Progress</span>
                      <span className="text-primary font-bold">75%</span>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full w-3/4 bg-gradient-to-r from-primary to-indigo-500 rounded-full shadow-[0_0_20px_rgba(var(--primary),0.5)]" />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active</p>
                      <p className="text-2xl font-bold text-white">12</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Done</p>
                      <p className="text-2xl font-bold text-white">48</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Team</p>
                      <div className="flex -space-x-2 pt-1">
                        {[1,2,3].map(i => <div key={i} className="w-7 h-7 rounded-full bg-zinc-800 border-2 border-[#121214]" />)}
                        <div className="w-7 h-7 rounded-full bg-primary/20 border-2 border-[#121214] flex items-center justify-center text-[10px] font-bold text-primary">+2</div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Item Mock */}
                  <div className="bg-white/5 rounded-2xl p-5 flex items-center justify-between border border-white/5 group-hover:bg-white/[0.08] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                        <TrendingUp size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Velocity Increase</p>
                        <p className="text-xs text-zinc-500">Up 12% from last week</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-zinc-600" />
                  </div>
                </div>
              </div>
              
              {/* Extra Glow Behind Card */}
              <div className="absolute inset-0 bg-primary/10 rounded-[3rem] blur-[100px] -z-10 group-hover:bg-primary/20 transition-all duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-4 text-center">Features</h2>
            <h3 className="text-4xl font-extrabold text-white mb-4">Everything you need to ship.</h3>
            <p className="text-zinc-500 max-w-xl mx-auto text-lg leading-relaxed">
              TrackFlow comes packed with all the tools your team needs to manage complex software projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* About Section */}
      <section id="about" className="py-24 relative overflow-hidden bg-white/[0.01]">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div className="space-y-8">
                  <div>
                    <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-4">About TrackFlow</h2>
                    <h3 className="text-4xl font-extrabold text-white mb-6">Designed for Collaboration</h3>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                      TrackFlow was built with a single mission: to provide teams with a Jira-like powerful management system without the bloat. 
                      We focus on speed, team collaboration, and providing a clean mental model for your engineering workflow.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                     <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-primary" size={20} />
                        <span className="text-zinc-300 font-medium">Fast & Reliable</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-primary" size={20} />
                        <span className="text-zinc-300 font-medium">Intuitive UX</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-primary" size={20} />
                        <span className="text-zinc-300 font-medium">Team First</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <CheckCircle2 className="text-primary" size={20} />
                        <span className="text-zinc-300 font-medium">Developer Built</span>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="glass-card p-6 rounded-3xl mt-8">
                     <Target className="text-primary mb-4" size={32} />
                     <h4 className="text-white font-bold mb-2 text-xl">Goal Oriented</h4>
                     <p className="text-zinc-500 text-sm">Focus on delivering milestones and project objectives.</p>
                  </div>
                  <div className="glass-card p-6 rounded-3xl">
                     <Clock className="text-indigo-400 mb-4" size={32} />
                     <h4 className="text-white font-bold mb-2 text-xl">Efficiency</h4>
                     <p className="text-zinc-500 text-sm">Reduce cycle time with optimized ticket workflows.</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-12 md:p-20 text-center relative z-10 overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32" />
             <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
               Ready to streamline your workflow?
             </h2>
             <p className="text-zinc-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
               Join over 1,000+ teams managing their projects with TrackFlow. 
               Free for individuals and small teams.
             </p>
             <Link 
              to="/signup" 
              className="px-10 py-5 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl transition-all shadow-xl shadow-primary/20 inline-flex items-center gap-3 group"
            >
              Start Bug Tracking Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
