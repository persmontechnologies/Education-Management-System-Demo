import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, School, Palette, Bell, 
  Shield, Database, Globe
} from 'lucide-react';
import FormBuilder from './ui/FormBuilder';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'school', label: 'School Info', icon: School },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data & Backup', icon: Database },
  ];

  const handleSaveSettings = async (data: Record<string, any>) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    console.log('Settings saved:', data);
  };

  const generalFields = [
    {
      name: 'schoolName',
      type: 'text' as const,
      label: 'School Name',
      placeholder: 'Enter school name',
      required: true
    },
    {
      name: 'principalName',
      type: 'text' as const,
      label: 'Principal Name',
      placeholder: 'Enter principal name',
      required: true
    },
    {
      name: 'schoolEmail',
      type: 'email' as const,
      label: 'School Email',
      placeholder: 'school@example.com',
      required: true
    },
    {
      name: 'schoolPhone',
      type: 'text' as const,
      label: 'School Phone',
      placeholder: '+256 XXX XXX XXX',
      required: true
    },
    {
      name: 'address',
      type: 'textarea' as const,
      label: 'School Address',
      placeholder: 'Enter complete school address',
      required: true
    },
    {
      name: 'academicYear',
      type: 'select' as const,
      label: 'Current Academic Year',
      required: true,
      options: [
        { value: '2024', label: '2024' },
        { value: '2025', label: '2025' },
        { value: '2026', label: '2026' }
      ]
    },
    {
      name: 'currentTerm',
      type: 'select' as const,
      label: 'Current Term',
      required: true,
      options: [
        { value: '1', label: 'Term 1' },
        { value: '2', label: 'Term 2' },
        { value: '3', label: 'Term 3' }
      ]
    },
    {
      name: 'currency',
      type: 'select' as const,
      label: 'Currency',
      required: true,
      options: [
        { value: 'UGX', label: 'Ugandan Shilling (UGX)' },
        { value: 'USD', label: 'US Dollar (USD)' },
        { value: 'EUR', label: 'Euro (EUR)' }
      ]
    }
  ];

  const appearanceFields = [
    {
      name: 'theme',
      type: 'select' as const,
      label: 'Theme',
      required: true,
      options: [
        { value: 'light', label: 'Light Mode' },
        { value: 'dark', label: 'Dark Mode' },
        { value: 'system', label: 'System Default' }
      ]
    },
    {
      name: 'primaryColor',
      type: 'select' as const,
      label: 'Primary Color',
      required: true,
      options: [
        { value: 'blue', label: 'Blue' },
        { value: 'green', label: 'Green' },
        { value: 'purple', label: 'Purple' },
        { value: 'red', label: 'Red' },
        { value: 'orange', label: 'Orange' }
      ]
    },
    {
      name: 'sidebarCollapsed',
      type: 'checkbox' as const,
      label: 'Keep sidebar collapsed by default'
    },
    {
      name: 'animations',
      type: 'checkbox' as const,
      label: 'Enable animations'
    }
  ];

  const notificationFields = [
    {
      name: 'emailNotifications',
      type: 'checkbox' as const,
      label: 'Email notifications'
    },
    {
      name: 'feeReminders',
      type: 'checkbox' as const,
      label: 'Fee payment reminders'
    },
    {
      name: 'attendanceAlerts',
      type: 'checkbox' as const,
      label: 'Attendance alerts'
    },
    {
      name: 'examNotifications',
      type: 'checkbox' as const,
      label: 'Exam schedule notifications'
    },
    {
      name: 'announcementAlerts',
      type: 'checkbox' as const,
      label: 'New announcement alerts'
    }
  ];

  const getFieldsForTab = () => {
    switch (activeTab) {
      case 'general': return generalFields;
      case 'appearance': return appearanceFields;
      case 'notifications': return notificationFields;
      default: return [];
    }
  };

  const getInitialData = () => {
    switch (activeTab) {
      case 'general':
        return {
          schoolName: 'Kampala International Secondary School',
          principalName: 'Dr. Sarah Nakato',
          schoolEmail: 'info@kambalaschool.edu.ug',
          schoolPhone: '+256 700 123 456',
          address: 'Plot 123, Nakasero Hill Road, Kampala, Uganda',
          academicYear: '2025',
          currentTerm: '2',
          currency: 'UGX'
        };
      case 'appearance':
        return {
          theme: 'light',
          primaryColor: 'blue',
          sidebarCollapsed: false,
          animations: true
        };
      case 'notifications':
        return {
          emailNotifications: true,
          feeReminders: true,
          attendanceAlerts: true,
          examNotifications: true,
          announcementAlerts: false
        };
      default:
        return {};
    }
  };

  const renderTabContent = () => {
    const fields = getFieldsForTab();
    
    if (fields.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Coming Soon</h3>
            <p className="text-gray-500 dark:text-gray-400">This settings section is under development</p>
          </div>
        </div>
      );
    }

    return (
      <FormBuilder
        fields={fields}
        onSubmit={handleSaveSettings}
        initialData={getInitialData()}
        submitText="Save Settings"
        loading={loading}
        className="max-w-2xl"
      />
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure your school management system preferences and settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
