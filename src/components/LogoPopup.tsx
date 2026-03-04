import { useEffect } from 'react';
import { GraduationCap } from 'lucide-react';

export const LogoPopup = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center animate-fade-in">
      <div className="text-center">
        <div className="w-24 h-24 bg-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl animate-bounce-slow">
          <GraduationCap className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Shrivan Science Academy</h1>
        <p className="text-gray-500 text-lg">Loading your experience...</p>
      </div>
    </div>
  );
};