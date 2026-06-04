import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { Home, ShoppingCart, Package, Users, MessageCircle, LogOut } from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const logout = () => {
    localStorage.clear();
    navigate('/');
  };
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/pos', icon: ShoppingCart, label: 'Sell' },
    { path: '/inventory', icon: Package, label: 'Stock' },
    { path: '/udhaar', icon: Users, label: 'Udhaar' },
    { path: '/advisor', icon: MessageCircle, label: 'AI Advisor' },
  ];
  
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-20 bg-blue-700 flex flex-col items-center py-6 text-white">
        <div className="mb-8 font-bold text-xs text-center">ANTARYA</div>
        {navItems.map(item => (
          <NavLink key={item.path} to={item.path} 
            className={({isActive}) => `p-3 mb-2 rounded-lg ${isActive ? 'bg-blue-500' : 'hover:bg-blue-600'}`}>
            <item.icon size={24} />
          </NavLink>
        ))}
        <button onClick={logout} className="mt-auto p-3 hover:bg-blue-600 rounded-lg">
          <LogOut size={24} />
        </button>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="p-4 bg-white border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">{user.shopName || 'Kirana Store'}</h2>
          <span className="text-sm text-gray-500">Welcome, {user.owner || 'Bhai'}</span>
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}