import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  function handleLogout() { logout(); navigate('/login', { replace: true }); }
  return <main className="grid min-h-screen place-items-center p-6"><section className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 px-8 py-10 text-center shadow-xl"><h1 className="text-2xl font-semibold">Military Asset Management System</h1><p className="mt-3 text-slate-300">Authenticated as <span className="font-medium text-slate-100">{user?.username}</span>.</p><p className="mt-1 text-sm text-slate-400">Protected application area</p><button className="mx-auto mt-8 inline-flex items-center gap-2 rounded-md border border-slate-600 px-4 py-2 text-sm font-medium hover:bg-slate-800" type="button" onClick={handleLogout}><LogOut size={16} />Log out</button></section></main>;
}
