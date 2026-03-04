import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { HomePage } from './components/HomePage';
import { StudentLogin } from './components/StudentLogin';
import { TeacherLogin } from './components/TeacherLogin';
import { StudentDashboard } from './components/StudentDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { LogoPopup } from './components/LogoPopup';

function AppContent() {
  const { user, logout } = useAuth();
  const [view, setView] = useState<'home' | 'student-login' | 'teacher-login' | 'student-dashboard' | 'teacher-dashboard'>('home');
  const [showLogoPopup, setShowLogoPopup] = useState(false);

  useEffect(() => {
    if (user) {
      setShowLogoPopup(true);
      const timer = setTimeout(() => {
        setShowLogoPopup(false);
        if (user.role === 'student') setView('student-dashboard');
        else if (user.role === 'teacher' || user.role === 'admin') setView('teacher-dashboard');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    setView('home');
  };

  if (showLogoPopup) {
    return <LogoPopup />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-grow">
        {view === 'home' && (
          <HomePage 
            onStudentLogin={() => setView('student-login')} 
            onTeacherLogin={() => setView('teacher-login')}
          />
        )}
        {view === 'student-login' && <StudentLogin onBack={() => setView('home')} />}
        {view === 'teacher-login' && <TeacherLogin onBack={() => setView('home')} />}
        {view === 'student-dashboard' && user?.role === 'student' && <StudentDashboard onLogout={handleLogout} />}
        {(view === 'teacher-dashboard' && (user?.role === 'teacher' || user?.role === 'admin')) && <TeacherDashboard onLogout={handleLogout} />}
      </main>
      
      <footer className="bg-slate-900 text-slate-300 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2024 Shrivan Science Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;