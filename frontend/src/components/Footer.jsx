import React from 'react';
import { Bug, Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#09090b] border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Bug className="text-primary" size={24} />
              <span className="text-2xl font-bold text-white tracking-tight">TrackFlow</span>
            </div>
            <p className="text-zinc-400 max-w-sm leading-relaxed">
              The modern bug tracking and issue management system built for high-performance teams. 
              Manage projects, track tasks, and collaborate in real-time.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><Link to="/signup" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link to="/changelog" className="hover:text-primary transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-zinc-500">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-xs text-zinc-600">
              © 2026 TrackFlow Technologies Inc. All rights reserved.
            </p>
            <p className="text-xs text-zinc-600 font-medium">
              Built with ❤️ by Sahithya
            </p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-600 hover:text-white transition-colors"><Github size={20} /></a>
            <a href="#" className="text-zinc-600 hover:text-white transition-colors"><Twitter size={20} /></a>
            <a href="#" className="text-zinc-600 hover:text-white transition-colors"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
