import React, { useState, useMemo } from 'react';
import { FinanceRecord, Student } from '../types';
import Modal from './Modal';
import Card from './ui/Card';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  PieChart,
  Download,
  Receipt,
  Calculator,
  FileText,
  AlertCircle
} from 'lucide-react';

interface FinanceProps {
  students?: Student[];
  financeRecords?: FinanceRecord[];
  onAddRecord?: (record: Omit<FinanceRecord, 'id'>) => void;
}

const mockFinanceRecords: FinanceRecord[] = [
  {
    id: 'f1',
    type: 'income',
    category: 'School Fees',
    description: 'S1 Tuition Payment - Nakamya Sarah',
    amount: 450000,
    date: '2025-01-15',
    paymentMethod: 'mobile_money',
    reference: 'MTN-2025011501',
    studentId: 's1'
  },
  {
    id: 'f2',
    type: 'income',
    category: 'School Fees',
    description: 'S3 Boarding Fee - Okello James',
    amount: 300000,
    date: '2025-01-14',
    paymentMethod: 'bank_transfer',
    reference: 'BNK-20250114'
  },
  {
    id: 'f3',
    type: 'expense',
    category: 'Utilities',
    description: 'Electricity Bill - January',
    amount: 850000,
    date: '2025-01-10',
    paymentMethod: 'bank_transfer',
    reference: 'UMEME-012025'
  },
  {
    id: 'f4',
    type: 'expense',
    category: 'Staff Salaries',
    description: 'Teacher Salaries - January',
    amount: 12500000,
    date: '2025-01-05',
    paymentMethod: 'bank_transfer',
    reference: 'SAL-012025'
  },
  {
    id: 'f5',
    type: 'income',
    category: 'Transport',
    description: 'Transport Fee - Mugerwa Peter',
    amount: 50000,
    date: '2025-01-12',
    paymentMethod: 'cash'
  },
  {
    id: 'f6',
    type: 'expense',
    category: 'Maintenance',
    description: 'Laboratory Equipment Repair',
    amount: 750000,
    date: '2025-01-08',
    paymentMethod: 'cash'
  }
];

const emptyRecord: Omit<FinanceRecord, 'id'> = {
  type: 'income',
  category: '',
  description: '',
  amount: 0,
  date: new Date().toISOString().split('T')[0],
  paymentMethod: 'cash'
};

