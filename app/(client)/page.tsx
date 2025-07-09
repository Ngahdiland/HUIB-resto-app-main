"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaStar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowRight, FaCheck, FaUser, FaComment } from 'react-icons/fa';
import ClientFooter from '@/components/client-footer';
import { useCart } from '../../context/CartContext';
import { products as importedProducts } from '@/public/assets/assets';
import ProductCard from '@/components/ProductCard';

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
              <option value="all">All Categories</option>
              {[...new Set(importedProducts.map(p => p.category))].map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {importedProducts
              .filter(product => selectedCategory === 'all' || product.category === selectedCategory)
              .slice() // copy to avoid mutating original
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 4)
              .map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image[0]?.src}
                  description={product.description + ' (' + product.category + ')'}
                  rating={product.rating}
                  onAddToCart={() => {}}
                />
              ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-6">About CCF Resto</h2>
              <p className="text-base md:text-lg text-gray-600 mb-4 md:mb-6">
                CCF Resto is Cameroon's premier food ordering platform, celebrating the rich culinary heritage of Cameroon. We connect you with the best local chefs and restaurants, bringing authentic traditional meals from all regions of Cameroon right to your doorstep.
              </p>
              <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">
                From Ndolé and Eru in the Southwest, to Achu in the Northwest, Koki from the Littoral, and Sanga from the Center, our menu is a journey through Cameroon's diverse and delicious food culture. Experience the taste of home, wherever you are in Cameroon!
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-red-600">10K+</div>
                  <div className="text-xs md:text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-red-600">50+</div>
                  <div className="text-xs md:text-sm text-gray-600">Restaurant Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-red-600">30min</div>
                  <div className="text-xs md:text-sm text-gray-600">Average Delivery</div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <img 
                src="/assets/contact-img.jpg" 
                alt="About CCF Resto" 
                className="w-full max-w-sm md:max-w-md mx-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How to Order */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How to Order</h2>
            <p className="text-lg md:text-xl text-gray-600">Simple steps to get your favorite food</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-lg md:text-2xl font-bold mx-auto mb-3 md:mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-sm md:text-base text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-lg md:text-xl text-gray-600">Get in touch with our team</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-4 md:p-6 bg-white rounded-lg shadow-md">
              <div className="text-2xl md:text-3xl text-red-600 mb-3 md:mb-4">
                <FaPhone />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Phone</h3>
              <p className="text-sm md:text-base text-gray-600">+1 (555) 123-4567</p>
            </div>
            <div className="text-center p-4 md:p-6 bg-white rounded-lg shadow-md">
              <div className="text-2xl md:text-3xl text-red-600 mb-3 md:mb-4">
                <FaEnvelope />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Email</h3>
              <p className="text-sm md:text-base text-gray-600">info@CCFResto.com</p>
            </div>
            <div className="text-center p-4 md:p-6 bg-white rounded-lg shadow-md">
              <div className="text-2xl md:text-3xl text-red-600 mb-3 md:mb-4">
                <FaMapMarkerAlt />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Address</h3>
              <p className="text-sm md:text-base text-gray-600">123 Food Street, Cuisine City</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Customer Reviews</h2>
            <p className="text-lg md:text-xl text-gray-600">What our customers say about us</p>
          </div>

          {/* Review Form */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800">Leave a Review</h3>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <FaComment />
                  {showReviewForm ? 'Cancel' : 'Write Review'}
                </button>
              </div>

              {showReviewForm && (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={reviewForm.name}
                        onChange={(e) => handleReviewChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={reviewForm.email}
                        onChange={(e) => handleReviewChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleReviewChange('rating', star)}
                          className={`text-2xl ${
                            star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                          } hover:text-yellow-400 transition-colors`}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Share your experience with us..."
                      required
                    />
                  </div>

                  {reviewMessage && (
                    <div className={`p-3 rounded-lg ${
                      reviewMessage.includes('Thank you') 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {reviewMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Display Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.length > 0 ? (
              reviews.map((review: any) => (
                <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                        <FaUser />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{review.name}</h4>
                        <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`text-sm ${
                            star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <FaComment className="text-4xl text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No reviews yet. Be the first to leave a review!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 md:py-16 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 text-red-100">
            Subscribe to our newsletter for the latest offers and updates
          </p>
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
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
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
