import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bus, Users, 
  Search, Filter, Plus, Edit3, 
  Clock, CheckCircle, AlertTriangle, Eye,
  Route, Settings as SettingsIcon, Phone
} from 'lucide-react';
import Card from './ui/Card';
import Modal from './Modal';

interface TransportRoute {
  id: string;
  routeName: string;
  routeNumber: string;
  startLocation: string;
  endLocation: string;
  stops: string[];
  distance: number;
  duration: number;
  fare: number;
  status: 'active' | 'inactive' | 'maintenance';
  driverId: string;
  vehicleId: string;
  schedule: {
    morning: { departure: string; arrival: string; };
    evening: { departure: string; arrival: string; };
  };
  capacity: number;
  currentRiders: number;
}

interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  year: number;
  capacity: number;
  fuelType: 'Petrol' | 'Diesel';
  status: 'active' | 'maintenance' | 'out_of_service';
  lastService: string;
  nextService: string;
  driverId?: string;
}

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  phone: string;
  experience: number;
  status: 'active' | 'inactive' | 'on_leave';
  assignedVehicle?: string;
  emergencyContact: string;
}

const Transport: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TransportRoute['status']>('all');
  const [selectedRoute, setSelectedRoute] = useState<TransportRoute | null>(null);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [showNewRouteModal, setShowNewRouteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'routes' | 'vehicles' | 'drivers'>('routes');

  // Mock transport data
  const routes: TransportRoute[] = [
    {
      id: '1',
      routeName: 'Kampala Central Route',
      routeNumber: 'R001',
      startLocation: 'Kampala City Center',
      endLocation: 'EduSys Pro School',
      stops: ['Clock Tower', 'Garden City', 'Nakawa Market', 'Bugolobi', 'School Gate'],
      distance: 12.5,
      duration: 45,
      fare: 5000,
      status: 'active',
      driverId: 'D001',
      vehicleId: 'V001',
      schedule: {
        morning: { departure: '06:30', arrival: '07:15' },
        evening: { departure: '17:00', arrival: '17:45' }
      },
      capacity: 50,
      currentRiders: 42
    },
    {
      id: '2',
      routeName: 'Entebbe Route',
      routeNumber: 'R002',
      startLocation: 'Entebbe Town',
      endLocation: 'EduSys Pro School',
      stops: ['Entebbe Airport', 'Kajjansi', 'Munyonyo', 'Buziga', 'School Gate'],
      distance: 28.0,
      duration: 75,
      fare: 8000,
      status: 'active',
      driverId: 'D002',
      vehicleId: 'V002',
      schedule: {
        morning: { departure: '06:00', arrival: '07:15' },
        evening: { departure: '17:00', arrival: '18:15' }
      },
      capacity: 45,
      currentRiders: 38
    },
    {
      id: '3',
      routeName: 'Mukono Route',
      routeNumber: 'R003',
      startLocation: 'Mukono Town',
      endLocation: 'EduSys Pro School',
      stops: ['Mukono Market', 'Seeta', 'Namilyango', 'Kyaliwajjala', 'School Gate'],
      distance: 22.0,
      duration: 60,
      fare: 6000,
      status: 'maintenance',
      driverId: 'D003',
      vehicleId: 'V003',
      schedule: {
        morning: { departure: '06:15', arrival: '07:15' },
        evening: { departure: '17:00', arrival: '18:00' }
      },
      capacity: 40,
      currentRiders: 0
    }
  ];

  const vehicles: Vehicle[] = [
    {
      id: 'V001',
      plateNumber: 'UBA 123X',
      model: 'Toyota Hiace',
      year: 2020,
      capacity: 50,
      fuelType: 'Diesel',
      status: 'active',
      lastService: '2024-01-15',
      nextService: '2024-04-15',
      driverId: 'D001'
    },
    {
      id: 'V002',
      plateNumber: 'UBB 456Y',
      model: 'Nissan Urvan',
      year: 2019,
      capacity: 45,
      fuelType: 'Petrol',
      status: 'active',
      lastService: '2024-01-10',
      nextService: '2024-04-10',
      driverId: 'D002'
    },
    {
      id: 'V003',
      plateNumber: 'UBC 789Z',
      model: 'Toyota Coaster',
      year: 2018,
      capacity: 40,
      fuelType: 'Diesel',
      status: 'maintenance',
      lastService: '2024-01-20',
      nextService: '2024-02-20',
      driverId: 'D003'
    }
  ];

  const drivers: Driver[] = [
    {
      id: 'D001',
      firstName: 'Robert',
      lastName: 'Mugisha',
      licenseNumber: 'DL001234',
      phone: '+256 700 123456',
      experience: 8,
      status: 'active',
      assignedVehicle: 'V001',
      emergencyContact: '+256 701 654321'
    },
    {
      id: 'D002',
      firstName: 'Sarah',
      lastName: 'Nakato',
      licenseNumber: 'DL005678',
      phone: '+256 702 234567',
      experience: 5,
      status: 'active',
      assignedVehicle: 'V002',
      emergencyContact: '+256 703 765432'
    },
    {
      id: 'D003',
      firstName: 'James',
      lastName: 'Okello',
      licenseNumber: 'DL009012',
      phone: '+256 704 345678',
      experience: 12,
      status: 'on_leave',
      assignedVehicle: 'V003',
      emergencyContact: '+256 705 876543'
    }
  ];

  // Calculate summary statistics
  const totalRoutes = routes.length;
  const activeRoutes = routes.filter(route => route.status === 'active').length;
  const totalRiders = routes.reduce((sum, route) => sum + route.currentRiders, 0);
  const vehiclesInService = vehicles.filter(vehicle => vehicle.status === 'active').length;

  // Filter routes
  const filteredRoutes = routes.filter(route => {
    const matchesSearch = route.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.routeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.startLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || route.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out_of_service': return 'bg-red-100 text-red-800 border-red-200';
      case 'on_leave': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'maintenance': return SettingsIcon;
      case 'inactive': return Clock;
      case 'out_of_service': return AlertTriangle;
      default: return Clock;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'out_of_service': return 'Out of Service';
      case 'on_leave': return 'On Leave';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const viewRoute = (route: TransportRoute) => {
    setSelectedRoute(route);
    setShowRouteModal(true);
  };

  const RouteDetailsModal = () => {
    if (!selectedRoute) return null;

    const driver = drivers.find(d => d.id === selectedRoute.driverId);
    const vehicle = vehicles.find(v => v.id === selectedRoute.vehicleId);
    const occupancyRate = (selectedRoute.currentRiders / selectedRoute.capacity) * 100;

    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Route Information</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Route:</span> {selectedRoute.routeName}</p>
              <p><span className="font-medium">Number:</span> {selectedRoute.routeNumber}</p>
              <p><span className="font-medium">From:</span> {selectedRoute.startLocation}</p>
              <p><span className="font-medium">To:</span> {selectedRoute.endLocation}</p>
              <p><span className="font-medium">Distance:</span> {selectedRoute.distance} km</p>
              <p><span className="font-medium">Duration:</span> {selectedRoute.duration} minutes</p>
              <p><span className="font-medium">Fare:</span> {formatCurrency(selectedRoute.fare)}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Schedule & Capacity</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Morning Departure:</span> {selectedRoute.schedule.morning.departure}</p>
              <p><span className="font-medium">Morning Arrival:</span> {selectedRoute.schedule.morning.arrival}</p>
              <p><span className="font-medium">Evening Departure:</span> {selectedRoute.schedule.evening.departure}</p>
              <p><span className="font-medium">Evening Arrival:</span> {selectedRoute.schedule.evening.arrival}</p>
              <p><span className="font-medium">Capacity:</span> {selectedRoute.capacity} students</p>
              <p><span className="font-medium">Current Riders:</span> {selectedRoute.currentRiders} students</p>
              <p><span className="font-medium">Occupancy:</span> {occupancyRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Route Stops</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2">
              {selectedRoute.stops.map((stop, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </div>
                  <span className="text-sm">{stop}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {driver && vehicle && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Assigned Driver</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {driver.firstName} {driver.lastName}</p>
                  <p><span className="font-medium">License:</span> {driver.licenseNumber}</p>
                  <p><span className="font-medium">Phone:</span> {driver.phone}</p>
                  <p><span className="font-medium">Experience:</span> {driver.experience} years</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Assigned Vehicle</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Plate Number:</span> {vehicle.plateNumber}</p>
                  <p><span className="font-medium">Model:</span> {vehicle.model}</p>
                  <p><span className="font-medium">Year:</span> {vehicle.year}</p>
                  <p><span className="font-medium">Fuel Type:</span> {vehicle.fuelType}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowRouteModal(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Edit Route
          </button>
        </div>
      </div>
    );
  };

  const renderRoutesTab = () => (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transport Routes</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3">Route</th>
                <th scope="col" className="px-6 py-3">Route Info</th>
                <th scope="col" className="px-6 py-3">Schedule</th>
                <th scope="col" className="px-6 py-3">Capacity</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.map((route) => {
                const StatusIcon = getStatusIcon(route.status);
                const occupancyRate = (route.currentRiders / route.capacity) * 100;
                
                return (
                  <motion.tr
                    key={route.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{route.routeName}</div>
                        <div className="text-gray-500 dark:text-gray-400">{route.routeNumber} • {formatCurrency(route.fare)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-gray-900 dark:text-white">{route.startLocation} → {route.endLocation}</div>
                        <div className="text-gray-500 dark:text-gray-400">{route.distance} km • {route.duration} min</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-gray-900 dark:text-white">Morning: {route.schedule.morning.departure}</div>
                        <div className="text-gray-500 dark:text-gray-400">Evening: {route.schedule.evening.departure}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{route.currentRiders}/{route.capacity}</div>
                        <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`bg-blue-600 h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${occupancyRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(route.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {getStatusText(route.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewRoute(route)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                          title="View Route"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          title="Edit Route"
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

  const renderVehiclesTab = () => (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Fleet Vehicles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">{vehicle.plateNumber}</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(vehicle.status)}`}>
                  {getStatusText(vehicle.status)}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Model:</span> {vehicle.model}</p>
                <p><span className="font-medium">Year:</span> {vehicle.year}</p>
                <p><span className="font-medium">Capacity:</span> {vehicle.capacity} passengers</p>
                <p><span className="font-medium">Fuel:</span> {vehicle.fuelType}</p>
                <p><span className="font-medium">Last Service:</span> {vehicle.lastService}</p>
                <p><span className="font-medium">Next Service:</span> {vehicle.nextService}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );

  const renderDriversTab = () => (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Drivers</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {drivers.map((driver) => (
            <div key={driver.id} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">{driver.firstName} {driver.lastName}</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(driver.status)}`}>
                  {getStatusText(driver.status)}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">License:</span> {driver.licenseNumber}</p>
                <p className="flex items-center">
                  <Phone className="h-3 w-3 mr-1" />
                  <span className="font-medium">Phone:</span> <span className="ml-1">{driver.phone}</span>
                </p>
                <p><span className="font-medium">Experience:</span> {driver.experience} years</p>
                {driver.assignedVehicle && (
                  <p><span className="font-medium">Vehicle:</span> {vehicles.find(v => v.id === driver.assignedVehicle)?.plateNumber}</p>
                )}
                <p><span className="font-medium">Emergency:</span> {driver.emergencyContact}</p>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Transport Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage school transportation routes and fleet
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowNewRouteModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Route</span>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Route className="h-4 w-4" />
            <span>Route Planner</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Routes</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalRoutes}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Route className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Routes</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{activeRoutes}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Riders</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalRiders}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vehicles in Service</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{vehiclesInService}</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
              <Bus className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'routes', label: 'Routes', icon: Route },
            { id: 'vehicles', label: 'Vehicles', icon: Bus },
            { id: 'drivers', label: 'Drivers', icon: Users }
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
      {activeTab === 'routes' && (
        <Card>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search routes..."
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
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
      {activeTab === 'routes' && renderRoutesTab()}
      {activeTab === 'vehicles' && renderVehiclesTab()}
      {activeTab === 'drivers' && renderDriversTab()}

      {/* Route Details Modal */}
      {selectedRoute && (
        <Modal
          isOpen={showRouteModal}
          onClose={() => setShowRouteModal(false)}
          title="Route Details"
          size="xl"
        >
          <RouteDetailsModal />
        </Modal>
      )}

      {/* New Route Modal */}
      <Modal
        isOpen={showNewRouteModal}
        onClose={() => setShowNewRouteModal(false)}
        title="Add New Route"
        size="lg"
      >
        <div className="p-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Bus className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New Transport Route</h3>
            <p className="text-gray-600 mb-6">This feature will open a form to create new transport routes.</p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowNewRouteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Open Route Form
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Transport;
