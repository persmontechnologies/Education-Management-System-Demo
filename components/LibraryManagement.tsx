import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Search, Plus, Filter, BarChart3, Users,
  Clock, AlertTriangle, CheckCircle, Book, Bookmark
} from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: 'available' | 'borrowed' | 'reserved';
  borrowedBy?: string;
  dueDate?: string;
  coverUrl: string;
}

const LibraryManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const libraryStats = [
    { label: 'Total Books', value: '12,456', icon: BookOpen, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Borrowed', value: '1,234', icon: Users, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { label: 'Overdue', value: '23', icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-50' },
    { label: 'Available', value: '11,199', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
  ];

  const recentBooks: Book[] = [
    {
      id: '1',
      title: 'Advanced Mathematics',
      author: 'Dr. Robert Smith',
      isbn: '978-0123456789',
      category: 'Mathematics',
      status: 'available',
      coverUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=300&fit=crop'
    },
    {
      id: '2',
      title: 'World History',
      author: 'Sarah Johnson',
      isbn: '978-0987654321',
      category: 'History',
      status: 'borrowed',
      borrowedBy: 'Emma Wilson',
      dueDate: '2024-01-20',
      coverUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=300&fit=crop'
    },
    {
      id: '3',
      title: 'Physics Fundamentals',
      author: 'Michael Brown',
      isbn: '978-0147258369',
      category: 'Science',
      status: 'reserved',
      borrowedBy: 'John Doe',
      coverUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=300&fit=crop'
    },
  ];

  const categories = ['all', 'Mathematics', 'Science', 'History', 'Literature', 'Technology', 'Arts'];

  const recentActivity = [
    { action: 'Book Returned', book: 'Chemistry Lab Manual', student: 'Alice Cooper', time: '2 hours ago' },
    { action: 'Book Borrowed', book: 'Modern Literature', student: 'Bob Wilson', time: '4 hours ago' },
    { action: 'Book Reserved', book: 'Data Structures', student: 'Carol Davis', time: '6 hours ago' },
    { action: 'Overdue Notice', book: 'Biology Textbook', student: 'David Lee', time: '1 day ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'borrowed': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'reserved': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Library Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage books, borrowers, and library resources</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </button>
          <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            Generate Report
          </button>
        </div>
      </motion.div>

      {/* Library Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {libraryStats.map((stat) => (
          <div key={stat.label} className={`${stat.bgColor} rounded-xl p-6 shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              title="Select book category"
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Book Collection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Book className="h-5 w-5 mr-2" />
            Recent Books
          </h3>
          <div className="space-y-4">
            {recentBooks.map((book) => (
              <div key={book.id} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow">
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-16 h-20 object-cover rounded-lg shadow-sm mr-4"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{book.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">by {book.author}</p>
                  <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">{book.category} • {book.isbn}</p>
                  {book.borrowedBy && (
                    <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                      Borrowed by {book.borrowedBy}
                      {book.dueDate && ` • Due: ${book.dueDate}`}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(book.status)}`}>
                    {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                  </span>
                  <div className="mt-2 flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                    <button className="text-emerald-600 hover:text-emerald-800 text-sm">Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={`${activity.action}-${activity.book}-${activity.student}`} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{activity.book}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {activity.student} • {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All Activity
          </button>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, label: 'Issue Book', color: 'blue' },
            { icon: CheckCircle, label: 'Return Book', color: 'emerald' },
            { icon: Bookmark, label: 'Reserve Book', color: 'purple' },
            { icon: AlertTriangle, label: 'Overdue Reports', color: 'red' },
          ].map((action) => (
            <button
              key={action.label}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-all duration-200 group"
            >
              <action.icon className="h-8 w-8 text-gray-600 dark:text-gray-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{action.label}</p>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LibraryManagement;
