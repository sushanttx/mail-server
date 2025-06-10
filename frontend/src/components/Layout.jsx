import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    // Initialize activeTab based on current URL path
    const path = location.pathname.slice(1); // Remove leading slash
    return path || 'all';
  });

  // Update URL when activeTab changes
  useEffect(() => {
    const path = activeTab === 'all' ? '/' : `/${activeTab}`;
    navigate(path);
  }, [activeTab, navigate]);

  // Update activeTab when URL changes
  useEffect(() => {
    const path = location.pathname.slice(1);
    setActiveTab(path || 'all');
  }, [location]);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen bg-background-light dark:bg-background-dark ${isDarkMode ? 'dark' : ''}`}> 
      <Navbar isDarkMode={isDarkMode} onThemeToggle={() => setIsDarkMode(!isDarkMode)} />
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <main className="flex-1 overflow-auto bg-background-light dark:bg-background-dark">
          <div className="p-4">
            <Outlet context={{ activeTab }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 