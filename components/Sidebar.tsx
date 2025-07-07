import React from 'react';
import { AppView } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, UserCheck, BookOpen, CalendarCheck, Megaphone,
  Banknote, Library, Settings, ChevronLeft, ChevronRight, LogOut,
  BarChart3, Package, Bus, UtensilsCrossed, UserPlus, GraduationCap,
  Wallet, Wrench, Shield, Bell,
  MapPin, Activity, Globe, Building
} from 'lucide-react';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

interface NavItemProps {
  view: AppView;
  label: string;
  icon: React.ElementType;
  currentView: AppView;
  setView: (view: AppView) => void;
  isCollapsed: boolean;
  badge?: string;
  badgeColor?: string;
  isNew?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ 
  view, label, icon: Icon, currentView, setView, isCollapsed, badge, badgeColor = 'bg-blue-500', isNew 
}) => {
  const isActive = currentView === view;
  
  return (
    <li className="mb-1">
      <button
        onClick={() => setView(view)}
        className={`relative flex items-center w-full h-10 px-3 rounded-lg transition-all duration-200 group ${
          isActive
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm'
            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50'
        }`}
        title={label}
      >
        <div className={`flex items-center justify-center w-7 h-7 rounded-md transition-all duration-200 ${
          isActive 
            ? 'bg-white/10' 
            : 'group-hover:bg-blue-50 dark:group-hover:bg-gray-700/60'
        }`}>
          <Icon className={`h-4 w-4 flex-shrink-0 transition-all duration-200 ${
            isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
          }`} />
        </div>
        
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0, x: -10 }}
              animate={{ opacity: 1, width: 'auto', x: 0 }}
              exit={{ opacity: 0, width: 0, x: -10 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="ml-3 flex-1 flex items-center justify-between min-w-0"
            >
              <span className={`text-sm font-medium whitespace-nowrap ${
                isActive ? 'text-white' : 'text-gray-800 dark:text-gray-200'
              }`}>
                {label}
              </span>
              <div className="flex items-center space-x-2 ml-3">
                {isNew && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500 text-white rounded-full">
                    NEW
                  </span>
                )}
                {badge && (
                  <span className={`px-2 py-0.5 text-[10px] font-semibold text-white rounded-full ${badgeColor}`}>
                    {badge}
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Active indicator */}
        {isActive && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute -right-0.5 top-1/2 transform -translate-y-1/2 w-1 h-5 bg-white rounded-full"
          />
        )}
      </button>
    </li>
  );
};

