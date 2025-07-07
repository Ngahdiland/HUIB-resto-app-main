"use client";
import React, { useState } from 'react';
import { FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaPlus, FaDownload, FaUpload } from 'react-icons/fa';

const ManageProducts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Sample products data
  const products = [
    {
      id: 'PROD-001',
      name: 'Ndolé',
      description: 'A rich stew of bitter leaves, peanuts, and meat or fish. Signature dish of the Littoral region.',
      category: 'Littoral',
      price: 2500,
      originalPrice: 2800,
      stock: 50,
      status: 'active',
      rating: 4.9,
      reviews: 156,
      image: '/assets/ndole.jpg',
      tags: ['Traditional', 'Stew', 'Littoral'],
      ingredients: ['Bitter leaves', 'Peanuts', 'Meat', 'Fish', 'Palm oil'],
      allergens: ['Peanuts'],
      preparationTime: '40-50 minutes',
      calories: 350,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-15'
    },
    {
      id: 'PROD-002',
      name: 'Eru & Water Fufu',
      description: 'Eru leaves cooked with waterleaf, palm oil, and assorted meats. Popular in Southwest.',
      category: 'Southwest',
      price: 2000,
      originalPrice: 2200,
      stock: 30,
      status: 'active',
      rating: 4.8,
      reviews: 89,
      image: '/assets/eru.jpg',
      tags: ['Traditional', 'Vegetable', 'Southwest'],
      ingredients: ['Eru', 'Waterleaf', 'Palm oil', 'Meat', 'Fish'],
      allergens: [],
      preparationTime: '35-45 minutes',
      calories: 320,
      createdAt: '2024-01-08',
      updatedAt: '2024-01-12'
    },
    {
      id: 'PROD-003',
      name: 'Achu & Yellow Soup',
      description: 'Pounded cocoyams with spicy yellow soup, a Northwest delicacy.',
      category: 'Northwest',
      price: 2200,
      originalPrice: 2500,
      stock: 20,
      status: 'active',
      rating: 4.7,
      reviews: 67,
      image: '/assets/achu.jpg',
      tags: ['Traditional', 'Soup', 'Northwest'],
      ingredients: ['Cocoyams', 'Palm oil', 'Spices', 'Meat'],
      allergens: [],
      preparationTime: '30-40 minutes',
      calories: 300,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-14'
    },
    {
      id: 'PROD-004',
      name: 'Koki Beans',
      description: 'Steamed black-eyed peas with red palm oil, a Littoral and Southwest favorite.',
      category: 'Littoral',
      price: 1800,
      originalPrice: 2000,
      stock: 25,
      status: 'inactive',
      rating: 4.6,
      reviews: 43,
      image: '/assets/koki.jpg',
      tags: ['Traditional', 'Beans', 'Littoral'],
      ingredients: ['Black-eyed peas', 'Palm oil', 'Banana leaves'],
      allergens: [],
      preparationTime: '25-35 minutes',
      calories: 280,
      createdAt: '2024-01-03',
      updatedAt: '2024-01-10'
    },
    {
      id: 'PROD-005',
      name: 'Mbongo Tchobi',
      description: 'Spicy black stew made with native spices and fish, from the Centre region.',
      category: 'Centre',
      price: 2300,
      originalPrice: 2500,
      stock: 18,
      status: 'active',
      rating: 4.8,
      reviews: 51,
      image: '/assets/mbongo.jpg',
      tags: ['Traditional', 'Stew', 'Centre'],
      ingredients: ['Fish', 'Mbongo spice', 'Palm oil'],
      allergens: ['Fish'],
      preparationTime: '40-50 minutes',
      calories: 340,
      createdAt: '2024-01-02',
      updatedAt: '2024-01-09'
    }
  ];

  const categories = ['Adamawa', 'Centre', 'East', 'Far North', 'Littoral', 'North', 'Northwest', 'West', 'South', 'Southwest'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockColor = (stock: number) => {
    if (stock > 20) return 'text-green-600';
    if (stock > 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(product => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
          <p className="text-gray-600">View and manage all products in your menu</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
            <FaUpload />
            Import
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <FaDownload />
            Export
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
            <FaPlus />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              <FaFilter />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedProducts.length} product(s) selected
            </span>
            <div className="flex gap-2">
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors">
                Activate
              </button>
              <button className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors">
                Deactivate
              </button>
              <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <input
                type="checkbox"
                checked={selectedProducts.includes(product.id)}
                onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                className="absolute top-3 left-3 z-10 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                  {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">{product.price} FCFA</p>
                  {product.originalPrice > product.price && (
                    <p className="text-sm text-gray-500 line-through">{product.originalPrice} FCFA</p>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                </div>
                <span className={`text-sm font-medium ${getStockColor(product.stock)}`}>
                  Stock: {product.stock}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {product.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                <div>
                  <span className="font-medium">Category:</span> {product.category}
                </div>
                <div>
                  <span className="font-medium">Prep Time:</span> {product.preparationTime}
                </div>
                <div>
                  <span className="font-medium">Calories:</span> {product.calories}
                </div>
                <div>
                  <span className="font-medium">Allergens:</span> {product.allergens.length}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                  <FaEye />
                  View
                </button>
                <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-1">
                  <FaEdit />
                  Edit
                </button>
                <button className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-1">
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg shadow-md px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
            <span className="font-medium">{filteredProducts.length}</span> results
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 text-sm bg-red-600 text-white rounded">1</button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">3</button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
