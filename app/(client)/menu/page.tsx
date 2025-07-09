"use client";
import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaStar, FaShoppingCart } from 'react-icons/fa';
import ProductCard from '@/components/ProductCard';
import { useCart } from '../../../context/CartContext';
import { useRouter } from 'next/navigation';

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
  const [loading, setLoading] = useState(true);
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  const categories = [
    { value: 'all', label: 'All Regions' },
    { value: 'adamawa', label: 'Adamawa' },
    { value: 'centre', label: 'Centre' },
    { value: 'east', label: 'East' },
    { value: 'far_north', label: 'Far North' },
    { value: 'littoral', label: 'Littoral' },
    { value: 'north', label: 'North' },
    { value: 'northwest', label: 'Northwest' },
    { value: 'west', label: 'West' },
    { value: 'south', label: 'South' },
    { value: 'southwest', label: 'Southwest' }
  ];

  // Replace sampleProducts with Cameroonian dishes
  const sampleProducts: Product[] = [
    {
      id: '1',
      name: 'Ndolé',
      price: 2500,
      image: '/assets/ndole.jpg',
      description: 'A rich stew of bitter leaves, peanuts, and meat or fish. Signature dish of the Littoral region.',
      category: 'littoral',
      rating: 4.9,
      stock: 10
    },
    {
      id: '2',
      name: 'Eru & Water Fufu',
      price: 2000,
      image: '/assets/eru.jpg',
      description: 'Eru leaves cooked with waterleaf, palm oil, and assorted meats. Popular in Southwest.',
      category: 'southwest',
      rating: 4.8,
      stock: 12
    },
    {
      id: '3',
      name: 'Achu & Yellow Soup',
      price: 2200,
      image: '/assets/achu.jpg',
      description: 'Pounded cocoyams with spicy yellow soup, a Northwest delicacy.',
      category: 'northwest',
      rating: 4.7,
      stock: 8
    },
    {
      id: '4',
      name: 'Koki Beans',
      price: 1800,
      image: '/assets/koki.jpg',
      description: 'Steamed black-eyed peas with red palm oil, a Littoral and Southwest favorite.',
      category: 'littoral',
      rating: 4.6,
      stock: 15
    },
    {
      id: '5',
      name: 'Mbongo Tchobi',
      price: 2300,
      image: '/assets/mbongo.jpg',
      description: 'Spicy black stew made with native spices and fish, from the Centre region.',
      category: 'centre',
      rating: 4.8,
      stock: 9
    },
    {
      id: '6',
      name: 'Sanga',
      price: 1700,
      image: '/assets/sanga.jpg',
      description: 'Mixture of maize, cassava leaves, and palm oil, popular in the South.',
      category: 'south',
      rating: 4.5,
      stock: 11
    },
    {
      id: '7',
      name: 'Kilishi',
      price: 2000,
      image: '/assets/kilishi.jpg',
      description: 'Spicy dried beef, a specialty of the North and Far North.',
      category: 'far_north',
      rating: 4.7,
      stock: 7
    },
    {
      id: '8',
      name: 'Ndomba',
      price: 2100,
      image: '/assets/ndomba.jpg',
      description: 'Fish or chicken wrapped in leaves and steamed with spices, common in the East.',
      category: 'east',
      rating: 4.6,
      stock: 10
    },
    {
      id: '9',
      name: 'Fufu Corn & Njama Njama',
      price: 1900,
      image: '/assets/njama.jpg',
      description: 'Corn fufu served with huckleberry leaves, a Northwest and West favorite.',
      category: 'west',
      rating: 4.8,
      stock: 13
    },
    {
      id: '10',
      name: 'Foléré Juice',
      price: 800,
      image: '/assets/folere.jpg',
      description: 'Refreshing hibiscus flower juice, enjoyed across Adamawa and North.',
      category: 'adamawa',
      rating: 4.9,
      stock: 20
    }
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

  const getCartItemCount = () => {
    return Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  };

  const getCartTotal = () => {
    return Object.values(cart).reduce((total, item) => total + (item.product.price * item.quantity), 0);
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
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors relative" onClick={() => router.push('/cart')}>
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
                    {product.price} FCFA
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
                    <span className="text-xl font-bold text-red-600">{product.price} FCFA</span>
                    <div className="flex items-center gap-2">
                      {cart[product.id]?.quantity > 0 && (
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
                        >
                          -
                        </button>
                      )}
                      {cart[product.id]?.quantity > 0 && (
                        <span className="text-sm font-semibold">{cart[product.id].quantity}</span>
                      )}
                      <button
                        onClick={() => addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image: product.image,
                          description: product.description
                        })}
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
                  Total: {getCartTotal().toFixed(0)} FCFA
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={clearCart}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Cart
                </button>
                <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors" onClick={() => router.push('/cart')}>
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
