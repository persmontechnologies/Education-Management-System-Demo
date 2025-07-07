import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, TrendingDown, TrendingUp, AlertTriangle,
  Search, Plus, Edit3, Trash2, Eye,
  Boxes, ShoppingCart, BarChart3, RefreshCw,
  CheckCircle, XCircle, Clock
} from 'lucide-react';
import Card from './ui/Card';
import Modal from './Modal';

interface InventoryItem {
  id: string;
  name: string;
  category: 'Stationery' | 'Books' | 'Electronics' | 'Furniture' | 'Sports' | 'Laboratory' | 'Cleaning' | 'Medical';
  sku: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  totalValue: number;
  supplier: string;
  location: string;
  lastRestocked: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstocked';
  unit: string;
  description?: string;
}

const getStockColorClass = (stockPercentage: number): string => {
  if (stockPercentage <= 25) return 'bg-red-500';
  if (stockPercentage <= 50) return 'bg-yellow-500';
  if (stockPercentage <= 85) return 'bg-green-500';
  return 'bg-blue-500';
};

const ItemDetailsModal: React.FC<{ item: InventoryItem }> = ({ item }) => {
  const stockPercentage = (item.currentStock / item.maxStock) * 100;

  const getStatusColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800 border-green-200';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out_of_stock': return 'bg-red-100 text-red-800 border-red-200';
      case 'overstocked': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in_stock': return CheckCircle;
      case 'low_stock': return AlertTriangle;
      case 'out_of_stock': return XCircle;
      case 'overstocked': return TrendingUp;
      default: return Clock;
    }
  };

  const getStatusText = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in_stock': return 'In Stock';
      case 'low_stock': return 'Low Stock';
      case 'out_of_stock': return 'Out of Stock';
      case 'overstocked': return 'Overstocked';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Item Information</h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Name:</span> {item.name}</p>
            <p><span className="font-medium">SKU:</span> {item.sku}</p>
            <p><span className="font-medium">Category:</span> {item.category}</p>
            <p><span className="font-medium">Unit:</span> {item.unit}</p>
            <p><span className="font-medium">Location:</span> {item.location}</p>
            <p><span className="font-medium">Supplier:</span> {item.supplier}</p>
            {item.description && (
              <p><span className="font-medium">Description:</span> {item.description}</p>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Stock Information</h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Current Stock:</span> {item.currentStock} {item.unit}</p>
            <p><span className="font-medium">Minimum Stock:</span> {item.minStock} {item.unit}</p>
            <p><span className="font-medium">Maximum Stock:</span> {item.maxStock} {item.unit}</p>
            <p><span className="font-medium">Unit Price:</span> {formatCurrency(item.unitPrice)}</p>
            <p><span className="font-medium">Total Value:</span> {formatCurrency(item.totalValue)}</p>
            <p><span className="font-medium">Last Restocked:</span> {item.lastRestocked}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Stock Level</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(item.status)}`}>
              {React.createElement(getStatusIcon(item.status), { className: "h-4 w-4 mr-2" })}
              {getStatusText(item.status)}
            </span>
            <span className="text-sm text-gray-600">{item.currentStock}/{item.maxStock} {item.unit}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${getStockColorClass(stockPercentage)}`}
              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
            />
          </div>
          <div className="grid grid-cols-3 text-xs text-gray-500">
            <div>Min: {item.minStock}</div>
            <div className="text-center">Current: {item.currentStock}</div>
            <div className="text-right">Max: {item.maxStock}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Edit Item
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Restock
        </button>
      </div>
    </div>
  );
};

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | InventoryItem['category']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | InventoryItem['status']>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showNewItemModal, setShowNewItemModal] = useState(false);

  // Mock inventory data
  const inventoryItems: InventoryItem[] = [
    {
      id: '1',
      name: 'A4 Paper',
      category: 'Stationery',
      sku: 'STA-001',
      currentStock: 500,
      minStock: 100,
      maxStock: 1000,
      unitPrice: 50,
      totalValue: 25000,
      supplier: 'Paper Plus Ltd',
      location: 'Store Room A',
      lastRestocked: '2024-01-15',
      status: 'in_stock',
      unit: 'reams',
      description: 'White A4 copy paper, 80gsm'
    },
    {
      id: '2',
      name: 'Mathematics Textbooks S4',
      category: 'Books',
      sku: 'BK-MTH-004',
      currentStock: 45,
      minStock: 50,
      maxStock: 200,
      unitPrice: 25000,
      totalValue: 1125000,
      supplier: 'Uganda Educational Publishers',
      location: 'Library Store',
      lastRestocked: '2024-01-10',
      status: 'low_stock',
      unit: 'books'
    },
    {
      id: '3',
      name: 'Projector - Epson',
      category: 'Electronics',
      sku: 'ELE-PRJ-001',
      currentStock: 3,
      minStock: 2,
      maxStock: 5,
      unitPrice: 1500000,
      totalValue: 4500000,
      supplier: 'Tech Solutions Uganda',
      location: 'AV Equipment Room',
      lastRestocked: '2023-12-20',
      status: 'in_stock',
      unit: 'units'
    },
    {
      id: '4',
      name: 'Student Desks',
      category: 'Furniture',
      sku: 'FUR-DSK-001',
      currentStock: 0,
      minStock: 10,
      maxStock: 100,
      unitPrice: 120000,
      totalValue: 0,
      supplier: 'Kampala Furniture Works',
      location: 'Warehouse',
      lastRestocked: '2023-11-15',
      status: 'out_of_stock',
      unit: 'pieces'
    },
    {
      id: '5',
      name: 'Football',
      category: 'Sports',
      sku: 'SPT-FB-001',
      currentStock: 15,
      minStock: 5,
      maxStock: 20,
      unitPrice: 35000,
      totalValue: 525000,
      supplier: 'Sports World Uganda',
      location: 'Sports Store',
      lastRestocked: '2024-01-05',
      status: 'in_stock',
      unit: 'balls'
    },
    {
      id: '6',
      name: 'Chemistry Lab Beakers',
      category: 'Laboratory',
      sku: 'LAB-BKR-250',
      currentStock: 8,
      minStock: 12,
      maxStock: 30,
      unitPrice: 15000,
      totalValue: 120000,
      supplier: 'Scientific Equipment Ltd',
      location: 'Chemistry Lab Store',
      lastRestocked: '2023-12-28',
      status: 'low_stock',
      unit: 'pieces'
    },
    {
      id: '7',
      name: 'Toilet Paper',
      category: 'Cleaning',
      sku: 'CLN-TP-001',
      currentStock: 150,
      minStock: 50,
      maxStock: 100,
      unitPrice: 2500,
      totalValue: 375000,
      supplier: 'Hygiene Supplies Co',
      location: 'Cleaning Store',
      lastRestocked: '2024-01-20',
      status: 'overstocked',
      unit: 'rolls'
    },
    {
      id: '8',
      name: 'First Aid Kit',
      category: 'Medical',
      sku: 'MED-FK-001',
      currentStock: 5,
      minStock: 3,
      maxStock: 10,
      unitPrice: 45000,
      totalValue: 225000,
      supplier: 'Medical Supplies Uganda',
      location: 'Sick Bay',
      lastRestocked: '2024-01-12',
      status: 'in_stock',
      unit: 'kits'
    }
  ];

  // Calculate summary statistics
  const totalItems = inventoryItems.length;
  const totalValue = inventoryItems.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = inventoryItems.filter(item => item.status === 'low_stock' || item.status === 'out_of_stock').length;
  const outOfStockItems = inventoryItems.filter(item => item.status === 'out_of_stock').length;

  // Filter items
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800 border-green-200';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'out_of_stock': return 'bg-red-100 text-red-800 border-red-200';
      case 'overstocked': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in_stock': return CheckCircle;
      case 'low_stock': return AlertTriangle;
      case 'out_of_stock': return XCircle;
      case 'overstocked': return TrendingUp;
      default: return Clock;
    }
  };

  const getStatusText = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in_stock': return 'In Stock';
      case 'low_stock': return 'Low Stock';
      case 'out_of_stock': return 'Out of Stock';
      case 'overstocked': return 'Overstocked';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const viewItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inventory Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage school supplies and equipment
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowNewItemModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Item</span>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <ShoppingCart className="h-4 w-4" />
            <span>Purchase Order</span>
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Reports</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Items</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalItems}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalValue)}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{lowStockItems}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Out of Stock</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{outOfStockItems}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
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
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              aria-label="Filter by category"
            >
              <option value="all">All Categories</option>
              <option value="Stationery">Stationery</option>
              <option value="Books">Books</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Sports">Sports</option>
              <option value="Laboratory">Laboratory</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Medical">Medical</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="overstocked">Overstocked</option>
            </select>

            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Inventory Table */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Inventory Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3">Item</th>
                  <th scope="col" className="px-6 py-3">Category</th>
                  <th scope="col" className="px-6 py-3">Stock</th>
                  <th scope="col" className="px-6 py-3">Unit Price</th>
                  <th scope="col" className="px-6 py-3">Total Value</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const StatusIcon = getStatusIcon(item.status);
                  
                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{item.name}</div>
                          <div className="text-gray-500 dark:text-gray-400">{item.sku} • {item.location}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Boxes className="h-3 w-3 mr-1" />
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{item.currentStock} {item.unit}</div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">Min: {item.minStock} | Max: {item.maxStock}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-green-600">{formatCurrency(item.totalValue)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {getStatusText(item.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewItem(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                            title="View Item"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            title="Edit Item"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* Item Details Modal */}
      {selectedItem && (
        <Modal
          isOpen={showItemModal}
          onClose={() => setShowItemModal(false)}
          title="Item Details"
          size="lg"
        >
          <ItemDetailsModal item={selectedItem} />
        </Modal>
      )}

      {/* New Item Modal */}
      <Modal
        isOpen={showNewItemModal}
        onClose={() => setShowNewItemModal(false)}
        title="Add New Item"
        size="lg"
      >
        <div className="p-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New Inventory Item</h3>
            <p className="text-gray-600 mb-6">This feature will open a form to add new items to the inventory.</p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowNewItemModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Open Item Form
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Inventory;
