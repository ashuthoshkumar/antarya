import { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Minus, Trash2, Printer, X } from 'lucide-react';



function BillPrint({ cart, total, customer, paymentMode }) {
  return (
    <div className="bg-white p-6 w-80 font-mono text-sm">
      <div className="text-center mb-4">
        <h2 className="font-bold text-lg">ANTARYA</h2>
        <p>Kirana Store</p>
        <p>{new Date().toLocaleString()}</p>
      </div>
      <div className="border-t border-b py-2 mb-2">
        {cart.map((c, i) => (
          <div key={i} className="flex justify-between">
            <span>{c.name} x{c.qty}</span>
            <span>₹{c.price * c.qty}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between font-bold text-lg">
        <span>TOTAL</span>
        <span>₹{total}</span>
      </div>
      <div className="mt-4 text-center">
        <p>Payment: {paymentMode.toUpperCase()}</p>
        {customer && <p>Customer: {customer}</p>}
        <p className="mt-2">Thank you! 🙏</p>
      </div>
    </div>
  );
}

export default function POS() {
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState('');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [search, setSearch] = useState('');
  const [showBill, setShowBill] = useState(false);
  
  useEffect(() => { loadInventory(); }, []);
  
  const loadInventory = async () => {
    try {
      const res = await api.get('/inventory');
      setInventory(res.data);
    } catch (err) {
      console.log('Inventory load failed');
    }
  };
  
  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? {...c, qty: c.qty + 1} : c));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };
  
  const updateQty = (id, delta) => {
    setCart(cart.map(c => {
      if (c.id !== id) return c;
      const newQty = Math.max(0, c.qty + delta);
      return { ...c, qty: newQty };
    }).filter(c => c.qty > 0));
  };
  
  const removeFromCart = (id) => setCart(cart.filter(c => c.id !== id));
  
  const total = cart.reduce((sum, c) => sum + (c.price * c.qty), 0);
  
  const completeSale = async () => {
    if (cart.length === 0) return alert('Cart khali hai!');
    
    const sale = {
      items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.price })),
      total,
      paymentMode,
      customer,
      status: 'completed'
    };
    
    try {
      await api.post('/sales', sale);
      
      if (paymentMode === 'udhaar' && customer) {
        await api.post('/udhaar', { customer, amount: total, items: cart.map(c => c.name) });
      }
      
      setShowBill(true);
      setCart([]);
      setCustomer('');
      loadInventory();
    } catch (err) {
      alert('Sale save nahi hua. Server check karo.');
    }
  };
  
  const filtered = inventory.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <div className="flex gap-6 h-[calc(100vh-140px)]">
      <div className="flex-1 flex flex-col">
        <input className="p-3 border rounded-lg mb-4" placeholder="Item dhoondhein..."
          value={search} onChange={e => setSearch(e.target.value)} />
        
        <div className="grid grid-cols-3 gap-3 overflow-auto">
          {filtered.map(item => (
            <button key={item.id} onClick={() => addToCart(item)}
              className="bg-white p-4 rounded-lg border hover:border-blue-500 hover:shadow-md text-left transition-all">
              <p className="font-bold text-sm">{item.name}</p>
              <p className="text-gray-500 text-sm">₹{item.price}</p>
              <p className="text-xs text-gray-400">Stock: {item.quantity}</p>
            </button>
          ))}
        </div>
      </div>
      
      <div className="w-96 bg-white rounded-xl shadow-sm border flex flex-col">
        <div className="p-4 border-b">
          <h2 className="font-bold text-lg">Current Bill</h2>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {cart.length === 0 && (
            <p className="text-gray-400 text-center py-8">Koi item nahi hai. Left side se click karo.</p>
          )}
          {cart.map(item => (
            <div key={item.id} className="flex justify-between items-center mb-3 p-2 bg-gray-50 rounded">
              <div>
                <p className="font-bold text-sm">{item.name}</p>
                <p className="text-sm">₹{item.price} x {item.qty}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(item.id, -1)} className="p-1 bg-gray-200 rounded hover:bg-gray-300">
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center font-bold">{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)} className="p-1 bg-gray-200 rounded hover:bg-gray-300">
                  <Plus size={14} />
                </button>
                <button onClick={() => removeFromCart(item.id)} className="p-1 text-red-500 hover:text-red-700">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t bg-gray-50">
          <input className="w-full p-2 border rounded mb-3" placeholder="Customer name (for udhaar)"
            value={customer} onChange={e => setCustomer(e.target.value)} />
          
          <div className="flex gap-2 mb-3">
            {['cash', 'upi', 'udhaar'].map(mode => (
              <button key={mode} onClick={() => setPaymentMode(mode)}
                className={`flex-1 py-2 rounded capitalize font-medium ${paymentMode === mode ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                {mode}
              </button>
            ))}
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <span className="text-xl font-bold">Total:</span>
            <span className="text-2xl font-bold text-blue-700">₹{total}</span>
          </div>
          
          <button onClick={completeSale} className="w-full bg-green-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-green-700">
            <Printer size={20} />
            Bill Banaye
          </button>
        </div>
      </div>
      
      {showBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Bill Preview</h3>
              <button onClick={() => setShowBill(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <BillPrint cart={cart} total={total} customer={customer} paymentMode={paymentMode} />
            <button onClick={() => { setShowBill(false); }} 
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}