import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  Ticket, 
  LayoutDashboard, 
  MessageSquare, 
  FolderPlus,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Layers,
  UserPlus,
  LogIn
} from 'lucide-react';

const sections = [
  {
    id: 'getting-started',
    title: '1. Getting Started',
    icon: <BookOpen />,
    items: [
      { text: 'Create your account using the signup page.', icon: <UserPlus size={16} /> },
      { text: 'Login with your credentials to access your secure workspace.', icon: <LogIn size={16} /> },
      { text: 'Access the dashboard to see an overview of your activity.', icon: <LayoutDashboard size={16} /> }
    ]
  },
  {
    id: 'create-project',
    title: '2. Creating a Project',
    icon: <FolderPlus />,
    items: [
      { text: 'Click the "New Project" button on the projects page or dashboard.', icon: <FolderPlus size={16} /> },
      { text: 'Fill in the project name, description, and initial settings.', icon: <ChevronRight size={16} /> },
      { text: 'Once saved, the project will appear in your dashboard.', icon: <CheckCircle2 size={16} /> }
    ]
  },
  {
    id: 'manage-team',
    title: '3. Managing Team',
    icon: <Users />,
    items: [
      { text: 'Invite team members by their email addresses.', icon: <UserPlus size={16} /> },
      { text: 'Assign granular roles like Admin, Manager, or Developer.', icon: <LayoutDashboard size={16} /> },
      { text: 'Manage member access and permissions within each project.', icon: <Users size={16} /> }
    ]
  },
  {
    id: 'create-tickets',
    title: '4. Creating Tickets',
    icon: <Ticket />,
    items: [
      { text: 'Log bugs, tasks, or feature requests as "Tickets".', icon: <Ticket size={16} /> },
      { text: 'Set priority levels (Low, Medium, High, Urgent).', icon: <Clock size={16} /> },
      { text: 'Assign tickets to specific team members for accountability.', icon: <UserPlus size={16} /> }
    ]
  },
  {
    id: 'kanban-workflow',
    title: '5. Kanban Workflow',
    icon: <LayoutDashboard />,
    items: [
      { text: 'Visualize progress using the interactive Kanban board.', icon: <Layers size={16} /> },
      { text: 'Drag and drop tickets between columns (To Do → In Progress → Done).', icon: <ChevronRight size={16} /> },
      { text: 'Experience real-time updates across all connected team members.', icon: <Clock size={16} /> }
    ]
  },
  {
    id: 'comments-collaboration',
    title: '6. Comments & Collaboration',
    icon: <MessageSquare />,
    items: [
      { text: 'Add comments to tickets to discuss specific issues.', icon: <MessageSquare size={16} /> },
      { text: 'Track the full discussion history for better context.', icon: <Clock size={16} /> },
      { text: 'Upload attachments and screenshots to clarify problems.', icon: <ChevronRight size={16} /> }
    ]
  }
];

const Documentation = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 120,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white selection:bg-purple-500/30 relative">
      <style dangerouslySetInnerHTML={{ __html: `html { scroll-behavior: smooth; }` }} />
      
      {/* Subtle Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12 pb-20">
        {/* Header */}
        <header className="mt-12 mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
          
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              TrackFlow Documentation
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl leading-relaxed">
              Step-by-step guide to mastering the ultimate project management and issue tracking engine. Learn how to manage projects, track issues, and collaborate efficiently.
            </p>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Sticky Sidebar Navigation Panel */}
          <aside className="lg:w-72 flex-shrink-0 sticky top-20 h-fit bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 px-2">
              Navigation
            </div>
            <nav className="space-y-1">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(section.id);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    activeSection === section.id
                      ? 'bg-purple-500/20 text-purple-300 font-medium border border-purple-500/30 shadow-lg shadow-purple-500/5'
                      : 'text-slate-400 hover:bg-white/10 hover:text-white border border-transparent'
                  }`}
                >
                  {React.cloneElement(section.icon, { size: 18 })}
                  <span className="text-sm">{section.title.split('. ')[1]}</span>
                </a>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 space-y-16">
            {sections.map((section, sectionIdx) => (
              <section 
                key={section.id} 
                id={section.id}
                className="scroll-mt-32"
              >
                <div className="text-2xl font-semibold mb-6 flex items-center gap-2 text-white border-b border-white/10 pb-4">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                    {React.cloneElement(section.icon, { size: 24 })}
                  </div>
                  {section.title}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.items.map((item, idx) => (
                    <div 
                      key={idx}
                      className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:scale-[1.02] transition-all duration-300 hover:border-purple-500/30"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-purple-500/10 transition-all">
                        {React.cloneElement(item.icon, { className: 'text-slate-400 group-hover:text-purple-300 transition-colors' })}
                      </div>
                      <p className="text-slate-400 group-hover:text-slate-200 transition-colors leading-relaxed text-sm">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
