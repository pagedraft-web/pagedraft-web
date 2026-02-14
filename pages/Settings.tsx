
import React, { useState } from 'react';
import { pb, authService } from '../services/pocketbase';
import Input from '../components/Input';
import Button from '../components/Button';

const Settings: React.FC = () => {
  const user = pb.authStore.model;
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  if (!user) {
    window.location.hash = '#/login';
    return null;
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await authService.updateProfile(user.id, { name, username });
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Update failed.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter uppercase text-black">Settings</h1>
        <p className="text-gray-500 font-medium">Manage your identity and preferences.</p>
      </div>

      <div className="bg-white border-2 border-black p-8 md:p-12 shadow-[15px_15px_0px_0px_rgba(249,115,22,1)]">
        {message.text && (
          <div className={`mb-8 p-4 font-black uppercase text-xs border-l-4 ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-500' : 'bg-orange-50 text-orange-700 border-orange-500'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleUpdate}>
          <div className="space-y-8">
            <Input label="Public Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Display name" />
            <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="unique_handle" />
            
            <div className="pt-6 border-t border-gray-100">
              <div className="flex items-center gap-6">
                <Button variant="primary" className="px-10 h-14" isLoading={loading} type="submit">
                  Save Changes
                </Button>
                <a href="#/profile" className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                  Cancel
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>
      
      <div className="mt-12 bg-orange-50 p-8 border-2 border-black border-dashed">
        <h4 className="font-black uppercase tracking-tighter text-black mb-2">Account Security</h4>
        <p className="text-sm text-gray-600 mb-6">Need to update your password or verify your email? Use our secure portal.</p>
        <Button variant="outline" className="bg-white text-xs px-6 py-2">
          Request Security Audit
        </Button>
      </div>
    </div>
  );
};

export default Settings;
