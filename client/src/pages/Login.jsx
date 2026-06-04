import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const navigate = useNavigate();
  
  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { phone, pin });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      alert('PIN galat hai! Try 1234');
    }
  };
  
  return (
    <div className="min-h-screen bg-blue-700 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-2">ANTARYA</h1>
        <p className="text-center text-gray-500 mb-6">Apki Dukan Ka Digital Dimaag</p>
        
        <input className="w-full p-3 border rounded-lg mb-3" 
          placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
        <input className="w-full p-3 border rounded-lg mb-4" type="password"
          placeholder="PIN (1234)" value={pin} onChange={e => setPin(e.target.value)} />
        
        <button onClick={handleLogin} 
          className="w-full bg-blue-700 text-white p-3 rounded-lg font-bold hover:bg-blue-800">
          Login
        </button>
      </div>
    </div>
  );
}