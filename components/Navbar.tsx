
import React, { useState, useEffect } from 'react';
import { pb, getFileUrl } from '../services/pocketbase';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(pb.authStore.model);

  useEffect(() => {
    // Listen to PB auth changes globally
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setUser(model);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    pb.authStore.clear();
    window.location.hash = '#/';
  };

  const userAvatar = user?.avatar ? getFileUrl(user, user.avatar, 'users') : null;

  const NavLinks = () => (
    <>
      <a href="#/" className="text-black hover:text-orange-500 transition-colors py-2 md:py-0 font-black uppercase tracking-widest text-xs border-b-2 border-transparent hover:border-orange-500">Home</a>
      <a href="#/blog" className="text-black hover:text-orange-500 transition-colors py-2 md:py-0 font-black uppercase tracking-widest text-xs border-b-2 border-transparent hover:border-orange-500">Blog</a>
      {user ? (
        <>
          <a href="#/profile" className="flex items-center gap-3 text-black hover:text-orange-500 transition-colors py-2 md:py-0 font-black uppercase tracking-widest text-xs border-b-2 border-transparent hover:border-orange-500">
            {userAvatar ? (
              <img src={userAvatar} alt="Profile" className="w-6 h-6 object-cover border-2 border-black" />
            ) : (
              <div className="w-6 h-6 bg-orange-500 text-white flex items-center justify-center text-[10px] border-2 border-black">
                {user.name?.charAt(0) || user.email.charAt(0)}
              </div>
            )}
            Profile
          </a>
          <button onClick={handleLogout} className="text-black text-left hover:text-orange-500 transition-colors py-2 md:py-0 font-black uppercase tracking-widest text-xs border-b-2 border-transparent hover:border-orange-500">Logout</button>
        </>
      ) : (
        <>
          <a href="#/login" className="text-black hover:text-orange-500 transition-colors py-2 md:py-0 font-black uppercase tracking-widest text-xs border-b-2 border-transparent hover:border-orange-500">Login</a>
          <a href="#/register" className="bg-orange-500 text-white px-6 py-2 border-2 border-black neo-shadow hover:bg-black transition-all text-center font-black uppercase tracking-tighter text-sm">Join</a>
        </>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-4 border-black py-4 px-6 md:px-12 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <a href="#/" className="flex items-center gap-3 hover:scale-105 transition-transform">
          <Logo className="text-black" size={36} />
          <span className="text-2xl font-black tracking-tighter text-black uppercase">
            PAGE<span className="text-orange-500">DRAFT</span>
          </span>
        </a>
      </div>

      <div className="hidden md:flex items-center gap-10">
        <NavLinks />
      </div>

      <button className="md:hidden text-black p-2 border-2 border-black neo-shadow bg-white font-black text-xs" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'CLOSE' : 'MENU'}
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border-b-4 border-black flex flex-col p-8 gap-6 md:hidden animate-in fade-in slide-in-from-top-4">
          <NavLinks />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
