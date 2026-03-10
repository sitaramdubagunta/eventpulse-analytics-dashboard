import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Events', path: '/events' },
  { name: 'Devices', path: '/devices' },
  { name: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-6">
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
    </aside>
  );
}
