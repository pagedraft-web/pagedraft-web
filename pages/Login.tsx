
import React, { useState } from 'react';
import { pb, authService } from '../services/pocketbase';
import Input from '../components/Input';
import Button from '../components/Button';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await pb.collection('users').authWithPassword(email, password);
      window.location.hash = '#/profile';
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setLoading(true);
    try {
      await authService.requestPasswordReset(email);
      setSuccess('Password reset link sent to your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      await authService.authWithOAuth2(provider);
      window.location.hash = '#/profile';
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12 bg-white">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black tracking-tighter mb-3 uppercase">WELCOME BACK</h2>
          <p className="text-gray-500 font-medium">Continue your journey with PageDraft</p>
        </div>

        <div className="bg-white p-8 md:p-12 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          {error && <div className="mb-6 p-4 bg-orange-50 text-orange-800 text-xs border-l-4 border-orange-500 font-bold">{error}</div>}
          {success && <div className="mb-6 p-4 bg-green-50 text-green-800 text-xs border-l-4 border-green-500 font-bold">{success}</div>}
          
          <form onSubmit={handleLogin}>
            <Input label="Email Address" type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div className="relative">
              <Input label="Password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[38px] text-gray-400 hover:text-orange-500">
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            
            <div className="flex items-center justify-between mb-8">
              <label className="flex items-center text-xs text-gray-500 cursor-pointer">
                <input type="checkbox" className="mr-2 accent-orange-500 w-4 h-4" />
                <span>Remember me</span>
              </label>
              <button onClick={handleResetPassword} className="text-xs font-bold text-orange-500 hover:text-black">Forgot password?</button>
            </div>
            
            <Button variant="primary" fullWidth isLoading={loading} type="submit" className="h-12">
              Sign In
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-4 text-gray-300">
            <div className="h-[1px] flex-1 bg-gray-100"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Social Access</span>
            <div className="h-[1px] flex-1 bg-gray-100"></div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button onClick={() => handleSocialLogin('google')} className="flex items-center justify-center py-2 border-2 border-gray-100 hover:border-black transition-colors font-bold text-xs">
              Google
            </button>
            <button onClick={() => handleSocialLogin('github')} className="flex items-center justify-center py-2 border-2 border-gray-100 hover:border-black transition-colors font-bold text-xs">
              GitHub
            </button>
          </div>
          
          <p className="mt-8 text-center text-gray-500 text-sm">
            No account? <a href="#/register" className="font-bold text-black border-b-2 border-orange-500 ml-1">Register now</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