const NavGroup: React.FC<{ 
  title: string; 
  isCollapsed: boolean; 
  children: React.ReactNode;
  icon?: React.ElementType;
  gradient?: string;
}> = ({ title, isCollapsed, children, icon: Icon, gradient = "from-gray-400 to-gray-600" }) => {
  return (
    <div className="mb-6">
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="px-3 mb-3"
          >
            <div className="flex items-center space-x-2 mb-2">
              {Icon && (
                <div className={`w-4 h-4 rounded-md bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                  <Icon className="h-2.5 w-2.5 text-white" />
                </div>
              )}
              <h3 className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {title}
              </h3>
            </div>
            <div className="h-px bg-gray-200 dark:bg-gray-700" />
          </motion.div>
        )}
      </AnimatePresence>
      <ul className="space-y-0.5 px-3">{children}</ul>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isCollapsed, setCollapsed }) => {
  const navItems = {
    main: [
      { view: 'dashboard' as AppView, label: 'Dashboard', icon: LayoutDashboard }
    ],
    academics: [
      { view: 'students' as AppView, label: 'Students', icon: Users, badge: '5,000', badgeColor: 'bg-blue-500' },
      { view: 'teachers' as AppView, label: 'Teachers', icon: UserCheck },
      { view: 'classes' as AppView, label: 'Classes', icon: BookOpen },
      { view: 'attendance' as AppView, label: 'Attendance', icon: CalendarCheck },
      { view: 'exams' as AppView, label: 'Examinations', icon: GraduationCap },
    ],
    staff: [
      { view: 'staff' as AppView, label: 'Support Staff', icon: Users },
      { view: 'payroll' as AppView, label: 'Payroll', icon: Wallet },
    ],
    administration: [
      { view: 'finance' as AppView, label: 'Finance', icon: Banknote },
      { view: 'admissions' as AppView, label: 'Admissions', icon: UserPlus },
      { view: 'reports' as AppView, label: 'Reports', icon: BarChart3 },
      { view: 'inventory' as AppView, label: 'Inventory', icon: Package },
    ],
    facilities: [
      { view: 'library' as AppView, label: 'Library', icon: Library },
      { view: 'transport' as AppView, label: 'Transport', icon: Bus },
      { view: 'cafeteria' as AppView, label: 'Cafeteria', icon: UtensilsCrossed },
      { view: 'maintenance' as AppView, label: 'Maintenance', icon: Wrench },
      { view: 'security' as AppView, label: 'Security', icon: Shield },
    ],
    communication: [
      { view: 'announcements' as AppView, label: 'Announcements', icon: Megaphone, badge: '5', badgeColor: 'bg-red-500' },
    ],
    system: [
      { view: 'settings' as AppView, label: 'Settings', icon: Settings },
    ],
  };

  return (
    <aside className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-30 transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-16' : 'w-64'
    } shadow-lg`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className={`flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 ${
          isCollapsed ? 'justify-center' : ''
        }`}>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <LayoutDashboard className="h-4 w-4 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col"
                >
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    EduSys Pro
                  </span>
                  <span className="text-blue-600 text-xs font-medium">
                    Uganda Secondary Schools
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">          {/* Collapse Toggle */}
          <div className="px-3 mb-6">
            <button
              onClick={() => setCollapsed(!isCollapsed)}
              className={`w-full h-8 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-md transition-all duration-200 flex items-center justify-center group ${
                isCollapsed ? 'px-2' : 'px-3'
              }`}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4 transition-transform" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-2 transition-transform" />
                  <span className="text-xs font-medium">Collapse</span>
                </>
              )}
            </button>
          </div>
          <NavGroup 
            title="Overview" 
            isCollapsed={isCollapsed}
            icon={Activity}
            gradient="from-emerald-500 to-emerald-600"
          >
            {navItems.main.map(item => <NavItem key={item.view} {...item} {...{ currentView, setView, isCollapsed }} />)}
          </NavGroup>

          <NavGroup 
            title="Academic Management" 
            isCollapsed={isCollapsed}
            icon={GraduationCap}
            gradient="from-blue-500 to-blue-600"
          >
            {navItems.academics.map(item => <NavItem key={item.view} {...item} {...{ currentView, setView, isCollapsed }} />)}
          </NavGroup>

          <NavGroup 
            title="Staff Management" 
            isCollapsed={isCollapsed}
            icon={UserCheck}
            gradient="from-green-500 to-green-600"
          >
            {navItems.staff.map(item => <NavItem key={item.view} {...item} {...{ currentView, setView, isCollapsed }} />)}
          </NavGroup>

          <NavGroup 
            title="Administration" 
            isCollapsed={isCollapsed}
            icon={Building}
            gradient="from-purple-500 to-purple-600"
          >
            {navItems.administration.map(item => <NavItem key={item.view} {...item} {...{ currentView, setView, isCollapsed }} />)}
          </NavGroup>

          <NavGroup 
            title="Facilities & Services" 
            isCollapsed={isCollapsed}
            icon={MapPin}
            gradient="from-orange-500 to-orange-600"
          >
            {navItems.facilities.map(item => <NavItem key={item.view} {...item} {...{ currentView, setView, isCollapsed }} />)}
          </NavGroup>

          <NavGroup 
            title="Communication" 
            isCollapsed={isCollapsed}
            icon={Bell}
            gradient="from-pink-500 to-pink-600"
          >
            {navItems.communication.map(item => <NavItem key={item.view} {...item} {...{ currentView, setView, isCollapsed }} />)}
          </NavGroup>

          <NavGroup 
            title="System" 
            isCollapsed={isCollapsed}
            icon={Globe}
            gradient="from-gray-500 to-gray-600"
          >
            {navItems.system.map(item => <NavItem key={item.view} {...item} {...{ currentView, setView, isCollapsed }} />)}
          </NavGroup>
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <div className={`flex items-center w-full h-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-3 ${
            isCollapsed ? 'justify-center' : ''
          }`}>
            <div className="relative">
              <img 
                className="h-7 w-7 rounded-md object-cover ring-2 ring-white dark:ring-gray-600" 
                src="https://i.pravatar.cc/150?u=admin" 
                alt="Administrator" 
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-white dark:border-gray-800" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-3 flex-1 min-w-0"
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">Sarah Namugga</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Head Administrator</p>
                    </div>
                    <button 
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors duration-200 group flex-shrink-0"
                      title="Logout"
                    >
                      <LogOut className="h-3.5 w-3.5 text-gray-400 group-hover:text-red-500 transition-colors" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
