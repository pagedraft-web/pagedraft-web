
import React, { useState } from 'react';
import { pb } from '../services/pocketbase';
import Input from '../components/Input';
import Button from '../components/Button';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Create user
      await pb.collection('users').create({
        ...formData,
        emailVisibility: true,
      });
      
      // Automatically login after registration
      await pb.collection('users').authWithPassword(formData.email, formData.password);
      
      // Redirect to profile
      window.location.hash = '#/profile';
    } catch (err: any) {
      setError(err.message || 'Registration failed. This email might already be in use.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12 bg-white">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black tracking-tighter mb-3 uppercase">JOIN PAGEDRAFT</h2>
          <p className="text-gray-500 font-medium">Start drafting your professional future today</p>
        </div>

        <div className="bg-white p-8 md:p-12 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <form onSubmit={handleRegister}>
            {error && (
              <div className="mb-6 p-4 bg-orange-50 text-orange-800 text-sm border-l-4 border-orange-500 font-medium animate-in slide-in-from-left-2">
                {error}
              </div>
            )}
            
            <Input 
              label="Full Name" 
              name="name"
              placeholder="John Doe" 
              value={formData.name}
              onChange={handleChange}
              required
            />
            
            <Input 
              label="Email Address" 
              name="email"
              type="email" 
              placeholder="john@example.com" 
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              <Input 
                label="Password" 
                name="password"
                type="password" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                required
              />

              <Input 
                label="Confirm" 
                name="passwordConfirm"
                type="password" 
                placeholder="••••••••" 
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mt-2 mb-8 p-4 bg-gray-50 border border-gray-100 rounded text-[10px] text-gray-400 leading-relaxed">
              By creating an account, you agree to our <a href="#/terms" className="underline hover:text-orange-500">Terms of Service</a> and <a href="#/privacy" className="underline hover:text-orange-500">Privacy Policy</a>. We'll handle your data securely.
            </div>
            
            <Button variant="secondary" fullWidth isLoading={loading} type="submit" className="h-12 text-lg">
              Create My Account
            </Button>
          </form>
          
          <div className="mt-8 flex items-center gap-4 text-gray-300">
            <div className="h-[1px] flex-1 bg-gray-100"></div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">or</span>
            <div className="h-[1px] flex-1 bg-gray-100"></div>
          </div>
          
          <p className="mt-8 text-center text-gray-500 text-sm">
            Already have an account? <a href="#/login" className="font-bold text-black border-b-2 border-orange-500 hover:text-orange-500 transition-colors ml-1">Log in here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
