
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Events', path: '/events' },
  { name: 'Devices', path: '/devices' },
  { name: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const handleUploadClick = () => {
    navigate('/settings', { state: { uploadCsv: true } });
  };
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6 flex flex-col justify-between">
      <div>
        <div className="text-2xl font-bold mb-8 tracking-tight">EventPulse</div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2 text-sm transition-shadow duration-200 hover:bg-slate-800 ${isActive ? 'bg-indigo-600 text-white' : ''}`
              }
              end={item.path === '/'}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="mt-8 space-y-2">
          <button
            onClick={handleUploadClick}
            className="w-full block rounded-lg px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 transition-colors duration-200 mt-2 text-left"
          >
            Upload/Change CSV
          </button>
          <button
            onClick={handleLogout}
            className="w-full block rounded-lg px-4 py-2 text-sm bg-red-600 hover:bg-red-700 transition-colors duration-200 mt-2 text-left"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="mt-8 text-xs text-slate-400 select-all break-all">
        <span className="block font-semibold text-slate-500 mb-1">API Endpoint</span>
        http://localhost:5000/api/analytics/weekly-active-users
      </div>
    </aside>
  );
}
