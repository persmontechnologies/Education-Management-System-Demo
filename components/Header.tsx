import React from 'react';
import { AppView } from '../types';
import { Menu, Bell, Sun, Moon, Search } from 'lucide-react';

interface HeaderProps {
  currentView: AppView;
  onToggleSidebar: () => void;
}

const viewDescriptions: Record<AppView, string> = {
  dashboard: 'School Overview & Analytics',
  students: 'Manage all students (S1–S6)',
  teachers: 'Manage teaching staff',
  classes: 'Class and stream management',
  attendance: 'Track daily attendance',
  announcements: 'View and post school announcements',
  finance: 'School finances and fees (UGX)',
  exams: 'Examination management',
  settings: 'System configuration',
  library: 'Library resources and lending',
  reports: 'Reports & analytics',
  inventory: 'Inventory and assets',
  transport: 'School transport',
  cafeteria: 'Cafeteria menu',
  admissions: 'Admissions & enrollment',
  payroll: 'Payroll and salaries',
  maintenance: 'Facilities maintenance',
};

const Header: React.FC<HeaderProps> = ({ currentView, onToggleSidebar }) => {
  const [isDark, setIsDark] = React.useState(document.documentElement.classList.contains('dark'));
  const [search, setSearch] = React.useState('');
  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg sticky top-0 h-20 flex items-center justify-between px-8 z-20 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      {/* Left: Sidebar toggle and current view */}
      <div className="flex items-center min-w-0">
        <button onClick={onToggleSidebar} title="Toggle sidebar" className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 mr-4">
          <Menu className="h-6 w-6" />
        </button>
        <div className="flex flex-col min-w-0">
          <span className="text-xl font-bold text-gray-900 dark:text-white truncate">{currentView.charAt(0).toUpperCase() + currentView.slice(1)}</span>
          <span className="text-sm text-gray-600 dark:text-gray-300 truncate font-medium">
            {viewDescriptions[currentView] ?? ''}
          </span>
        </div>
      </div>
      {/* Center: Search bar */}
      <div className="flex-1 flex justify-center px-8">
        <div className="relative w-full max-w-md">
          <span className="absolute left-3 top-2.5 text-gray-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search students, teachers, classes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search"
          />
        </div>
      </div>
      {/* Right: Actions and user info */}
      <div className="flex items-center space-x-4">
        <button onClick={toggleDarkMode} title="Toggle dark mode" className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 focus:outline-none">
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button title="View notifications" className="relative p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 focus:outline-none">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900"></span>
        </button>
        <div className="flex items-center space-x-2 pl-2 border-l border-gray-200 dark:border-gray-700">
          <img className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-500 dark:ring-blue-400" src="https://i.pravatar.cc/150?u=admin" alt="User" />
          <div className="hidden md:flex flex-col min-w-0">
            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">Sarah Namugga</span>
            <span className="text-xs text-gray-500 dark:text-gray-300 truncate">Head Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;