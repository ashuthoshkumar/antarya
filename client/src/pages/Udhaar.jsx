import { useState, useEffect } from 'react';
import api from '../api';
import { CheckCircle, IndianRupee } from 'lucide-react';



export default function Udhaar() {
  const [udhaarList, setUdhaarList] = useState([]);
  
  useEffect(() => { loadUdhaar(); }, []);
  
  const loadUdhaar = async () => {
    const res = await api.get('/udhaar');
    setUdhaarList(res.data);
  };
  
  const markPaid = async (id) => {
    await api.put(`/udhaar/${id}/pay`);
    loadUdhaar();
  };
  
  const totalPending = udhaarList.filter(u => u.status === 'pending').reduce((s, u) => s + (u.amount || 0), 0);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Udhaar Management</h1>
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-bold">
          Total Pending: ₹{totalPending}
        </div>
      </div>
      
      <div className="grid gap-3">
        {udhaarList.filter(u => u.status === 'pending').map(u => (
          <div key={u.id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{u.customer}</h3>
                <span className="text-gray-400 text-sm">{new Date(u.date).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-500 text-sm">{u.items?.join(', ')}</p>
              <div className="flex items-center gap-1 text-red-600 font-bold mt-1">
                <IndianRupee size={16} />
                <span className="text-xl">{u.amount}</span>
              </div>
            </div>
            <button onClick={() => markPaid(u.id)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700">
              <CheckCircle size={18} />
              Paaida Karo
            </button>
          </div>
        ))}
        
        {udhaarList.filter(u => u.status === 'pending').length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">Koi udhaar nahi hai! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}