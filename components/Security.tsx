import React, { useState } from 'react';
import { Camera, AlertTriangle, CheckCircle, XCircle, Clock, Users, Key, Monitor } from 'lucide-react';
import Card from './ui/Card';
import Modal from './Modal';

interface SecurityIncident {
  id: string;
  type: 'unauthorized_access' | 'theft' | 'vandalism' | 'emergency' | 'suspicious_activity';
  title: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  reportedBy: string;
  reportedAt: string;
  assignedTo?: string;
  resolvedAt?: string;
}

interface AccessLog {
  id: string;
  personName: string;
  personType: 'student' | 'teacher' | 'staff' | 'visitor';
  action: 'entry' | 'exit';
  location: string;
  timestamp: string;
  method: 'keycard' | 'biometric' | 'manual' | 'visitor_pass';
  status: 'authorized' | 'unauthorized' | 'pending';
}

interface SecurityGuard {
  id: string;
  name: string;
  shift: 'morning' | 'afternoon' | 'night';
  location: string;
  status: 'on_duty' | 'off_duty' | 'break';
  contact: string;
}

const Security: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'incidents' | 'access' | 'guards' | 'cameras'>('incidents');
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<SecurityIncident | null>(null);
  const [incidentFilter, setIncidentFilter] = useState<'all' | 'open' | 'resolved'>('all');

  // Mock data
  const [incidents] = useState<SecurityIncident[]>([
    {
      id: 'inc-001',
      type: 'unauthorized_access',
      title: 'Unauthorized Access to Lab',
      description: 'Student found in computer lab after hours without permission',
      status: 'investigating',
      priority: 'medium',
      location: 'Computer Lab A',
      reportedBy: 'John Kato (Security Guard)',
      reportedAt: '2024-01-15T22:30:00',
      assignedTo: 'Sarah Namuli'
    },
    {
      id: 'inc-002',
      type: 'theft',
      title: 'Missing Equipment',
      description: 'Projector reported missing from classroom',
      status: 'open',
      priority: 'high',
      location: 'Classroom 2B',
      reportedBy: 'Mary Akello (Teacher)',
      reportedAt: '2024-01-15T08:15:00'
    },
    {
      id: 'inc-003',
      type: 'emergency',
      title: 'Medical Emergency',
      description: 'Student collapsed during PE class',
      status: 'resolved',
      priority: 'critical',
      location: 'Sports Field',
      reportedBy: 'James Okello (PE Teacher)',
      reportedAt: '2024-01-14T10:45:00',
      resolvedAt: '2024-01-14T11:30:00'
    }
  ]);

  const [accessLogs] = useState<AccessLog[]>([
    {
      id: 'log-001',
      personName: 'David Mukasa',
      personType: 'student',
      action: 'entry',
      location: 'Main Gate',
      timestamp: '2024-01-15T07:30:00',
      method: 'keycard',
      status: 'authorized'
    },
    {
      id: 'log-002',
      personName: 'Unknown Individual',
      personType: 'visitor',
      action: 'entry',
      location: 'Side Gate',
      timestamp: '2024-01-15T20:15:00',
      method: 'manual',
      status: 'unauthorized'
    },
    {
      id: 'log-003',
      personName: 'Grace Nalongo',
      personType: 'teacher',
      action: 'exit',
      location: 'Main Gate',
      timestamp: '2024-01-15T17:45:00',
      method: 'biometric',
      status: 'authorized'
    }
  ]);

  const [guards] = useState<SecurityGuard[]>([
    {
      id: 'guard-001',
      name: 'John Kato',
      shift: 'night',
      location: 'Main Gate',
      status: 'on_duty',
      contact: '+256 700 123 456'
    },
    {
      id: 'guard-002',
      name: 'Sarah Namuli',
      shift: 'morning',
      location: 'Administration Block',
      status: 'on_duty',
      contact: '+256 700 123 457'
    },
    {
      id: 'guard-003',
      name: 'Peter Mugisha',
      shift: 'afternoon',
      location: 'Dormitory Area',
      status: 'break',
      contact: '+256 700 123 458'
    }
  ]);

  const filteredIncidents = incidents.filter(incident => {
    if (incidentFilter === 'all') return true;
    if (incidentFilter === 'open') return incident.status === 'open' || incident.status === 'investigating';
    if (incidentFilter === 'resolved') return incident.status === 'resolved' || incident.status === 'closed';
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'investigating': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'closed': return <XCircle className="w-4 h-4 text-gray-500" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccessStatusColor = (status: string) => {
    switch (status) {
      case 'authorized': return 'text-green-600';
      case 'unauthorized': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getCameraStatusColor = (status: string) => {
    if (status === 'online') return 'bg-green-500';
    if (status === 'offline') return 'bg-red-500';
    return 'bg-yellow-500';
  };

  const getGuardStatusColor = (status: string) => {
    switch (status) {
      case 'on_duty': return 'bg-green-100 text-green-800';
      case 'off_duty': return 'bg-gray-100 text-gray-800';
      case 'break': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleIncidentClick = (incident: SecurityIncident) => {
    setSelectedIncident(incident);
    setShowIncidentModal(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Security Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor and manage school security</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4" />
          <span>Report Incident</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Incidents</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Guards On Duty</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
            </div>
            <Users className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Access Logs Today</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
            </div>
            <Key className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Cameras</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12/14</p>
            </div>
            <Camera className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'incidents', label: 'Security Incidents', icon: AlertTriangle },
            { id: 'access', label: 'Access Logs', icon: Key },
            { id: 'guards', label: 'Security Guards', icon: Users },
            { id: 'cameras', label: 'Surveillance', icon: Camera }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'incidents' && (
        <div className="space-y-6">
          {/* Incident filters */}
          <div className="flex space-x-4">
            <select
              value={incidentFilter}
              onChange={(e) => setIncidentFilter(e.target.value as any)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              aria-label="Filter incidents by status"
            >
              <option value="all">All Incidents</option>
              <option value="open">Open & Investigating</option>
              <option value="resolved">Resolved & Closed</option>
            </select>
          </div>

          {/* Incidents list */}
          <div className="space-y-4">
            {filteredIncidents.map((incident) => (
              <Card key={incident.id} className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
                <button 
                  onClick={() => handleIncidentClick(incident)}
                  className="w-full text-left"
                  aria-label={`View details for incident: ${incident.title}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(incident.status)}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{incident.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(incident.priority)}`}>
                        {incident.priority.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(incident.reportedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{incident.description}</p>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Location: {incident.location}</span>
                    <span>Reported by: {incident.reportedBy}</span>
                  </div>
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'access' && (
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Access Logs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Person
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {accessLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{log.personName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">{log.personType}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          log.action === 'entry' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {log.action.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {log.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">
                        {log.method.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getAccessStatusColor(log.status)}`}>
                          {log.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'guards' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guards.map((guard) => (
              <Card key={guard.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{guard.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{guard.shift} Shift</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGuardStatusColor(guard.status)}`}>
                    {guard.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Location:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{guard.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Contact:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{guard.contact}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'cameras' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Surveillance System</h3>
              <div className="flex items-center space-x-2">
                <Monitor className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-600 font-medium">System Online</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: 'cam-001', location: 'Main Gate', status: 'online', lastUpdate: '2 minutes ago' },
                { id: 'cam-002', location: 'Parking Area', status: 'online', lastUpdate: '1 minute ago' },
                { id: 'cam-003', location: 'Administration', status: 'offline', lastUpdate: '1 hour ago' },
                { id: 'cam-004', location: 'Library', status: 'online', lastUpdate: '30 seconds ago' },
                { id: 'cam-005', location: 'Cafeteria', status: 'online', lastUpdate: '1 minute ago' },
                { id: 'cam-006', location: 'Sports Field', status: 'maintenance', lastUpdate: '3 hours ago' }
              ].map((camera) => (
                <div key={camera.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Camera className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{camera.location}</span>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${getCameraStatusColor(camera.status)}`}></span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg h-24 flex items-center justify-center mb-3">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Last update: {camera.lastUpdate}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Incident Detail Modal */}
      {showIncidentModal && selectedIncident && (
        <Modal isOpen={showIncidentModal} onClose={() => setShowIncidentModal(false)} title="Incident Details">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(selectedIncident.status)}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedIncident.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedIncident.priority)}`}>
                  {selectedIncident.priority.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</span>
                <p className="text-sm text-gray-900 dark:text-white capitalize">{selectedIncident.type.replace('_', ' ')}</p>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
                <p className="text-sm text-gray-900 dark:text-white capitalize">{selectedIncident.status}</p>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</span>
                <p className="text-sm text-gray-900 dark:text-white">{selectedIncident.location}</p>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reported At</span>
                <p className="text-sm text-gray-900 dark:text-white">{new Date(selectedIncident.reportedAt).toLocaleString()}</p>
              </div>
            </div>
            
            <div>
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</span>
              <p className="text-sm text-gray-900 dark:text-white">{selectedIncident.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reported By</span>
                <p className="text-sm text-gray-900 dark:text-white">{selectedIncident.reportedBy}</p>
              </div>
              {selectedIncident.assignedTo && (
                <div>
                  <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assigned To</span>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedIncident.assignedTo}</p>
                </div>
              )}
            </div>
            
            {selectedIncident.resolvedAt && (
              <div>
                <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">Resolved At</span>
                <p className="text-sm text-gray-900 dark:text-white">{new Date(selectedIncident.resolvedAt).toLocaleString()}</p>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowIncidentModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                Update Status
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Security;
