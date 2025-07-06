"use client";
import React, { useState } from 'react';
import { FaStar, FaEnvelope, FaPhone, FaComments, FaExclamationTriangle, FaCheckCircle, FaTimes } from 'react-icons/fa';

interface Review {
  id: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Complaint {
  id: string;
  type: 'delivery' | 'food_quality' | 'service' | 'payment' | 'other';
  subject: string;
  description: string;
  date: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
}

const Support = () => {
  const [activeTab, setActiveTab] = useState('review');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [complaintType, setComplaintType] = useState('delivery');
  const [complaintSubject, setComplaintSubject] = useState('');
  const [complaintDescription, setComplaintDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const complaintTypes = [
    { value: 'delivery', label: 'Delivery Issue' },
    { value: 'food_quality', label: 'Food Quality' },
    { value: 'service', label: 'Customer Service' },
    { value: 'payment', label: 'Payment Problem' },
    { value: 'other', label: 'Other' }
  ];

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    // TODO: Implement review submission
    console.log('Review submitted:', { rating, comment });
    setSubmitted(true);
    setRating(0);
    setComment('');
  };

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintSubject || !complaintDescription) {
      alert('Please fill in all fields');
      return;
    }
    
    // TODO: Implement complaint submission
    console.log('Complaint submitted:', { 
      type: complaintType, 
      subject: complaintSubject, 
      description: complaintDescription 
    });
    setSubmitted(true);
    setComplaintType('delivery');
    setComplaintSubject('');
    setComplaintDescription('');
  };

  const handleReset = () => {
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Customer Support</h1>
          <p className="text-gray-600 mt-2">We're here to help! Get in touch with our support team.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <FaPhone className="text-3xl text-red-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Phone Support</h3>
              <p className="text-gray-600">+1 (555) 123-4567</p>
              <p className="text-sm text-gray-500">Mon-Fri: 9AM-6PM</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <FaEnvelope className="text-3xl text-red-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Email Support</h3>
              <p className="text-gray-600">support@huibapp.com</p>
              <p className="text-sm text-gray-500">24/7 Response</p>
            </div>
            <div className="text-center p-4 border border-gray-200 rounded-lg">
              <FaComments className="text-3xl text-red-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800 mb-2">Live Chat</h3>
              <p className="text-gray-600">Available on website</p>
              <p className="text-sm text-gray-500">Instant Support</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('review')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'review' 
                ? 'border-red-600 text-red-600' 
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Leave a Review
          </button>
          <button
            onClick={() => setActiveTab('complaint')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'complaint' 
                ? 'border-red-600 text-red-600' 
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Submit Complaint
          </button>
          <button
            onClick={() => setActiveTab('help')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'help' 
                ? 'border-red-600 text-red-600' 
                : 'border-transparent text-gray-600 hover:text-gray-800'
            }`}
          >
            Help Center
          </button>
        </div>

        {/* Review Tab */}
        {activeTab === 'review' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Leave a Review</h2>
            
            {submitted ? (
              <div className="text-center py-8">
                <FaCheckCircle className="text-6xl text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Review Submitted!</h3>
                <p className="text-gray-600 mb-6">Thank you for your feedback. We appreciate your input!</p>
                <button
                  onClick={handleReset}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Submit Another Review
                </button>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`text-3xl transition-colors ${
                          star <= rating ? 'text-yellow-500' : 'text-gray-300'
                        }`}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {rating === 0 && 'Click on a star to rate'}
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Review</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Share your experience with us..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>
        )}

        {/* Complaint Tab */}
        {activeTab === 'complaint' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaExclamationTriangle />
              Submit a Complaint
            </h2>
            
            {submitted ? (
              <div className="text-center py-8">
                <FaCheckCircle className="text-6xl text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Complaint Submitted!</h3>
                <p className="text-gray-600 mb-6">
                  We've received your complaint and will address it within 24 hours. 
                  You'll receive an email confirmation shortly.
                </p>
                <button
                  onClick={handleReset}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Submit Another Complaint
                </button>
              </div>
            ) : (
              <form onSubmit={handleComplaintSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Issue Type</label>
                  <select
                    value={complaintType}
                    onChange={(e) => setComplaintType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {complaintTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={complaintSubject}
                    onChange={(e) => setComplaintSubject(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Brief description of the issue"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Description</label>
                  <textarea
                    value={complaintDescription}
                    onChange={(e) => setComplaintDescription(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Please provide detailed information about your issue..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Submit Complaint
                </button>
              </form>
            )}
          </div>
        )}

        {/* Help Center Tab */}
        {activeTab === 'help' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg">
                  <button className="w-full text-left p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold text-gray-800">How do I track my order?</h3>
                  </button>
                  <div className="px-4 pb-4">
                    <p className="text-gray-600">
                      You can track your order in real-time through your profile page. 
                      We'll also send you SMS updates as your order progresses.
                    </p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg">
                  <button className="w-full text-left p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold text-gray-800">What is your delivery time?</h3>
                  </button>
                  <div className="px-4 pb-4">
                    <p className="text-gray-600">
                      Standard delivery time is 30-45 minutes. For orders over $50, 
                      delivery is free. Otherwise, there's a $5.99 delivery fee.
                    </p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg">
                  <button className="w-full text-left p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold text-gray-800">Can I cancel my order?</h3>
                  </button>
                  <div className="px-4 pb-4">
                    <p className="text-gray-600">
                      You can cancel your order within 5 minutes of placing it. 
                      After that, please contact our support team for assistance.
                    </p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg">
                  <button className="w-full text-left p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold text-gray-800">What payment methods do you accept?</h3>
                  </button>
                  <div className="px-4 pb-4">
                    <p className="text-gray-600">
                      We accept all major credit cards, debit cards, and digital wallets 
                      including PayPal, Apple Pay, and Google Pay.
                    </p>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg">
                  <button className="w-full text-left p-4 hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold text-gray-800">How do I report a problem with my order?</h3>
                  </button>
                  <div className="px-4 pb-4">
                    <p className="text-gray-600">
                      You can submit a complaint through this support page, call our 
                      support line, or email us directly. We'll respond within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <h3 className="font-semibold text-gray-800 mb-2">Track My Order</h3>
                  <p className="text-sm text-gray-600">Check the status of your current order</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <h3 className="font-semibold text-gray-800 mb-2">View Order History</h3>
                  <p className="text-sm text-gray-600">See all your past orders</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <h3 className="font-semibold text-gray-800 mb-2">Update Profile</h3>
                  <p className="text-sm text-gray-600">Change your delivery information</p>
                </button>
                <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <h3 className="font-semibold text-gray-800 mb-2">Contact Support</h3>
                  <p className="text-sm text-gray-600">Get help from our support team</p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;
