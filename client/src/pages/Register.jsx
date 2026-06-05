import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Store, User, Phone, Lock, MapPin, ArrowLeft, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

export default function Register() {
  const location = useLocation();
  const prefillPhone = location.state?.phone || '';
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    phone: prefillPhone,
    pin: '',
    confirmPin: '',
    shopName: '',
    shopAddress: '',
    shopType: 'kirana'
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateStep1 = () => {
    if (!form.name.trim()) return 'Apna naam daaliye';
    if (!form.phone.trim()) return 'Phone number daaliye';
    if (!/^[6-9]\d{9}$/.test(form.phone)) return 'Sahi 10-digit phone number daaliye';
    if (!form.pin || form.pin.length !== 4) return '4-digit PIN daaliye';
    if (form.pin !== form.confirmPin) return 'PIN match nahi ho raha';
    return null;
  };

  const validateStep2 = () => {
    if (!form.shopName.trim()) return 'Dukan ka naam daaliye';
    if (!form.shopAddress.trim()) return 'Dukan ka address daaliye';
    return null;
  };

  const nextStep = () => {
    const err = validateStep1();
    if (err) {
      setError(err);
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateStep2();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        phone: form.phone,
        pin: form.pin,
        name: form.name,
        shopName: form.shopName,
        shopAddress: form.shopAddress,
        shopType: form.shopType
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900">
        <div className="text-center text-white">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle size={40} className="text-green-300" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Registration Successful!</h2>
          <p className="text-green-200">Dashboard par le ja rahe hain...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900" />
      
      <div className="w-full relative z-10 flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div className="text-center mb-6">
            <Store size={32} className="text-white mx-auto mb-2" />
            <h1 className="text-3xl font-bold text-white">Register</h1>
            <p className="text-blue-200">Apni dukan register karein</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Step {step} of 2</h2>
              <span className="text-blue-300 text-sm">{step === 1 ? 'Personal Details' : 'Shop Details'}</span>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-3 rounded-xl mb-4 text-sm">
                {error}
              </div>
            )}

            {step === 1 ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                    <input
                      value={form.name}
                      onChange={e => handleChange('name', e.target.value)}
                      placeholder="Ramesh Kumar"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => handleChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9876543210"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">Create PIN (4 digits)</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                    <input
                      type="password"
                      value={form.pin}
                      onChange={e => handleChange('pin', e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="••••"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 tracking-widest"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">Confirm PIN</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                    <input
                      type="password"
                      value={form.confirmPin}
                      onChange={e => handleChange('confirmPin', e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="••••"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400 tracking-widest"
                    />
                  </div>
                </div>

                <button
                  onClick={nextStep}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                  Next Step
                  <ArrowRight size={20} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">Shop Name</label>
                  <div className="relative">
                    <Store size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                    <input
                      value={form.shopName}
                      onChange={e => handleChange('shopName', e.target.value)}
                      placeholder="Ramesh Kirana Store"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">Shop Address</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
                    <input
                      value={form.shopAddress}
                      onChange={e => handleChange('shopAddress', e.target.value)}
                      placeholder="Gali No 4, Main Market"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-blue-300/50 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-blue-200 text-sm font-medium mb-2">Shop Type</label>
                  <select
                    value={form.shopType}
                    onChange={e => handleChange('shopType', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-400"
                  >
                    <option value="kirana" className="text-gray-800">Kirana Store</option>
                    <option value="general" className="text-gray-800">General Store</option>
                    <option value="dairy" className="text-gray-800">Dairy & Milk</option>
                    <option value="medical" className="text-gray-800">Medical Store</option>
                    <option value="other" className="text-gray-800">Other</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 border border-white/20"
                  >
                    <ArrowLeft size={20} />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : <Store size={20} />}
                    {loading ? 'Creating...' : 'Create Store'}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-blue-300/60 text-sm">
                Pehle se account hai?{' '}
                <Link to="/" className="text-blue-300 hover:text-white font-medium">Login karein</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}