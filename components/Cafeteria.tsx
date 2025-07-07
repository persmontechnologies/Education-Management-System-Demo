import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UtensilsCrossed, Users, Calendar, DollarSign,
  Search, Filter, Plus, Edit3, Eye,
  Clock, CheckCircle, AlertTriangle, ShoppingCart,
  ChefHat, Apple, Coffee, Settings as SettingsIcon
} from 'lucide-react';
import Card from './ui/Card';
import Modal from './Modal';

interface MenuItem {
  id: string;
  name: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Beverage';
  price: number;
  ingredients: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  allergens: string[];
  availability: 'available' | 'unavailable' | 'seasonal';
  preparationTime: number;
  servingSize: string;
}

interface MealPlan {
  id: string;
  date: string;
  dayOfWeek: string;
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  specialDiet?: {
    vegetarian: string[];
    glutenFree: string[];
    diabetic: string[];
  };
  totalCost: number;
  expectedDiners: number;
}

interface CafeteriaOrder {
  id: string;
  studentId: string;
  studentName: string;
  grade: number;
  orderDate: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner';
  items: { menuItemId: string; quantity: number; price: number; }[];
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'cancelled';
  orderStatus: 'ordered' | 'preparing' | 'ready' | 'served';
  specialRequests?: string;
}

