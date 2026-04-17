import React from 'react';
import { UserCircle, LogOut } from 'lucide-react';
import { View } from '../types';
import { cn } from '../lib/utils';

interface NavbarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

export default function Navbar({ currentView, setCurrentView }: NavbarProps) {
  const navItems: View[] = ['Home', 'Scanner', 'Game', 'AI Chat'];

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-3xl">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto w-full">
        <div 
          className="text-2xl font-bold tracking-tight text-primary font-headline cursor-pointer"
          onClick={() => setCurrentView('Home')}
        >
          EcoSort
        </div>
        <nav className="hidden md:flex gap-8 items-center">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setCurrentView(item)}
              className={cn(
                "transition-colors duration-200 font-medium cursor-pointer",
                currentView === item 
                  ? "text-primary font-bold border-b-2 border-primary" 
                  : "text-on-surface-variant hover:text-primary"
              )}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <UserCircle className="w-6 h-6 text-on-surface-variant hover:text-primary cursor-pointer transition-colors" />
        </div>
      </div>
    </header>
  );
}
