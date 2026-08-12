import { isAxiosError } from 'axios';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type LocationState = { from?: { pathname?: string } };

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? '/app';

  if (isAuthenticated) return <Navigate to="/app" replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError('Enter your username and password.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await login(username.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      if (isAxiosError(requestError) && requestError.response?.status === 401) {
        setError('Invalid username or password.');
      } else if (isAxiosError(requestError) && requestError.response?.status === 400) {
        setError('Please check your username and password.');
      } else {
        setError('Unable to sign in right now. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return <main className="grid min-h-screen place-items-center bg-slate-950 p-6"><section className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-8 shadow-2xl"><div className="mb-8 text-center"><div className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-500/15 text-emerald-300"><Shield aria-hidden="true" /></div><h1 className="mt-4 text-2xl font-semibold">Military Asset Management</h1><p className="mt-2 text-sm text-slate-400">Sign in to access the system.</p></div><form className="space-y-5" onSubmit={handleSubmit} noValidate><div><label className="mb-2 block text-sm font-medium" htmlFor="username">Username</label><input className="w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2.5 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30" id="username" name="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} disabled={isSubmitting} required /></div><div><label className="mb-2 block text-sm font-medium" htmlFor="password">Password</label><div className="relative"><input className="w-full rounded-md border border-slate-600 bg-slate-950 px-3 py-2.5 pr-11 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30" id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} disabled={isSubmitting} required /><button className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-400 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>{error && <p className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200" role="alert">{error}</p>}<button className="w-full rounded-md bg-emerald-500 px-4 py-2.5 font-medium text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'}</button></form></section></main>;
}
