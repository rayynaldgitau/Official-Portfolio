import { useState } from 'react';
import { Lock } from 'lucide-react';
import Portfolio from './components/Portfolio';
import Dashboard from './components/Dashboard';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';

export default function App() {
  const [view, setView] = useState<'portfolio' | 'login' | 'dashboard'>('portfolio');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setView('dashboard');
      setError('');
    } else {
      setError('Incorrect password. Demo password is: admin123');
    }
  };

  if (view === 'portfolio') {
    return (
      <div className="relative">
        <Portfolio />
        <button
          onClick={() => setView('login')}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg flex items-center justify-center z-50 transition-transform hover:scale-110"
          title="Admin Login"
        >
          <Lock className="w-6 h-6 text-white" />
        </button>
      </div>
    );
  }

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
        <Card className="bg-slate-900/50 border-slate-800 w-full max-w-md backdrop-blur-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Admin Dashboard</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your password to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  placeholder="Enter password"
                />
                {error ? (
                  <p className="text-xs text-red-400 mt-2">{error}</p>
                ) : (
                  <p className="text-xs text-slate-500 mt-2">Demo password: admin123</p>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setView('portfolio'); setError(''); setPassword(''); }}
                  className="flex-1 border-slate-700 text-white hover:bg-slate-800"
                >
                  Back to Portfolio
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                >
                  Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      <Dashboard onLogout={() => setView('portfolio')} />
    </div>
  );
}
