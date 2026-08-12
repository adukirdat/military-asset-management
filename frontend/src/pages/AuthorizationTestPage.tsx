import { useAuth } from '../context/AuthContext';

export function AuthorizationTestPage({ title, description }: { title: string; description: string }) {
  const { user } = useAuth();
  return <main className="grid min-h-screen place-items-center p-6"><section className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-900 p-8 text-center shadow-xl"><h1 className="text-2xl font-semibold">{title}</h1><p className="mt-3 text-slate-300">{description}</p><p className="mt-6 text-sm text-slate-400">Frontend permission test for {user?.username}.</p></section></main>;
}
