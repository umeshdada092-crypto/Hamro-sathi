import React from 'react';
import { LayoutDashboard, Calendar as CalendarIcon, Scale, MessageSquare, Menu, X, Sun, Moon, LogIn, LogOut, Compass, User } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  user: { name: string; email: string } | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export default function Layout({ 
  children, 
  activeTab, 
  setActiveTab, 
  isDarkMode, 
  toggleTheme, 
  user, 
  onLoginClick, 
  onLogout 
}: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'converter', label: 'Converter', icon: Scale },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'chat', label: 'Sathi AI', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col md:flex-row transition-colors duration-300">
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-bold text-emerald-700 dark:text-emerald-500 font-serif italic">Hamro Sathi</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <nav className={cn(
        "fixed inset-0 z-40 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 transform transition-transform md:relative md:translate-x-0 md:w-72 flex flex-col",
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 hidden md:block">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-emerald-800 dark:text-emerald-500 font-serif italic">Hamro Sathi</h1>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 uppercase tracking-widest">Your Nepali Companion</p>
        </div>

        <div className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMenuOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200",
                activeTab === item.id 
                  ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold shadow-sm" 
                  : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {user ? (
            <div className="bg-stone-50 dark:bg-stone-950 rounded-3xl p-4 border border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <User size={20} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-stone-800 dark:text-stone-100 truncate">{user.name}</p>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">{user.email}</p>
                </div>
              </div>
              <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={onLoginClick}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-3xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-100 dark:shadow-none transition-all"
            >
              <LogIn size={18} /> Sign In
            </button>
          )}
          
          <div className="bg-stone-50 dark:bg-stone-950 rounded-3xl p-4 border border-stone-100 dark:border-stone-800">
            <p className="text-[10px] uppercase tracking-tighter text-stone-400 dark:text-stone-500 font-bold mb-1">Current BS Date</p>
            <p className="text-sm font-bold text-stone-700 dark:text-stone-300">23 Falgun, 2081</p>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

