"use client";
import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaStar, FaShoppingCart } from 'react-icons/fa';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  stock: number;
}

const Menu = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  // Sample products data (replace with API call)
  const sampleProducts: Product[] = [
    {
      id: '1',
      name: 'Pizza Margherita',
      price: 12.99,
      image: '/assets/p_img1.png',
      description: 'Fresh mozzarella, tomato sauce, and basil',
      category: 'pizza',
      rating: 4.8,
      stock: 10
    },
    {
      id: '2',
      name: 'Burger Deluxe',
      price: 9.99,
      image: '/assets/p_img2.png',
      description: 'Juicy beef patty with fresh vegetables',
      category: 'burger',
      rating: 4.6,
      stock: 15
    },
    {
      id: '3',
      name: 'Sushi Platter',
      price: 19.99,
      image: '/assets/p_img3.png',
      description: 'Fresh salmon, tuna, and avocado rolls',
      category: 'sushi',
      rating: 4.9,
      stock: 8
    },
    {
      id: '4',
      name: 'Pasta Carbonara',
      price: 11.99,
      image: '/assets/p_img4.png',
      description: 'Creamy pasta with bacon and parmesan',
      category: 'pasta',
      rating: 4.7,
      stock: 12
    },
    {
      id: '5',
      name: 'Chicken Wings',
      price: 8.99,
      image: '/assets/p_img5.png',
      description: 'Crispy wings with your choice of sauce',
      category: 'appetizer',
      rating: 4.5,
      stock: 20
    },
    {
      id: '6',
      name: 'Caesar Salad',
      price: 7.99,
      image: '/assets/p_img6.png',
      description: 'Fresh romaine lettuce with caesar dressing',
      category: 'salad',
      rating: 4.4,
      stock: 15
    },
    {
      id: '7',
      name: 'Steak Fajitas',
      price: 16.99,
      image: '/assets/p_img7.png',
      description: 'Grilled steak with peppers and onions',
      category: 'mexican',
      rating: 4.8,
      stock: 6
    },
    {
      id: '8',
      name: 'Chocolate Cake',
      price: 5.99,
      image: '/assets/p_img8.png',
      description: 'Rich chocolate cake with ganache',
      category: 'dessert',
      rating: 4.9,
      stock: 10
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'pizza', label: 'Pizza' },
    { value: 'burger', label: 'Burgers' },
    { value: 'sushi', label: 'Sushi' },
    { value: 'pasta', label: 'Pasta' },
    { value: 'appetizer', label: 'Appetizers' },
    { value: 'salad', label: 'Salads' },
    { value: 'mexican', label: 'Mexican' },
    { value: 'dessert', label: 'Desserts' }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(sampleProducts);
      setFilteredProducts(sampleProducts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId] -= 1;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const getCartItemCount = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [productId, count]) => {
      const product = products.find(p => p.id === productId);
      return total + (product?.price || 0) * count;
    }, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Our Menu</h1>
              <p className="text-gray-600">Discover delicious dishes from around the world</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search dishes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors relative">
                <FaShoppingCart className="inline mr-2" />
                Cart ({getCartItemCount()})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-600" />
              <span className="font-semibold text-gray-700">Filters:</span>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Sort by Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-sm font-semibold">
                    ${product.price}
                  </div>
                  {product.stock < 5 && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                      Low Stock
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                    <div className="flex items-center text-yellow-500">
                      <FaStar />
                      <span className="ml-1 text-sm">{product.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-red-600">${product.price}</span>
                    <div className="flex items-center gap-2">
                      {cart[product.id] > 0 && (
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          -
                        </button>
                      )}
                      {cart[product.id] > 0 && (
                        <span className="text-sm font-semibold">{cart[product.id]}</span>
                      )}
                      <button
                        onClick={() => addToCart(product.id)}
                        disabled={product.stock === 0}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Summary (Fixed at bottom) */}
      {getCartItemCount() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  {getCartItemCount()} items in cart
                </p>
                <p className="text-lg font-bold text-red-600">
                  Total: ${getCartTotal().toFixed(2)}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setCart({})}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Cart
                </button>
                <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
