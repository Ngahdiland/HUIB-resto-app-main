"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaStar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowRight, FaCheck, FaUser, FaComment } from 'react-icons/fa';
import ClientFooter from '@/components/client-footer';
import { useCart } from '../../context/CartContext';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  originalPrice: number;
  stock: number;
  status: string;
  rating: number;
  reviews: number;
  image: any[];
  tags: string[];
  ingredients: string[];
  allergens: string[];
  preparationTime: string;
  calories: number;
  createdAt: string;
  updatedAt: string;
}

const Home = () => {
  const [email, setEmail] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
    // TODO: Implement newsletter subscription
  };

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        if (response.ok) {
          const data = await response.json();
          // Only show approved reviews
          const approvedReviews = data.reviews.filter((review: any) => review.approved);
          setReviews(approvedReviews);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    setReviewMessage('');

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm),
      });

      const data = await response.json();

      if (response.ok) {
        setReviewMessage('Thank you! Your review has been submitted and is pending approval.');
        setReviewForm({ name: '', email: '', rating: 5, comment: '' });
        setShowReviewForm(false);
      } else {
        setReviewMessage(data.error || 'Failed to submit review. Please try again.');
      }
    } catch (error) {
      setReviewMessage('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleReviewChange = (field: string, value: string | number) => {
    setReviewForm(prev => ({ ...prev, [field]: value }));
  };

  const features = [
    {
      icon: '🚚',
      title: 'Fast Delivery',
      description: 'Get your food delivered within 30 minutes'
    },
    {
      icon: '🍽️',
      title: 'Fresh Ingredients',
      description: 'We use only the freshest ingredients'
    },
    {
      icon: '💰',
      title: 'Best Prices',
      description: 'Competitive prices for quality food'
    },
    {
      icon: '⭐',
      title: 'Top Rated',
      description: 'Rated 4.8+ by thousands of customers'
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Browse Menu',
      description: 'Explore our delicious menu items'
    },
    {
      number: '2',
      title: 'Add to Cart',
      description: 'Select your favorite items'
    },
    {
      number: '3',
      title: 'Checkout',
      description: 'Complete your order securely'
    },
    {
      number: '4',
      title: 'Enjoy!',
      description: 'Get your food delivered to your door'
    }
  ];

  const { addToCart } = useCart();

  // Filter products by category
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter((product: Product) => product.category === selectedCategory);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map((p: Product) => p.category)))];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-12 md:py-20">
        <div className="w-full px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                Delicious Food Delivered to Your Door
              </h1>
              <p className="text-lg md:text-xl mb-6 md:mb-8 text-red-100">
                Order your favorite meals from the best restaurants in town. 
                Fast delivery, fresh ingredients, and amazing taste guaranteed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link 
                  href="/menu" 
                  className="bg-white text-red-600 px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors text-center"
                >
                  Order Now
                </Link>
                <Link 
                  href="/#about" 
                  className="border-2 border-white text-white px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="text-center">
              <img 
                src="/assets/hero_img.jpg" 
                alt="Delicious Food" 
                className="w-full max-w-sm md:max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose CCF Resto?</h2>
            <p className="text-lg md:text-xl text-gray-600">We provide the best food delivery experience</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-4 md:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-3xl md:text-4xl mb-3 md:mb-4">{feature.icon}</div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm md:text-base text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Traditional Products */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Top Traditional Products</h2>
            <p className="text-lg md:text-xl text-gray-600">Discover the most loved traditional Cameroonian dishes</p>
          </div>
          <div className="flex justify-end mb-4">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.slice(0, 8).map((product: Product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image[0]}
                  description={product.description}
                  rating={product.rating}
                  category={product.category}
                  onAddToCart={() => addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image[0],
                    description: product.description
                  })}
                />
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link 
              href="/menu" 
              className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              View All Products
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-lg md:text-xl text-gray-600">Ordering food has never been easier</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-sm md:text-base text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-lg md:text-xl text-gray-600">Read reviews from our satisfied customers</p>
          </div>
          
          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {reviews.slice(0, 6).map((review: any, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <FaUser className="text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{review.name}</h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>

          {/* Leave Review Button */}
          <div className="text-center">
            <button
              onClick={() => setShowReviewForm(true)}
              className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              <FaComment className="mr-2" />
              Leave a Review
            </button>
          </div>
        </div>
      </section>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Leave a Review</h3>
              <button
                onClick={() => setShowReviewForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            {reviewMessage && (
              <div className={`p-3 rounded-lg mb-4 ${
                reviewMessage.includes('Thank you') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {reviewMessage}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={reviewForm.name}
                  onChange={(e) => handleReviewChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={reviewForm.email}
                  onChange={(e) => handleReviewChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleReviewChange('rating', star)}
                      className={`text-2xl ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => handleReviewChange('comment', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* About Section */}
      <section id="about" className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">About CCF Resto</h2>
              <p className="text-lg text-gray-600 mb-6">
                We are passionate about bringing the authentic taste of Cameroonian cuisine to your doorstep. 
                Our team of expert chefs uses traditional recipes and fresh, locally-sourced ingredients to create 
                dishes that capture the rich flavors and cultural heritage of Cameroon.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span>Fresh, locally-sourced ingredients</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span>Traditional cooking methods</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span>Fast and reliable delivery</span>
                </div>
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-3" />
                  <span>Excellent customer service</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <img 
                src="/assets/about_img.jpg" 
                alt="About CCF Resto" 
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-lg md:text-xl text-gray-600">Get in touch with us for any questions or support</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <FaPhone className="text-3xl text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Phone</h3>
              <p className="text-gray-600">+237 123 456 789</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <FaEnvelope className="text-3xl text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Email</h3>
              <p className="text-gray-600">info@ccfresto.com</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <FaMapMarkerAlt className="text-3xl text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Address</h3>
              <p className="text-gray-600">Douala, Cameroon</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 md:py-16 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg md:text-xl mb-6 text-red-100">
            Subscribe to our newsletter for the latest updates and special offers
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* <ClientFooter /> */}
    </div>
  );
};

export default Home;
