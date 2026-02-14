
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import PostDetail from './pages/PostDetail';
import Settings from './pages/Settings';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import { updateSEO } from './utils/seo';
import { pb } from './services/pocketbase';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');
  const [isAuth, setIsAuth] = useState(pb.authStore.isValid);

  useEffect(() => {
    // Listen to PB auth changes globally
    const removeListener = pb.authStore.onChange((token, model) => {
      setIsAuth(!!token);
    });

    const handleHashChange = () => {
      const newHash = window.location.hash || '#/';
      setCurrentPath(newHash);
      window.scrollTo(0, 0);

      // SEO Reset on non-blog detail pages
      if (!newHash.startsWith('#/blog/')) {
        updateSEO({});
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    if (!window.location.hash.startsWith('#/blog/')) {
      updateSEO({});
    }
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      removeListener();
    };
  }, []);

  const renderPage = () => {
    const path = currentPath.split('?')[0];
    
    // Auth Protected Routes
    const protectedRoutes = ['#/profile', '#/create-post', '#/settings', '#/edit-post/'];
    const isProtected = protectedRoutes.some(route => path.startsWith(route));

    if (isProtected && !isAuth) {
      // Redirect to login if trying to access protected content
      window.location.hash = '#/login';
      return <Login />;
    }

    // Auth Exclusion (don't show login/register to logged in users)
    if ((path === '#/login' || path === '#/register') && isAuth) {
      window.location.hash = '#/profile';
      return <Profile />;
    }

    // Route Definitions
    if (path === '#/' || path === '') return <Home />;
    if (path === '#/blog') return <Blog />;
    if (path === '#/login') return <Login />;
    if (path === '#/register') return <Register />;
    if (path === '#/profile') return <Profile />;
    if (path === '#/create-post') return <CreatePost />;
    if (path === '#/settings') return <Settings />;
    if (path === '#/privacy') return <PrivacyPolicy />;
    if (path === '#/terms') return <TermsOfService />;
    
    // Dynamic Parameter Routes
    if (path.startsWith('#/edit-post/')) {
      const id = path.replace('#/edit-post/', '');
      return <CreatePost editId={id} />;
    }
    
    if (path.startsWith('#/blog/')) {
      const slug = path.replace('#/blog/', '');
      if (slug) return <PostDetail slug={slug} />;
    }
    
    // Catch-all Fallback
    return <Home />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