const Finance: React.FC<FinanceProps> = ({ 
  students = [], 
  financeRecords = mockFinanceRecords,
  onAddRecord 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Omit<FinanceRecord, 'id'>>(emptyRecord);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const categories = {
    income: ['School Fees', 'Transport', 'Boarding', 'Lunch', 'Uniform Sales', 'Book Sales', 'Donations', 'Other Income'],
    expense: ['Staff Salaries', 'Utilities', 'Maintenance', 'Supplies', 'Transportation', 'Food & Catering', 'Security', 'Insurance', 'Other Expenses']
  };

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'mobile_money', label: 'Mobile Money (MTN/Airtel)' },
    { value: 'cheque', label: 'Cheque' }
  ];

  const filteredRecords = useMemo(() => {
    return financeRecords.filter(record => {
      const typeMatch = filterType === 'all' || record.type === filterType;
      const categoryMatch = filterCategory === 'all' || record.category === filterCategory;
      const dateMatch = (!dateRange.start || record.date >= dateRange.start) && 
                       (!dateRange.end || record.date <= dateRange.end);
      return typeMatch && categoryMatch && dateMatch;
    });
  }, [financeRecords, filterType, filterCategory, dateRange]);

  const summary = useMemo(() => {
    const income = filteredRecords
      .filter(r => r.type === 'income')
      .reduce((sum, r) => sum + r.amount, 0);
    const expenses = filteredRecords
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + r.amount, 0);
    
    return {
      income,
      expenses,
      netIncome: income - expenses,
      totalTransactions: filteredRecords.length
    };
  }, [filteredRecords]);

  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<string, { income: number; expense: number }> = {};
    
    filteredRecords.forEach(record => {
      if (!breakdown[record.category]) {
        breakdown[record.category] = { income: 0, expense: 0 };
      }
      breakdown[record.category][record.type] += record.amount;
    });
    
    return Object.entries(breakdown).map(([category, amounts]) => ({
      category,
      ...amounts,
      net: amounts.income - amounts.expense
    }));
  }, [filteredRecords]);

  const formatCurrency = (amount: number) => {
    return `UGX ${amount.toLocaleString()}`;
  };

  const openAddModal = () => {
    setEditingRecord(emptyRecord);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingRecord(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddRecord) {
      onAddRecord(editingRecord);
    }
    closeModal();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Financial Management</h1>
        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button 
            onClick={openAddModal}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Income</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.income)}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.expenses)}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Income</p>
              <p className={`text-2xl font-bold ${summary.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(summary.netIncome)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Transactions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.totalTransactions}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
            >
              <option value="all">All</option>
              <option value="income">Income</option>
              <option value="expense">Expenses</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
            >
              <option value="all">All Categories</option>
              {[...categories.income, ...categories.expense].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
            />
          </div>

          <button
            onClick={() => {
              setFilterType('all');
              setFilterCategory('all');
              setDateRange({ start: '', end: '' });
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </div>
      </Card>

      {/* Category Breakdown */}
      {categoryBreakdown.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center mb-4">
            <PieChart className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Category Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400">
                <tr>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-right">Income</th>
                  <th className="px-4 py-2 text-right">Expenses</th>
                  <th className="px-4 py-2 text-right">Net</th>
                </tr>
              </thead>
              <tbody>
                {categoryBreakdown.map((item, index) => (
                  <tr key={index} className="border-b dark:border-gray-700">
                    <td className="px-4 py-2 font-medium">{item.category}</td>
                    <td className="px-4 py-2 text-right text-green-600">{formatCurrency(item.income)}</td>
                    <td className="px-4 py-2 text-right text-red-600">{formatCurrency(item.expense)}</td>
                    <td className={`px-4 py-2 text-right font-medium ${item.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(item.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Recent Transactions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Payment Method</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-6 py-3">Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => (
                <tr key={record.id} className="bg-white dark:bg-gray-800/50 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium">{record.description}</td>
                  <td className="px-6 py-4">{record.category}</td>
                  <td className="px-6 py-4 capitalize">{record.paymentMethod.replace('_', ' ')}</td>
                  <td className={`px-6 py-4 text-right font-bold ${record.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {record.type === 'income' ? '+' : '-'}{formatCurrency(record.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      record.type === 'income' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {record.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Receipt, label: 'Generate Invoice', color: 'blue' },
            { icon: Calculator, label: 'Fee Calculator', color: 'emerald' },
            { icon: AlertCircle, label: 'Outstanding Fees', color: 'yellow' },
            { icon: FileText, label: 'Financial Reports', color: 'purple' },
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
      </Card>

      {/* Add Transaction Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Add Transaction">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
              <select
                name="type"
                value={editingRecord.type}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                required
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <select
                name="category"
                value={editingRecord.category}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                required
              >
                <option value="">Select Category</option>
                {categories[editingRecord.type].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              name="description"
              value={editingRecord.description}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount (UGX)</label>
              <input
                type="number"
                name="amount"
                value={editingRecord.amount || ''}
                onChange={handleChange}
                min="0"
                step="1000"
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
              <input
                type="date"
                name="date"
                value={editingRecord.date}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
              <select
                name="paymentMethod"
                value={editingRecord.paymentMethod}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                required
              >
                {paymentMethods.map(method => (
                  <option key={method.value} value={method.value}>{method.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reference</label>
              <input
                type="text"
                name="reference"
                value={editingRecord.reference || ''}
                onChange={handleChange}
                placeholder="Transaction reference (optional)"
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Finance;
