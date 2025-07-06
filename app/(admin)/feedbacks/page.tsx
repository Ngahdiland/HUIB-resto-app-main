"use client";
import React, { useState } from 'react';
import { FaSearch, FaFilter, FaEye, FaReply, FaStar, FaDownload, FaPrint, FaThumbsUp, FaThumbsDown, FaComment } from 'react-icons/fa';

const Feedbacks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Sample feedbacks data
  const feedbacks = [
    {
      id: 'FB-001',
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: '/assets/profile.jpg'
      },
      orderId: 'ORD-001',
      rating: 5,
      title: 'Excellent Service!',
      message: 'The food was amazing and delivery was super fast. Will definitely order again!',
      type: 'review',
      status: 'published',
      date: '2024-01-15 14:30',
      response: null,
      responseDate: null,
      category: 'food_quality',
      tags: ['positive', 'delivery', 'food'],
      helpful: 12,
      notHelpful: 1,
      images: ['/assets/food1.jpg'],
      sentiment: 'positive'
    },
    {
      id: 'FB-002',
      customer: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: '/assets/profile.jpg'
      },
      orderId: 'ORD-002',
      rating: 3,
      title: 'Good but could be better',
      message: 'Food was okay but took longer than expected. The packaging could be improved.',
      type: 'review',
      status: 'pending',
      date: '2024-01-15 13:45',
      response: null,
      responseDate: null,
      category: 'delivery',
      tags: ['neutral', 'delivery', 'packaging'],
      helpful: 5,
      notHelpful: 2,
      images: [],
      sentiment: 'neutral'
    },
    {
      id: 'FB-003',
      customer: {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        avatar: '/assets/profile.jpg'
      },
      orderId: 'ORD-003',
      rating: 1,
      title: 'Very disappointed',
      message: 'Order was wrong and customer service was unhelpful. Will not order again.',
      type: 'complaint',
      status: 'resolved',
      date: '2024-01-15 13:20',
      response: 'We apologize for the inconvenience. We have issued a full refund and will investigate the issue.',
      responseDate: '2024-01-15 16:30',
      category: 'customer_service',
      tags: ['negative', 'refund', 'service'],
      helpful: 8,
      notHelpful: 0,
      images: ['/assets/food2.jpg'],
      sentiment: 'negative'
    },
    {
      id: 'FB-004',
      customer: {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        avatar: '/assets/profile.jpg'
      },
      orderId: 'ORD-004',
      rating: 4,
      title: 'Great experience overall',
      message: 'Food was delicious and fresh. Delivery was on time. Minor issue with packaging.',
      type: 'suggestion',
      status: 'reviewed',
      date: '2024-01-15 12:55',
      response: 'Thank you for your feedback. We are working on improving our packaging.',
      responseDate: '2024-01-15 15:20',
      category: 'packaging',
      tags: ['positive', 'suggestion', 'packaging'],
      helpful: 15,
      notHelpful: 1,
      images: [],
      sentiment: 'positive'
    },
    {
      id: 'FB-005',
      customer: {
        name: 'David Brown',
        email: 'david@example.com',
        avatar: '/assets/profile.jpg'
      },
      orderId: 'ORD-005',
      rating: 5,
      title: 'Best pizza ever!',
      message: 'The pizza was absolutely perfect. Crispy crust, fresh toppings, and delivered hot. 10/10!',
      type: 'review',
      status: 'published',
      date: '2024-01-15 11:30',
      response: 'Thank you for the amazing review! We\'re glad you enjoyed your pizza.',
      responseDate: '2024-01-15 14:15',
      category: 'food_quality',
      tags: ['positive', 'pizza', 'delivery'],
      helpful: 23,
      notHelpful: 0,
      images: ['/assets/food1.jpg', '/assets/food2.jpg'],
      sentiment: 'positive'
    }
  ];

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-purple-100 text-purple-800';
      case 'hidden': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'review': return 'bg-blue-100 text-blue-800';
      case 'complaint': return 'bg-red-100 text-red-800';
      case 'suggestion': return 'bg-green-100 text-green-800';
      case 'question': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      case 'neutral': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'} text-sm`}
      />
    ));
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'all' || 
                         (ratingFilter === '5' && feedback.rating === 5) ||
                         (ratingFilter === '4' && feedback.rating === 4) ||
                         (ratingFilter === '3' && feedback.rating === 3) ||
                         (ratingFilter === '2' && feedback.rating === 2) ||
                         (ratingFilter === '1' && feedback.rating === 1);
    const matchesStatus = statusFilter === 'all' || feedback.status === statusFilter;
    const matchesType = typeFilter === 'all' || feedback.type === typeFilter;
    return matchesSearch && matchesRating && matchesStatus && matchesType;
  });

  const averageRating = feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;
  const totalReviews = feedbacks.filter(f => f.type === 'review').length;
  const totalComplaints = feedbacks.filter(f => f.type === 'complaint').length;
  const resolvedComplaints = feedbacks.filter(f => f.type === 'complaint' && f.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Feedback Management</h1>
          <p className="text-gray-600">Monitor and respond to customer feedback</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
            <FaDownload />
            Export
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <FaPrint />
            Print
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaStar className="text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-800">{averageRating.toFixed(1)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaComment className="text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-800">{totalReviews}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <FaThumbsDown className="text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Complaints</p>
              <p className="text-2xl font-bold text-gray-800">{totalComplaints}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaThumbsUp className="text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-800">{resolvedComplaints}</p>
            </div>
          </div>
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
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="review">Review</option>
              <option value="complaint">Complaint</option>
              <option value="suggestion">Suggestion</option>
              <option value="question">Question</option>
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

      {/* Feedbacks List */}
      <div className="space-y-4">
        {filteredFeedbacks.map((feedback) => (
          <div key={feedback.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={feedback.customer.avatar}
                  alt={feedback.customer.name}
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{feedback.title}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(feedback.type)}`}>
                      {feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(feedback.status)}`}>
                      {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSentimentColor(feedback.sentiment)}`}>
                      {feedback.sentiment.charAt(0).toUpperCase() + feedback.sentiment.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span className="font-medium">{feedback.customer.name}</span>
                    <span>{feedback.customer.email}</span>
                    <span>Order: {feedback.orderId}</span>
                    <span>{feedback.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex">
                      {renderStars(feedback.rating)}
                    </div>
                    <span className={`text-sm font-medium ${getRatingColor(feedback.rating)}`}>
                      {feedback.rating}/5
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-blue-600 hover:text-blue-900" title="View Details">
                  <FaEye />
                </button>
                {!feedback.response && (
                  <button className="text-green-600 hover:text-green-900" title="Reply">
                    <FaReply />
                  </button>
                )}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 mb-3">{feedback.message}</p>
              {feedback.images.length > 0 && (
                <div className="flex space-x-2 mb-3">
                  {feedback.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Feedback image ${index + 1}`}
                      className="h-20 w-20 object-cover rounded"
                    />
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-1">
                {feedback.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {feedback.response && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium text-blue-800">Admin Response</span>
                  <span className="text-xs text-blue-600">{feedback.responseDate}</span>
                </div>
                <p className="text-blue-700">{feedback.response}</p>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span>Category: {feedback.category.replace('_', ' ')}</span>
                <span>Helpful: {feedback.helpful}</span>
                <span>Not Helpful: {feedback.notHelpful}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="text-green-600 hover:text-green-700">
                  <FaThumbsUp className="text-sm" />
                </button>
                <button className="text-red-600 hover:text-red-700">
                  <FaThumbsDown className="text-sm" />
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
            <span className="font-medium">{filteredFeedbacks.length}</span> results
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

export default Feedbacks;
