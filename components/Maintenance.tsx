import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wrench, AlertTriangle, CheckCircle, Clock,
  Search, Filter, Plus, Edit3, Eye,
  Settings as SettingsIcon, Calendar, Users,
  Zap, Droplets, Thermometer, Wind
} from 'lucide-react';
import Card from './ui/Card';
import Modal from './Modal';

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  category: 'Electrical' | 'Plumbing' | 'HVAC' | 'General' | 'Security' | 'IT';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  reportedBy: string;
  assignedTo?: string;
  location: string;
  reportedDate: string;
  scheduledDate?: string;
  completedDate?: string;
  estimatedCost: number;
  actualCost?: number;
  notes?: string;
}

interface Asset {
  id: string;
  name: string;
  category: string;
  location: string;
  purchaseDate: string;
  warranty: string;
  status: 'operational' | 'maintenance' | 'broken' | 'retired';
  lastMaintenance: string;
  nextMaintenance: string;
  value: number;
}

const Maintenance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | MaintenanceRequest['status']>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | MaintenanceRequest['priority']>('all');
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'assets' | 'schedule'>('requests');

  // Mock maintenance data
  const maintenanceRequests: MaintenanceRequest[] = [
    {
      id: 'MR001',
      title: 'Classroom AC Unit Not Working',
      description: 'Air conditioning unit in Science Lab 1 stopped working. Room temperature too high for comfortable learning.',
      category: 'HVAC',
      priority: 'high',
      status: 'open',
      reportedBy: 'Sarah Nakato (Teacher)',
      location: 'Science Lab 1',
      reportedDate: '2024-01-25',
      estimatedCost: 250000
    },
    {
      id: 'MR002',
      title: 'Leaking Sink in Staff Room',
      description: 'Water dripping from sink tap in staff room. Creating puddle on floor.',
      category: 'Plumbing',
      priority: 'medium',
      status: 'in_progress',
      reportedBy: 'James Okello (Head Teacher)',
      assignedTo: 'Moses Kiprotich (Maintenance)',
      location: 'Staff Room',
      reportedDate: '2024-01-24',
      scheduledDate: '2024-01-26',
      estimatedCost: 50000
    },
    {
      id: 'MR003',
      title: 'Broken Window in Classroom 3A',
      description: 'Window pane cracked during storm. Needs replacement for security and weather protection.',
      category: 'General',
      priority: 'medium',
      status: 'completed',
      reportedBy: 'Grace Namuleme (Student)',
      assignedTo: 'Peter Mugisha (Maintenance)',
      location: 'Classroom 3A',
      reportedDate: '2024-01-20',
      completedDate: '2024-01-24',
      estimatedCost: 75000,
      actualCost: 80000
    },
    {
      id: 'MR004',
      title: 'Internet Connection Issues',
      description: 'WiFi router in computer lab frequently disconnecting. Affecting IT classes.',
      category: 'IT',
      priority: 'high',
      status: 'open',
      reportedBy: 'David Ssali (IT Teacher)',
      location: 'Computer Lab',
      reportedDate: '2024-01-25',
      estimatedCost: 100000
    }
  ];

  const assets: Asset[] = [
    {
      id: 'AST001',
      name: 'Main Generator',
      category: 'Electrical',
      location: 'Generator Room',
      purchaseDate: '2022-05-15',
      warranty: '2025-05-15',
      status: 'operational',
      lastMaintenance: '2024-01-15',
      nextMaintenance: '2024-04-15',
      value: 15000000
    },
    {
      id: 'AST002',
      name: 'Water Pump System',
      category: 'Plumbing',
      location: 'Pump House',
      purchaseDate: '2021-08-20',
      warranty: '2024-08-20',
      status: 'operational',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-03-10',
      value: 3500000
    },
    {
      id: 'AST003',
      name: 'Central AC Unit',
      category: 'HVAC',
      location: 'Admin Block',
      purchaseDate: '2023-02-10',
      warranty: '2026-02-10',
      status: 'maintenance',
      lastMaintenance: '2024-01-20',
      nextMaintenance: '2024-02-20',
      value: 8000000
    }
  ];

  // Calculate summary statistics
  const totalRequests = maintenanceRequests.length;
  const openRequests = maintenanceRequests.filter(req => req.status === 'open').length;
  const urgentRequests = maintenanceRequests.filter(req => req.priority === 'urgent').length;
  const totalEstimatedCost = maintenanceRequests.reduce((sum, req) => sum + req.estimatedCost, 0);

  // Filter requests
  const filteredRequests = maintenanceRequests.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || req.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800 border-red-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'operational': return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'broken': return 'bg-red-100 text-red-800 border-red-200';
      case 'retired': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return AlertTriangle;
      case 'in_progress': return Clock;
      case 'completed': return CheckCircle;
      case 'operational': return CheckCircle;
      case 'maintenance': return Wrench;
      case 'broken': return AlertTriangle;
      default: return Clock;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Electrical': return Zap;
      case 'Plumbing': return Droplets;
      case 'HVAC': return Wind;
      case 'IT': return SettingsIcon;
      default: return Wrench;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const viewRequest = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setShowRequestModal(true);
  };

  const RequestDetailsModal = () => {
    if (!selectedRequest) return null;

    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Request Information</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">ID:</span> {selectedRequest.id}</p>
              <p><span className="font-medium">Title:</span> {selectedRequest.title}</p>
              <p><span className="font-medium">Category:</span> {selectedRequest.category}</p>
              <p><span className="font-medium">Location:</span> {selectedRequest.location}</p>
              <p><span className="font-medium">Reported By:</span> {selectedRequest.reportedBy}</p>
              <p><span className="font-medium">Reported Date:</span> {selectedRequest.reportedDate}</p>
              {selectedRequest.assignedTo && (
                <p><span className="font-medium">Assigned To:</span> {selectedRequest.assignedTo}</p>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Status & Priority</h4>
            <div className="space-y-3">
              <div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedRequest.status)}`}>
                  {React.createElement(getStatusIcon(selectedRequest.status), { className: "h-4 w-4 mr-2" })}
                  {selectedRequest.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(selectedRequest.priority)}`}>
                  {selectedRequest.priority.toUpperCase()} PRIORITY
                </span>
              </div>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Estimated Cost:</span> {formatCurrency(selectedRequest.estimatedCost)}</p>
                {selectedRequest.actualCost && (
                  <p><span className="font-medium">Actual Cost:</span> {formatCurrency(selectedRequest.actualCost)}</p>
                )}
                {selectedRequest.scheduledDate && (
                  <p><span className="font-medium">Scheduled:</span> {selectedRequest.scheduledDate}</p>
                )}
                {selectedRequest.completedDate && (
                  <p><span className="font-medium">Completed:</span> {selectedRequest.completedDate}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Description</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">{selectedRequest.description}</p>
          </div>
        </div>

        {selectedRequest.notes && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Notes</h4>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">{selectedRequest.notes}</p>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowRequestModal(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Edit Request
          </button>
          {selectedRequest.status === 'open' && (
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Assign Technician
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderRequestsTab = () => (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Maintenance Requests</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3">Request</th>
                <th scope="col" className="px-6 py-3">Category</th>
                <th scope="col" className="px-6 py-3">Priority</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Cost</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => {
                const StatusIcon = getStatusIcon(request.status);
                const CategoryIcon = getCategoryIcon(request.category);
                
                return (
                  <motion.tr
                    key={request.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{request.title}</div>
                        <div className="text-gray-500 dark:text-gray-400">{request.id} • {request.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <CategoryIcon className="h-3 w-3 mr-1" />
                        {request.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                        {request.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {request.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(request.actualCost || request.estimatedCost)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewRequest(request)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                          title="View Request"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          title="Edit Request"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
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
  );

  const renderAssetsTab = () => (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assets & Equipment</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <div key={asset.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">{asset.name}</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(asset.status)}`}>
                  {asset.status.toUpperCase()}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Category:</span> {asset.category}</p>
                <p><span className="font-medium">Location:</span> {asset.location}</p>
                <p><span className="font-medium">Value:</span> {formatCurrency(asset.value)}</p>
                <p><span className="font-medium">Purchase Date:</span> {asset.purchaseDate}</p>
                <p><span className="font-medium">Warranty Until:</span> {asset.warranty}</p>
                <p><span className="font-medium">Last Maintenance:</span> {asset.lastMaintenance}</p>
                <p><span className="font-medium">Next Maintenance:</span> {asset.nextMaintenance}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Maintenance Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track maintenance requests and manage school assets
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowNewRequestModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Request</span>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Schedule Maintenance</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Requests</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalRequests}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Wrench className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Requests</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{openRequests}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Urgent Requests</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{urgentRequests}</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Estimated Costs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalEstimatedCost)}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <SettingsIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'requests', label: 'Maintenance Requests', icon: Wrench },
            { id: 'assets', label: 'Assets & Equipment', icon: SettingsIcon },
            { id: 'schedule', label: 'Maintenance Schedule', icon: Calendar }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      {activeTab === 'requests' && (
        <Card>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                aria-label="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                aria-label="Filter by priority"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>More Filters</span>
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Tab Content */}
      {activeTab === 'requests' && renderRequestsTab()}
      {activeTab === 'assets' && renderAssetsTab()}
      {activeTab === 'schedule' && (
        <Card>
          <div className="p-6 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Maintenance Schedule</h3>
            <p className="text-gray-600 dark:text-gray-400">Scheduled maintenance calendar will be displayed here.</p>
          </div>
        </Card>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          title="Request Details"
          size="lg"
        >
          <RequestDetailsModal />
        </Modal>
      )}

      {/* New Request Modal */}
      <Modal
        isOpen={showNewRequestModal}
        onClose={() => setShowNewRequestModal(false)}
        title="New Maintenance Request"
        size="lg"
      >
        <div className="p-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Wrench className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Create New Maintenance Request</h3>
            <p className="text-gray-600 mb-6">This feature will open a form to submit new maintenance requests.</p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowNewRequestModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Open Request Form
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Maintenance;
