
import Sidebar from './Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { useEffect } from 'react';


export default function Layout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
