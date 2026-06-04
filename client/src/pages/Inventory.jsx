import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', quantity: '', price: '', category: 'Grocery' });
  
  useEffect(() => { loadItems(); }, []);
  
  const loadItems = async () => {
    const res = await api.get('/inventory');
    setItems(res.data);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/inventory', { ...form, quantity: Number(form.quantity), price: Number(form.price) });
    setForm({ name: '', quantity: '', price: '', category: 'Grocery' });
    setShowAdd(false);
    loadItems();
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Stock Management</h1>
        <button onClick={() => setShowAdd(!showAdd)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} /> Add Item
        </button>
      </div>
      
      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm border mb-6 grid grid-cols-4 gap-3">
          <input className="p-2 border rounded" placeholder="Item name" required
            value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input className="p-2 border rounded" type="number" placeholder="Quantity" required
            value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
          <input className="p-2 border rounded" type="number" placeholder="Price (₹)" required
            value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          <select className="p-2 border rounded" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
            <option>Grocery</option><option>Dairy</option><option>Snacks</option><option>Personal Care</option>
          </select>
          <button type="submit" className="col-span-4 bg-green-600 text-white py-2 rounded-lg">Save Item</button>
        </form>
      )}
      
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Item</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-right">Price</th>
              <th className="p-3 text-right">Stock</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-t">
                <td className="p-3 font-medium">{item.name}</td>
                <td className="p-3 text-gray-500">{item.category}</td>
                <td className="p-3 text-right">₹{item.price}</td>
                <td className="p-3 text-right">{item.quantity}</td>
                <td className="p-3 text-center">
                  {item.quantity < 10 ? (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">Low</span>
                  ) : (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">OK</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}