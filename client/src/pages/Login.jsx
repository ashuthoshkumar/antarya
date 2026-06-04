import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, Store, Phone, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
    const savedPhone = localStorage.getItem('savedPhone');
    if (savedPhone) {
      setPhone(savedPhone);
      setRememberMe(true);
    }
  }, [navigate]);

  const validatePhone = (num) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(num);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!phone.trim()) {
      setError('Phone number daaliye');
      return;
    }
    if (!validatePhone(phone)) {
      setError('Sahi phone number daaliye (10 digits)');
      return;
    }
    if (!pin.trim()) {
      setError('PIN daaliye');
      return;
    }
    if (pin.length !== 4) {
      setError('PIN 4 digits ka hona chahiye');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { phone, pin });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      if (rememberMe) {
        localStorage.setItem('savedPhone', phone);
      } else {
        localStorage.removeItem('savedPhone');
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Server check karo.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(value);
    setError('');
  };

  const handlePinChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPin(value);
    setError('');
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/images/bg.jpg), url(https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=1920&q=80)' 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/85 to-indigo-900/90" />
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-16 text-white">
        <div className="mb-8">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-6">
            <Store size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">ANTARYA</h1>
          <p className="text-2xl font-light text-blue-100 mb-6">Apki Dukan Ka Digital Dimaag</p>
          <p className="text-blue-200 text-lg leading-relaxed max-w-md">
            12 million+ kirana stores ke liye banaya gaya AI-powered platform. 
            Stock, udhaar, aur profit — sab ek jagah.
          </p>
        </div>
        
        <div className="flex gap-8 mt-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">12M+</p>
            <p className="text-blue-200 text-sm">Kirana Stores</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">40%</p>
            <p className="text-blue-200 text-sm">Waste Reduce</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">60%</p>
            <p className="text-blue-200 text-sm">Udhaar Recover</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 relative z-10 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center mx-auto mb-4">
              <Store size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">ANTARYA</h1>
            <p className="text-blue-200">Apki Dukan Ka Digital Dimaag</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back!</h2>
            <p className="text-blue-200 mb-6">Apne store mein login karein</p>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                {error}
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
                    onChange={handlePhoneChange}
                    placeholder="9876543210"
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                  />
                  {phone.length === 10 && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400 text-xs font-medium">✓ Valid</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-blue-200 text-sm font-medium mb-2">PIN (4 digits)</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={pin}
                    onChange={handlePinChange}
                    placeholder="••••"
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                  >
                    {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-400"
                  />
                  <span className="text-blue-200 text-sm">Remember me</span>
                </label>
                <button type="button" className="text-blue-300 hover:text-white text-sm transition-colors">PIN bhool gaye?</button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-blue-300/60 text-sm">
                Nayi dukan?{' '}
                <Link to="/register" className="text-blue-300 hover:text-white font-medium transition-colors">
                  Register karein
                </Link>
              </p>
              <p className="text-blue-300/40 text-xs mt-2">
                Demo ke liye: Koi bhi phone + PIN <span className="text-blue-300 font-mono">1234</span>
              </p>
            </div>
          </div>

          <p className="text-center text-blue-300/40 text-xs mt-6">© 2026 ANTARYA. Made with ❤️ for Indian Kirana Stores</p>
        </div>
      </div>
    </div>
  );
}