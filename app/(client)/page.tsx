"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { FaStar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaArrowRight, FaCheck } from 'react-icons/fa';
import ClientFooter from '@/components/client-footer';

const Home = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
    // TODO: Implement newsletter subscription
  };

  const topFoods = [
    {
      id: 1,
      name: 'Pizza Margherita',
      price: 12.99,
      image: '/assets/p_img1.png',
      rating: 4.8,
      description: 'Fresh mozzarella, tomato sauce, and basil'
    },
    {
      id: 2,
      name: 'Burger Deluxe',
      price: 9.99,
      image: '/assets/p_img2.png',
      rating: 4.6,
      description: 'Juicy beef patty with fresh vegetables'
    },
    {
      id: 3,
      name: 'Sushi Platter',
      price: 19.99,
      image: '/assets/p_img3.png',
      rating: 4.9,
      description: 'Fresh salmon, tuna, and avocado rolls'
    },
    {
      id: 4,
      name: 'Pasta Carbonara',
      price: 11.99,
      image: '/assets/p_img4.png',
      rating: 4.7,
      description: 'Creamy pasta with bacon and parmesan'
    }
  ];

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
                src="/assets/hero_img.png" 
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

      {/* Top Foods of the Week */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Top Foods of the Week</h2>
            <p className="text-lg md:text-xl text-gray-600">Most popular dishes this week</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {topFoods.map((food) => (
              <div key={food.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={food.image} 
                  alt={food.name} 
                  className="w-full h-40 md:h-48 object-cover"
                />
                <div className="p-3 md:p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800">{food.name}</h3>
                    <div className="flex items-center text-yellow-500">
                      <FaStar />
                      <span className="ml-1 text-xs md:text-sm">{food.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 mb-3">{food.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg md:text-xl font-bold text-red-600">{food.price} FCFA</span>
                    <button className="bg-red-600 text-white px-3 md:px-4 py-1 md:py-2 rounded hover:bg-red-700 transition-colors text-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
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
                src="/assets/about_img.png" 
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
