import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TrendingUp, TrendingDown, Package, Users, AlertTriangle } from 'lucide-react';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export default function Dashboard() {
  const [stats, setStats] = useState({ sales: 0, udhaar: 0, lowStock: 0, profit: 0 });
  const [inventory, setInventory] = useState([]);
  
  useEffect(() => { loadData(); }, []);
  
  const loadData = async () => {
    try {
      const [invRes, salesRes, udhaarRes] = await Promise.all([
        api.get('/inventory'),
        api.get('/sales'),
        api.get('/udhaar')
      ]);
      
      setInventory(invRes.data);
      
      const today = new Date().toDateString();
      const todaySales = salesRes.data.filter(s => new Date(s.date).toDateString() === today);
      const totalSales = todaySales.reduce((sum, s) => sum + (s.total || 0), 0);
      const pendingUdhaar = udhaarRes.data.filter(u => u.status === 'pending').reduce((sum, u) => sum + (u.amount || 0), 0);
      const lowStock = invRes.data.filter(i => i.quantity < 10).length;
      const profit = Math.round(totalSales * 0.15);
      
      setStats({ sales: totalSales, udhaar: pendingUdhaar, lowStock, profit });
    } catch (err) {
      console.log('Using empty data');
    }
  };
  
  const seedData = async () => {
    const demoItems = [
      { name: 'Aashirvaad Atta 5kg', quantity: 45, price: 245, category: 'Grocery' },
      { name: 'Tata Salt 1kg', quantity: 8, price: 28, category: 'Grocery' },
      { name: 'Fortune Oil 1L', quantity: 12, price: 120, category: 'Grocery' },
      { name: 'Amul Milk 500ml', quantity: 24, price: 28, category: 'Dairy' },
      { name: 'Parle G Biscuit', quantity: 60, price: 10, category: 'Snacks' },
      { name: 'Dove Soap', quantity: 5, price: 45, category: 'Personal Care' },
      { name: 'Colgate 100g', quantity: 15, price: 55, category: 'Personal Care' },
      { name: 'Basmati Rice 1kg', quantity: 3, price: 180, category: 'Grocery' },
    ];
    
    for (const item of demoItems) {
      await api.post('/inventory', item);
    }
    
    const customers = [
      { name: 'Mohan Lal', phone: '9876543210', area: 'Gali No 4' },
      { name: 'Priya Sharma', phone: '9876543211', area: 'Main Road' },
      { name: 'Raju Chaiwala', phone: '9876543212', area: 'Market' },
    ];
    for (const c of customers) await api.post('/customers', c);
    
    alert('Demo data loaded! Refresh page.');
    loadData();
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button onClick={seedData} className="bg-green-600 text-white px-4 py-2 rounded-lg">
          Load Demo Data
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={TrendingUp} label="Today's Sales" value={`₹${stats.sales}`} color="bg-green-100 text-green-700" />
        <StatCard icon={TrendingDown} label="Pending Udhaar" value={`₹${stats.udhaar}`} color="bg-red-100 text-red-700" />
        <StatCard icon={Package} label="Low Stock Items" value={stats.lowStock} color="bg-yellow-100 text-yellow-700" />
        <StatCard icon={Users} label="Est. Profit" value={`₹${stats.profit}`} color="bg-blue-100 text-blue-700" />
      </div>
      
      {inventory.filter(i => i.quantity < 10).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
            <AlertTriangle size={20} />
            <span>Low Stock Alert!</span>
          </div>
          <div className="flex gap-3 flex-wrap">
            {inventory.filter(i => i.quantity < 10).map(item => (
              <span key={item.id} className="bg-white px-3 py-1 rounded-full text-sm border">
                {item.name} ({item.quantity} left)
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <QuickAction title="New Sale" desc="Bill banaye" path="/pos" color="bg-blue-600" />
        <QuickAction title="Check Udhaar" desc="Baaki paisa" path="/udhaar" color="bg-orange-600" />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center mb-3`}>
        <Icon size={20} />
      </div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function QuickAction({ title, desc, path, color }) {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(path)} className={`${color} text-white p-6 rounded-xl text-left hover:opacity-90`}>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="opacity-80">{desc}</p>
    </button>
  );
}