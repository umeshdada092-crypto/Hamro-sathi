import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import UnitConverter from './components/UnitConverter';
import Chat from './components/Chat';
import Explore from './components/Explore';
import Login from './components/Login';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'calendar':
        return <Calendar />;
      case 'converter':
        return <UnitConverter />;
      case 'explore':
        return <Explore />;
      case 'chat':
        return <Chat />;
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDarkMode={isDarkMode} 
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
        user={user}
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
      >
        {renderContent()}
      </Layout>
      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)} 
          onLogin={handleLogin} 
        />
      )}
    </>
  );
}


