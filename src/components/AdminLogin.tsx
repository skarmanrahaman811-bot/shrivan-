import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminLoginProps {
  onBack: () => void;
}

export const AdminLogin = ({ onBack }: AdminLoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Retrieve stored admin credentials
    const storedCreds = localStorage.getItem('adminCredentials');
    const adminCreds = storedCreds ? JSON.parse(storedCreds) : { username: 'admin', password: 'admin123' };

    if (username === adminCreds.username && password === adminCreds.password) {
      login('admin', 'admin_001', 'Administrator');
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="container mx-auto px-4">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-md mx-auto">
          <Card className="shadow-xl border-slate-200">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-slate-700" />
              </div>
              <CardTitle className="text-2xl text-slate-800">Admin Login</CardTitle>
              <CardDescription>Secure system access</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="admin-username">Username</Label>
                  <Input
                    id="admin-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter admin username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                  />
                </div>
                <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-900">
                  Access Dashboard
                </Button>
              </form>
              <div className="mt-4 text-center text-xs text-gray-400">
                Default: admin / admin123
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};