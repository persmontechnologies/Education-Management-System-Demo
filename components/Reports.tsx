import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from './ui/Card';
import { 
  BarChart3, TrendingUp, Users, GraduationCap, 
  Banknote, Calendar, Download, Filter, FileText, PieChart 
} from 'lucide-react';

const Reports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('current-term');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const reportCategories = [
    { id: 'all', label: 'All Reports', icon: FileText },
    { id: 'academic', label: 'Academic Performance', icon: GraduationCap },
    { id: 'financial', label: 'Financial Reports', icon: Banknote },
    { id: 'attendance', label: 'Attendance Reports', icon: Calendar },
    { id: 'staff', label: 'Staff Reports', icon: Users },
  ];

  const reports = [
    {
      id: 'student-performance',
      title: 'Student Performance Report',
      description: 'Comprehensive analysis of student academic performance across all subjects',
      category: 'academic',
      icon: TrendingUp,
      color: 'bg-blue-500',
      stats: { generated: 124, downloaded: 89 }
    },
    {
      id: 'attendance-summary',
      title: 'Attendance Summary',
      description: 'Monthly and termly attendance statistics for students and staff',
      category: 'attendance',
      icon: Calendar,
      color: 'bg-green-500',
      stats: { generated: 95, downloaded: 67 }
    },
    {
      id: 'fee-collection',
      title: 'Fee Collection Report',
      description: 'School fees collection status and outstanding payments',
      category: 'financial',
      icon: Banknote,
      color: 'bg-yellow-500',
      stats: { generated: 156, downloaded: 134 }
    },
    {
      id: 'exam-analysis',
      title: 'Examination Analysis',
      description: 'Detailed analysis of exam results by class, subject, and grade',
      category: 'academic',
      icon: BarChart3,
      color: 'bg-purple-500',
      stats: { generated: 78, downloaded: 52 }
    },
    {
      id: 'staff-performance',
      title: 'Staff Performance Report',
      description: 'Staff attendance, performance metrics, and evaluation reports',
      category: 'staff',
      icon: Users,
      color: 'bg-orange-500',
      stats: { generated: 43, downloaded: 31 }
    },
    {
      id: 'enrollment-trends',
      title: 'Enrollment Trends',
      description: 'Student enrollment patterns and demographic analysis',
      category: 'academic',
      icon: PieChart,
      color: 'bg-indigo-500',
      stats: { generated: 62, downloaded: 45 }
    }
  ];

  const filteredReports = reports.filter(report => 
    selectedCategory === 'all' || report.category === selectedCategory
  );

  const generateReport = (reportId: string) => {
    console.log(`Generating report: ${reportId}`);
    // In a real app, this would trigger report generation
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Generate and download comprehensive school reports</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select time period"
          >
            <option value="current-term">Current Term</option>
            <option value="last-term">Last Term</option>
            <option value="current-year">Current Year</option>
            <option value="custom">Custom Period</option>
          </select>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Reports</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">558</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Download className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Downloads</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">418</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">89</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center">
            <Filter className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{reportCategories.length - 1}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Filter */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Report Categories</h3>
        <div className="flex flex-wrap gap-2">
          {reportCategories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.id;
            
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{category.label}</span>
              </motion.button>
            );
          })}
        </div>
      </Card>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => {
          const Icon = report.icon;
          
          return (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${report.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <button
                    onClick={() => generateReport(report.id)}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Generate
                  </button>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {report.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {report.description}
                </p>
                
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>Generated: {report.stats.generated}</span>
                  <span>Downloaded: {report.stats.downloaded}</span>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <button className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded">
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                    <button className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                      <BarChart3 className="w-3 h-3" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Report Activity</h3>
        <div className="space-y-3">
          {[
            { report: 'Student Performance Report', user: 'Dr. Sarah Nakato', time: '2 hours ago', action: 'Generated' },
            { report: 'Fee Collection Report', user: 'James Mukasa', time: '5 hours ago', action: 'Downloaded' },
            { report: 'Attendance Summary', user: 'Grace Namugga', time: '1 day ago', action: 'Generated' },
            { report: 'Exam Analysis', user: 'Dr. Sarah Nakato', time: '2 days ago', action: 'Downloaded' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.report}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.action} by {activity.user}</p>
                </div>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Reports;