const Cafeteria: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | MenuItem['category']>('all');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'meal-plans'>('menu');

  // Mock cafeteria data
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Ugali with Beef Stew',
      category: 'Lunch',
      price: 8000,
      ingredients: ['Maize flour', 'Beef', 'Tomatoes', 'Onions', 'Cooking oil', 'Salt', 'Spices'],
      nutritionalInfo: { calories: 520, protein: 28, carbs: 45, fat: 18 },
      allergens: ['Gluten'],
      availability: 'available',
      preparationTime: 45,
      servingSize: '1 plate'
    },
    {
      id: '2',
      name: 'Chapati with Beans',
      category: 'Lunch',
      price: 6000,
      ingredients: ['Wheat flour', 'Red beans', 'Cooking oil', 'Onions', 'Tomatoes', 'Spices'],
      nutritionalInfo: { calories: 420, protein: 15, carbs: 65, fat: 12 },
      allergens: ['Gluten'],
      availability: 'available',
      preparationTime: 30,
      servingSize: '2 chapatis with beans'
    },
    {
      id: '3',
      name: 'Porridge with Milk',
      category: 'Breakfast',
      price: 3000,
      ingredients: ['Millet flour', 'Fresh milk', 'Sugar', 'Vanilla'],
      nutritionalInfo: { calories: 280, protein: 12, carbs: 45, fat: 8 },
      allergens: ['Lactose'],
      availability: 'available',
      preparationTime: 15,
      servingSize: '1 cup'
    },
    {
      id: '4',
      name: 'Rice with Chicken',
      category: 'Dinner',
      price: 10000,
      ingredients: ['Rice', 'Chicken', 'Vegetables', 'Cooking oil', 'Spices'],
      nutritionalInfo: { calories: 580, protein: 32, carbs: 55, fat: 20 },
      allergens: [],
      availability: 'available',
      preparationTime: 60,
      servingSize: '1 plate'
    },
    {
      id: '5',
      name: 'Fresh Fruit Juice',
      category: 'Beverage',
      price: 2500,
      ingredients: ['Fresh fruits', 'Water', 'Natural sugar'],
      nutritionalInfo: { calories: 120, protein: 1, carbs: 30, fat: 0 },
      allergens: [],
      availability: 'available',
      preparationTime: 5,
      servingSize: '250ml'
    },
    {
      id: '6',
      name: 'Samosa',
      category: 'Snack',
      price: 1500,
      ingredients: ['Wheat flour', 'Potatoes', 'Peas', 'Spices', 'Cooking oil'],
      nutritionalInfo: { calories: 180, protein: 4, carbs: 22, fat: 8 },
      allergens: ['Gluten'],
      availability: 'available',
      preparationTime: 20,
      servingSize: '2 pieces'
    }
  ];

  const orders: CafeteriaOrder[] = [
    {
      id: 'ORD001',
      studentId: 'S001',
      studentName: 'Sarah Nakato',
      grade: 10,
      orderDate: '2024-01-25',
      mealType: 'Lunch',
      items: [{ menuItemId: '1', quantity: 1, price: 8000 }],
      totalAmount: 8000,
      paymentStatus: 'paid',
      orderStatus: 'served'
    },
    {
      id: 'ORD002',
      studentId: 'S002',
      studentName: 'James Okello',
      grade: 11,
      orderDate: '2024-01-25',
      mealType: 'Lunch',
      items: [
        { menuItemId: '2', quantity: 1, price: 6000 },
        { menuItemId: '5', quantity: 1, price: 2500 }
      ],
      totalAmount: 8500,
      paymentStatus: 'paid',
      orderStatus: 'ready'
    },
    {
      id: 'ORD003',
      studentId: 'S003',
      studentName: 'Grace Namuleme',
      grade: 9,
      orderDate: '2024-01-25',
      mealType: 'Breakfast',
      items: [
        { menuItemId: '3', quantity: 1, price: 3000 },
        { menuItemId: '6', quantity: 2, price: 3000 }
      ],
      totalAmount: 6000,
      paymentStatus: 'pending',
      orderStatus: 'ordered'
    }
  ];

  const mealPlans: MealPlan[] = [
    {
      id: 'MP001',
      date: '2024-01-25',
      dayOfWeek: 'Monday',
      breakfast: ['3', '6'],
      lunch: ['1', '2'],
      dinner: ['4'],
      specialDiet: {
        vegetarian: ['2', '3'],
        glutenFree: ['4', '5'],
        diabetic: ['4', '5']
      },
      totalCost: 450000,
      expectedDiners: 1200
    }
  ];

  // Calculate summary statistics
  const totalMenuItems = menuItems.length;
  const dailyOrders = orders.length;
  const pendingOrders = orders.filter(order => order.orderStatus !== 'served').length;
  const dailyRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  // Filter menu items
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'unavailable': return 'bg-red-100 text-red-800 border-red-200';
      case 'seasonal': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'served': return 'bg-green-100 text-green-800 border-green-200';
      case 'ready': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ordered': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return CheckCircle;
      case 'unavailable': return AlertTriangle;
      case 'seasonal': return Calendar;
      case 'paid': return CheckCircle;
      case 'pending': return Clock;
      case 'ready': return CheckCircle;
      case 'preparing': return ChefHat;
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

  const viewMenuItem = (item: MenuItem) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const MenuItemDetailsModal = () => {
    if (!selectedItem) return null;

    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Item Information</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {selectedItem.name}</p>
              <p><span className="font-medium">Category:</span> {selectedItem.category}</p>
              <p><span className="font-medium">Price:</span> {formatCurrency(selectedItem.price)}</p>
              <p><span className="font-medium">Serving Size:</span> {selectedItem.servingSize}</p>
              <p><span className="font-medium">Prep Time:</span> {selectedItem.preparationTime} minutes</p>
              <p><span className="font-medium">Availability:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedItem.availability)}`}>
                  {selectedItem.availability}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Nutritional Information</h4>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Calories:</span> {selectedItem.nutritionalInfo.calories} kcal</p>
              <p><span className="font-medium">Protein:</span> {selectedItem.nutritionalInfo.protein}g</p>
              <p><span className="font-medium">Carbohydrates:</span> {selectedItem.nutritionalInfo.carbs}g</p>
              <p><span className="font-medium">Fat:</span> {selectedItem.nutritionalInfo.fat}g</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Ingredients</h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex flex-wrap gap-2">
              {selectedItem.ingredients.map((ingredient, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        </div>

        {selectedItem.allergens.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3">Allergens</h4>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {selectedItem.allergens.map((allergen, index) => (
                  <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    {allergen}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowItemModal(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Edit Item
          </button>
        </div>
      </div>
    );
  };

  const renderMenuTab = () => (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Menu Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenuItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.availability)}`}>
                  {React.createElement(getStatusIcon(item.availability), { className: "h-3 w-3 mr-1" })}
                  {item.availability}
                </span>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <p><span className="font-medium">Category:</span> {item.category}</p>
                <p><span className="font-medium">Price:</span> {formatCurrency(item.price)}</p>
                <p><span className="font-medium">Calories:</span> {item.nutritionalInfo.calories} kcal</p>
                <p><span className="font-medium">Prep Time:</span> {item.preparationTime} min</p>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => viewMenuItem(item)}
                  className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  title="Edit Item"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );

  const renderOrdersTab = () => (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Today's Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3">Order ID</th>
                <th scope="col" className="px-6 py-3">Student</th>
                <th scope="col" className="px-6 py-3">Meal Type</th>
                <th scope="col" className="px-6 py-3">Items</th>
                <th scope="col" className="px-6 py-3">Amount</th>
                <th scope="col" className="px-6 py-3">Payment</th>
                <th scope="col" className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const PaymentIcon = getStatusIcon(order.paymentStatus);
                const StatusIcon = getStatusIcon(order.orderStatus);
                
                return (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{order.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{order.studentName}</div>
                        <div className="text-gray-500 dark:text-gray-400">Grade {order.grade}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <UtensilsCrossed className="h-3 w-3 mr-1" />
                        {order.mealType}
                      </span>
                    </td>
                    <td className="px-6 py-4">{order.items.length} item(s)</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-green-600">{formatCurrency(order.totalAmount)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.paymentStatus)}`}>
                        <PaymentIcon className="h-3 w-3 mr-1" />
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {order.orderStatus}
                      </span>
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

  const renderMealPlansTab = () => (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Weekly Meal Plans</h3>
        <div className="space-y-6">
          {mealPlans.map((plan) => (
            <div key={plan.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {plan.dayOfWeek}, {plan.date}
                </h4>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Expected Diners: {plan.expectedDiners} | Budget: {formatCurrency(plan.totalCost)}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                    <Coffee className="h-4 w-4 mr-2" />
                    Breakfast
                  </h5>
                  <div className="space-y-1">
                    {plan.breakfast.map(itemId => {
                      const item = menuItems.find(m => m.id === itemId);
                      return item ? (
                        <p key={itemId} className="text-sm text-gray-600 dark:text-gray-400">• {item.name}</p>
                      ) : null;
                    })}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                    <UtensilsCrossed className="h-4 w-4 mr-2" />
                    Lunch
                  </h5>
                  <div className="space-y-1">
                    {plan.lunch.map(itemId => {
                      const item = menuItems.find(m => m.id === itemId);
                      return item ? (
                        <p key={itemId} className="text-sm text-gray-600 dark:text-gray-400">• {item.name}</p>
                      ) : null;
                    })}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                    <Apple className="h-4 w-4 mr-2" />
                    Dinner
                  </h5>
                  <div className="space-y-1">
                    {plan.dinner.map(itemId => {
                      const item = menuItems.find(m => m.id === itemId);
                      return item ? (
                        <p key={itemId} className="text-sm text-gray-600 dark:text-gray-400">• {item.name}</p>
                      ) : null;
                    })}
                  </div>
                </div>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cafeteria Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage school meals, orders, and nutrition
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setShowNewItemModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Menu Item</span>
          </button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <ShoppingCart className="h-4 w-4" />
            <span>Kitchen Orders</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Menu Items</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalMenuItems}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <UtensilsCrossed className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Orders</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{dailyOrders}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <ShoppingCart className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Orders</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{pendingOrders}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Daily Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(dailyRevenue)}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'menu', label: 'Menu Items', icon: UtensilsCrossed },
            { id: 'orders', label: 'Orders', icon: ShoppingCart },
            { id: 'meal-plans', label: 'Meal Plans', icon: Calendar }
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
      {activeTab === 'menu' && (
        <Card>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search menu items..."
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
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
                <option value="Beverage">Beverage</option>
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
      {activeTab === 'menu' && renderMenuTab()}
      {activeTab === 'orders' && renderOrdersTab()}
      {activeTab === 'meal-plans' && renderMealPlansTab()}

      {/* Menu Item Details Modal */}
      {selectedItem && (
        <Modal
          isOpen={showItemModal}
          onClose={() => setShowItemModal(false)}
          title="Menu Item Details"
          size="lg"
        >
          <MenuItemDetailsModal />
        </Modal>
      )}

      {/* New Menu Item Modal */}
      <Modal
        isOpen={showNewItemModal}
        onClose={() => setShowNewItemModal(false)}
        title="Add New Menu Item"
        size="lg"
      >
        <div className="p-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <UtensilsCrossed className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Add New Menu Item</h3>
            <p className="text-gray-600 mb-6">This feature will open a form to add new items to the cafeteria menu.</p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowNewItemModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Open Menu Form
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Cafeteria;
