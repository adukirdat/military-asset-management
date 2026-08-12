import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export function UnauthorizedPage() {
  return <main className="grid min-h-screen place-items-center p-6"><section className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-8 text-center shadow-xl"><ShieldAlert className="mx-auto text-amber-300" size={38} aria-hidden="true" /><h1 className="mt-4 text-2xl font-semibold">Access unavailable</h1><p className="mt-3 text-slate-300">You don&apos;t have permission to access this page.</p><Link className="mt-7 inline-block rounded-md bg-emerald-500 px-4 py-2 font-medium text-slate-950 hover:bg-emerald-400" to="/app">Return to application</Link></section></main>;
}
