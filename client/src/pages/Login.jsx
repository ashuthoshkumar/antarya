import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, Store, Phone, Lock, ArrowRight, Loader2, UserPlus } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/dashboard');
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setShowRegisterPrompt(false);

    if (!phone || phone.length !== 10) {
      setError('Sahi 10-digit phone number daaliye');
      return;
    }
    if (!pin || pin.length !== 4) {
      setError('4-digit PIN daaliye');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { phone, pin });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Server error';
      
      if (err.response?.status === 404) {
        setShowRegisterPrompt(true);
        setError('Account nahi mila. Naya account banayein.');
      } else {
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900" />
      
      <div className="w-full relative z-10 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Store size={40} className="text-white mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white">ANTARYA</h1>
            <p className="text-blue-200 mt-2">Apki Dukan Ka Digital Dimaag</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back!</h2>
            <p className="text-blue-200 mb-6">Apne store mein login karein</p>

            {error && (
              <div className={`px-4 py-3 rounded-xl mb-4 text-sm ${showRegisterPrompt ? 'bg-orange-500/20 border border-orange-500/30 text-orange-200' : 'bg-red-500/20 border border-red-500/30 text-red-200'}`}>
                {error}
              </div>
            )}

            {showRegisterPrompt && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-4">
                <p className="text-green-200 text-sm mb-3">Ye phone number register nahi hai.</p>
                <button
                  onClick={() => navigate('/register', { state: { phone } })}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <UserPlus size={20} />
                  Register Now
                </button>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => {
                      setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                      setShowRegisterPrompt(false);
                      setError('');
                    }}
                    placeholder="9876543210"
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">PIN (4 digits)</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={e => {
                      setPin(e.target.value.replace(/\D/g, '').slice(0, 4));
                      setError('');
                    }}
                    placeholder="••••"
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 tracking-widest"
                  />
                  <button type="button" onClick={() => setShowPin(!showPin)} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300">
                    {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-blue-300/60 text-sm">
                Naya store?{' '}
                <Link to="/register" className="text-blue-300 hover:text-white font-medium">Register karein</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}