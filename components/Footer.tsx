
import React from 'react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t-2 border-black pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Logo size={28} className="text-black" />
            <h2 className="text-2xl font-black tracking-tighter text-black uppercase">
              PAGE<span className="text-orange-500">DRAFT</span>
            </h2>
          </div>
          <p className="text-gray-500 max-w-sm mb-6 font-medium leading-relaxed">
            The professional choice for creators, writers, and developers. Built for the modern web with performance and aesthetics at the core.
          </p>
        </div>
        
        <div>
          <h3 className="font-black mb-6 uppercase text-xs tracking-widest text-black">Platform</h3>
          <ul className="space-y-3 text-sm font-bold uppercase tracking-tight text-gray-500">
            <li><a href="#/" className="hover:text-orange-500 transition-colors">Home</a></li>
            <li><a href="#/blog" className="hover:text-orange-500 transition-colors">Blog</a></li>
            <li><a href="#/login" className="hover:text-orange-500 transition-colors">Login</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-black mb-6 uppercase text-xs tracking-widest text-black">Connect</h3>
          <ul className="space-y-3 text-sm font-bold uppercase tracking-tight text-gray-500">
            <li><a href="#" className="hover:text-orange-500 transition-colors">Twitter (X)</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">LinkedIn</a></li>
            <li><a href="#" className="hover:text-orange-500 transition-colors">GitHub</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center border-t border-gray-100 pt-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
        <p>&copy; {new Date().getFullYear()} PageDraft. Engineered for visionaries.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
          <a href="#/terms" className="hover:text-orange-500 transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
