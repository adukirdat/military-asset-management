import { LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { navigationItems } from '../config/navigation';
import { useAuth } from '../context/AuthContext';

export function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  function handleLogout() { logout(); navigate('/login', { replace: true }); }
  const { hasPermission } = useAuth();
  const baseContext = user?.role === 'ADMIN' ? 'System-wide access' : user?.baseId ? `Base-scoped access: ${user.baseId}` : 'No base association';
  return <main className="grid min-h-screen place-items-center p-6"><section className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 px-8 py-10 text-center shadow-xl"><h1 className="text-2xl font-semibold">Military Asset Management System</h1><p className="mt-3 text-slate-300">Authenticated as <span className="font-medium text-slate-100">{user?.username}</span>.</p><p className="mt-1 text-sm text-slate-400">{user?.role.replaceAll('_', ' ')} · {baseContext}</p><nav className="mt-7 grid gap-2 text-left" aria-label="Application navigation">{navigationItems.filter((item) => hasPermission(item.permission)).map(({ label, path, icon: Icon }) => <Link key={path} className="flex items-center gap-3 rounded-md border border-slate-700 px-4 py-3 text-sm hover:bg-slate-800" to={path}><Icon size={17} />{label}</Link>)}</nav><button className="mx-auto mt-8 inline-flex items-center gap-2 rounded-md border border-slate-600 px-4 py-2 text-sm font-medium hover:bg-slate-800" type="button" onClick={handleLogout}><LogOut size={16} />Log out</button></section></main>;
}
