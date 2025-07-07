import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingUp, Users, 
  Download, Search,
  CheckCircle, Clock, AlertCircle,
  Eye, Send, Calculator
} from 'lucide-react';
import Card from './ui/Card';
import Modal from './Modal';

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  position: string;
  department: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  month: string;
  year: number;
  status: 'pending' | 'processed' | 'paid';
  processedDate?: string;
  paidDate?: string;
}

const PayslipModal: React.FC<{ record: PayrollRecord }> = ({ record }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'processed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">EduSys Pro Secondary School</h2>
        <p className="text-gray-600">Kampala, Uganda</p>
        <h3 className="text-lg font-semibold mt-2">PAYSLIP</h3>
        <p className="text-sm text-gray-500">{record.month} {record.year}</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Employee Details</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Name:</span> {record.employeeName}</p>
            <p><span className="font-medium">ID:</span> {record.employeeId}</p>
            <p><span className="font-medium">Position:</span> {record.position}</p>
            <p><span className="font-medium">Department:</span> {record.department}</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Payment Details</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Period:</span> {record.month} {record.year}</p>
            <p><span className="font-medium">Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(record.status)}`}>
                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
              </span>
            </p>
            {record.processedDate && (
              <p><span className="font-medium">Processed:</span> {record.processedDate}</p>
            )}
            {record.paidDate && (
              <p><span className="font-medium">Paid:</span> {record.paidDate}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Salary Breakdown</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Basic Salary</span>
            <span className="font-medium">{formatCurrency(record.baseSalary)}</span>
          </div>
          <div className="flex justify-between">
            <span>Allowances</span>
            <span className="font-medium text-green-600">+{formatCurrency(record.allowances)}</span>
          </div>
          <div className="flex justify-between">
            <span>Deductions</span>
            <span className="font-medium text-red-600">-{formatCurrency(record.deductions)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Net Salary</span>
            <span>{formatCurrency(record.netSalary)}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  );
};

const Payroll: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processed' | 'paid'>('all');
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  const [showPayslipModal, setShowPayslipModal] = useState(false);

  // Mock payroll data
  const payrollRecords: PayrollRecord[] = [
    {
      id: '1',
      employeeId: 'TCH001',
      employeeName: 'Sarah Nakato',
      position: 'Senior Teacher',
      department: 'Mathematics',
      baseSalary: 2500000,
      allowances: 500000,
      deductions: 350000,
      netSalary: 2650000,
      month: 'December',
      year: 2024,
      status: 'paid',
      processedDate: '2024-12-25',
      paidDate: '2024-12-28'
    },
    {
      id: '2',
      employeeId: 'TCH002',
      employeeName: 'James Okello',
      position: 'Head Teacher',
      department: 'Administration',
      baseSalary: 3500000,
      allowances: 750000,
      deductions: 480000,
      netSalary: 3770000,
      month: 'December',
      year: 2024,
      status: 'paid',
      processedDate: '2024-12-25',
      paidDate: '2024-12-28'
    },
    {
      id: '3',
      employeeId: 'STF001',
      employeeName: 'Mary Akello',
      position: 'Head Cook',
      department: 'Kitchen',
      baseSalary: 800000,
      allowances: 150000,
      deductions: 120000,
      netSalary: 830000,
      month: 'December',
      year: 2024,
      status: 'processed',
      processedDate: '2024-12-25'
    },
    {
      id: '4',
      employeeId: 'STF002',
      employeeName: 'Robert Musoke',
      position: 'Security Guard',
      department: 'Security',
      baseSalary: 600000,
      allowances: 100000,
      deductions: 85000,
      netSalary: 615000,
      month: 'December',
      year: 2024,
      status: 'pending'
    },
    {
      id: '5',
      employeeId: 'TCH003',
      employeeName: 'Grace Nalubega',
      position: 'Teacher',
      department: 'English',
      baseSalary: 2200000,
      allowances: 400000,
      deductions: 300000,
      netSalary: 2300000,
      month: 'December',
      year: 2024,
      status: 'processed',
      processedDate: '2024-12-25'
    }
  ];

  // Calculate summary statistics
  const totalEmployees = payrollRecords.length;
  const totalPayroll = payrollRecords.reduce((sum, record) => sum + record.netSalary, 0);
  const pendingPayments = payrollRecords.filter(r => r.status === 'pending').length;
  const processedPayments = payrollRecords.filter(r => r.status === 'processed').length;

  // Filter records
  const filteredRecords = payrollRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'processed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'processed': return Clock;
      case 'pending': return AlertCircle;
      default: return Clock;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const generatePayslip = (record: PayrollRecord) => {
    setSelectedRecord(record);
    setShowPayslipModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payroll Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage employee salaries and payments
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Calculator className="h-4 w-4" />
            <span>Process Payroll</span>
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Employees</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalEmployees}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Payroll</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalPayroll)}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Payments</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{pendingPayments}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Processed</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{processedPayments}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              aria-label="Select month"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              aria-label="Select year"
            >
              {[2024, 2023, 2022].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processed">Processed</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Payroll Records Table */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payroll Records</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3">Employee</th>
                  <th scope="col" className="px-6 py-3">Department</th>
                  <th scope="col" className="px-6 py-3">Base Salary</th>
                  <th scope="col" className="px-6 py-3">Net Salary</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => {
                  const StatusIcon = getStatusIcon(record.status);
                  return (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{record.employeeName}</div>
                          <div className="text-gray-500 dark:text-gray-400">{record.employeeId} • {record.position}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">{record.department}</td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">{formatCurrency(record.baseSalary)}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-green-600">{formatCurrency(record.netSalary)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => generatePayslip(record)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                            title="View Payslip"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {record.status === 'processed' && (
                            <button
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
                              title="Make Payment"
                            >
                              <Send className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Payslip Modal */}
      {selectedRecord && (
        <Modal
          isOpen={showPayslipModal}
          onClose={() => setShowPayslipModal(false)}
          title="Employee Payslip"
          size="xl"
        >
          <PayslipModal record={selectedRecord} />
        </Modal>
      )}
    </div>
  );
};

export default Payroll;
