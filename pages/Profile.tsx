
import React, { useEffect, useState, useRef } from 'react';
import { pb, blogService, getFileUrl, authService } from '../services/pocketbase';
import { Post, Activity } from '../types';
import Button from '../components/Button';

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'activity'>('posts');
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(pb.authStore.model);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!pb.authStore.isValid) {
      window.location.hash = '#/login';
      return;
    }

    // Sync state if auth store changes (like after an avatar upload)
    const unsubscribe = pb.authStore.onChange((token, model) => {
      setUser(model);
    });

    const fetchData = async () => {
      setLoading(true);
      try {
        const [postsRes, activityRes] = await Promise.all([
          blogService.getPostsByAuthor(user?.id),
          blogService.getUserActivities(user?.id)
        ]);
        setUserPosts(postsRes.items as any);
        setActivities(activityRes.items as any);
      } catch (err) {
        console.error('Profile Data Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }

    return () => unsubscribe();
  }, [user?.id]);

  const handlePostDeleted = async (id: string) => {
    if (!confirm('Are you certain you wish to terminate this record?')) return;
    try {
      await blogService.deletePost(id);
      setUserPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert('Termination sequence failed.');
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('avatar', file);
        await authService.updateProfile(user.id, formData);
        // authRefresh inside updateProfile triggers the authStore listener
      } catch (err: any) {
        alert('Upload failed: ' + (err.message || 'Unknown error'));
      } finally {
        setUploading(false);
      }
    }
  };

  if (!user) return null;

  const userAvatar = getFileUrl(user, user.avatar, 'users');

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      {/* Header */}
      <div className="bg-black text-white p-12 md:p-20 mb-20 relative overflow-hidden flex flex-col md:flex-row items-center gap-12 border-4 border-black neo-shadow-orange">
        
        {/* Avatar Section */}
        <div className="relative group">
          <div 
            onClick={handleAvatarClick}
            className={`w-48 h-48 bg-orange-500 flex items-center justify-center text-white text-7xl font-black border-4 border-white z-10 cursor-pointer overflow-hidden transition-all duration-300 group-hover:scale-105 active:scale-95 ${uploading ? 'opacity-50' : 'opacity-100'}`}
          >
            {userAvatar ? (
              <img src={userAvatar} alt="Profile" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
            ) : (
              <span>{user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}</span>
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Change Avatar</span>
            </div>
            
            {uploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
        </div>

        <div className="flex-1 z-10 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 uppercase leading-[0.85]">
            {user.name || 'Anonymous'}
          </h1>
          <p className="text-orange-500 font-black uppercase tracking-widest text-sm mb-10">{user.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Button variant="secondary" className="px-8 py-3" onClick={() => window.location.hash = '#/create-post'}>
              New Draft
            </Button>
            <Button variant="outline" className="px-8 py-3 bg-white text-black hover:bg-orange-50 border-white" onClick={() => window.location.hash = '#/settings'}>
              Identity Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="flex border-b-4 border-black mb-16 gap-1 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('posts')}
          className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'posts' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
        >
          Draft Archives {!loading && `(${userPosts.length})`}
        </button>
        <button 
          onClick={() => setActiveTab('activity')}
          className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'activity' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
        >
          Activity Stream
        </button>
      </div>

      {loading ? (
        <div className="space-y-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-gray-50 border-2 border-black/5 animate-pulse" />
          ))}
        </div>
      ) : activeTab === 'posts' ? (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {userPosts.length > 0 ? userPosts.map(post => (
            <div key={post.id} className="group border-2 border-black p-8 hover:bg-gray-50 transition-all flex flex-col md:flex-row gap-10">
              <div className="w-full md:w-64 aspect-video bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                <img src={getFileUrl(post, post.image)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`}>{post.status}</span>
                  <span className="text-xs text-gray-300">|</span>
                  <span className="text-[10px] font-black uppercase text-gray-400">{new Date(post.created).toLocaleDateString()}</span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 group-hover:text-orange-500 transition-colors">
                  <a href={`#/blog/${post.slug || post.id}`}>{post.title}</a>
                </h3>
                <div className="flex gap-6">
                  <a href={`#/edit-post/${post.id}`} className="text-[10px] font-black uppercase tracking-tighter border-b-2 border-black hover:text-orange-500 transition-colors">Modify Content</a>
                  <button onClick={() => handlePostDeleted(post.id)} className="text-[10px] font-black uppercase tracking-tighter text-red-500 border-b-2 border-transparent hover:border-red-500 transition-colors">Terminate Record</button>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center py-24 uppercase font-black text-gray-300 border-4 border-dashed border-gray-100">
              Archive Currently Empty
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {activities.length > 0 ? activities.map(act => (
            <div key={act.id} className="flex items-center gap-6 p-6 border-l-8 border-black bg-white group hover:bg-black transition-all shadow-sm">
              <div className="w-10 h-10 flex-shrink-0 bg-orange-500 border-2 border-black flex items-center justify-center text-white font-black uppercase text-[10px] group-hover:scale-110 transition-transform">
                {act.type.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-black uppercase tracking-tight group-hover:text-white transition-colors">
                  Action: <span className="text-orange-500">{act.description}</span>
                </p>
                <a href={act.link} className="text-[10px] font-black opacity-50 uppercase tracking-widest group-hover:text-orange-500 group-hover:opacity-100 transition-all">Deep Link</a>
              </div>
              <div className="text-[10px] font-black opacity-30 group-hover:text-white group-hover:opacity-50 uppercase">
                {new Date(act.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          )) : (
            <div className="text-center py-24 uppercase font-black text-gray-300 border-4 border-dashed border-gray-100">
              Stream Silent
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
