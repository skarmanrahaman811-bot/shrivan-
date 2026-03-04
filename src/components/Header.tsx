import { Home, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-full p-2">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-bold text-lg">SSA</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Shrivan Science Academy</h1>
              <p className="text-indigo-200 text-sm">Excellence in Education</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <span className="text-sm bg-indigo-700 px-3 py-1 rounded-full">
                  {user.name}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={logout}
                  className="bg-white text-indigo-600 hover:bg-indigo-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};