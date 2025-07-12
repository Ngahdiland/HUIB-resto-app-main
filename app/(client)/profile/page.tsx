"use client";
import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTimes, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaCheck, FaTruck, FaComment, FaStar, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import SessionManager from '@/utils/sessionManager';
import Link from 'next/link';

interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  region: string;
}

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'preparing' | 'delivering' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface Transaction {
  id?: string;
  date: string;
  amount?: number;
  type?: 'payment' | 'refund';
  description?: string;
  paymentId?: string;
  paymentMethod?: string;
  phoneNumber?: string;
  status?: string;
  action?: string;
  amountPaid?: number;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    topic: '',
    feedback: ''
  });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    // Load user from session manager
    const sessionManager = SessionManager.getInstance();
    const currentUser = sessionManager.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // Fetch orders for this user
      fetch(`/api/orders/user?email=${encodeURIComponent(currentUser.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.orders) setOrders(data.orders);
        });
      // Fetch payments for this user
      fetch(`/api/payments/user?email=${encodeURIComponent(currentUser.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.payments) setTransactions(data.payments);
        });
    }
    setLoading(false);
  }, []);

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (res.status === 200 && data.user) {
        setUser(data.user);
        // Update session with new user data
        const sessionManager = SessionManager.getInstance();
        sessionManager.createSession(data.user);
        setIsEditing(false);
        alert('Profile updated!');
      } else {
        alert(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      alert('Server error.');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset user data to original
    const sessionManager = SessionManager.getInstance();
    const currentUser = sessionManager.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  };

  const handleLeaveFeedback = (order: Order) => {
    setSelectedOrder(order);
    setFeedbackForm({
      name: user?.name || '',
      topic: '',
      feedback: ''
    });
    setShowFeedbackForm(true);
    setFeedbackMessage('');
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    setFeedbackMessage('');

    try {
      const response = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...feedbackForm,
          orderId: selectedOrder?.id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setFeedbackMessage('Thank you! Your feedback has been submitted and is pending approval.');
        setFeedbackForm({ name: '', topic: '', feedback: '' });
        setShowFeedbackForm(false);
        setSelectedOrder(null);
      } else {
        setFeedbackMessage(data.error || 'Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      setFeedbackMessage('Failed to submit feedback. Please try again.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleFeedbackChange = (field: string, value: string) => {
    setFeedbackForm(prev => ({ ...prev, [field]: value }));
  };

  // Format timestamp to readable date and time
  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Sort items based on selected criteria
  const sortItems = (items: any[]) => {
    return [...items].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date || '');
          bValue = new Date(b.date || '');
          break;
        case 'total':
        case 'amount':
          aValue = a.total || a.amountPaid || a.amount || 0;
          bValue = b.total || b.amountPaid || b.amount || 0;
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'id':
          aValue = a.id || a.paymentId || '';
          bValue = b.id || b.paymentId || '';
          break;
        default:
          aValue = new Date(a.date || '');
          bValue = new Date(b.date || '');
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const handleSortChange = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'delivering': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'preparing': return '👨‍🍳';
      case 'delivering': return '🚚';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h2>
          <p className="text-gray-600">
            Please log in to view your profile.
          </p>
          <Link
            href="/login"
            className="inline-block mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  const sortedOrders = sortItems(orders);
  const sortedTransactions = sortItems(transactions);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600">Manage your account and view your orders</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'orders'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'transactions'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Transactions ({transactions.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSaveProfile}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                          <FaSave />
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                        >
                          <FaTimes />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                      >
                        <FaEdit />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaUser />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={user.name}
                      onChange={(e) => setUser(prev => prev ? { ...prev, name: e.target.value } : null)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaEnvelope />
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaPhone />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={user.phone}
                      onChange={(e) => setUser(prev => prev ? { ...prev, phone: e.target.value } : null)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaMapMarkerAlt />
                      Address
                    </label>
                    <input
                      type="text"
                      value={user.address}
                      onChange={(e) => setUser(prev => prev ? { ...prev, address: e.target.value } : null)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Region</label>
                    <input
                      type="text"
                      value={user.region}
                      onChange={(e) => setUser(prev => prev ? { ...prev, region: e.target.value } : null)}
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                {/* Sort Controls */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">My Orders</h2>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    >
                      <option value="date">Sort by Date</option>
                      <option value="total">Sort by Total</option>
                      <option value="status">Sort by Status</option>
                      <option value="id">Sort by ID</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent flex items-center gap-2 text-sm"
                    >
                      {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                      {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
                    </button>
                  </div>
                </div>

                {sortedOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No orders found.</p>
                  </div>
                ) : (
                  sortedOrders.map((order) => (
                    <div key={order.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Order #{order.id}</h3>
                          <p className="text-gray-600">{formatTimestamp(order.date)}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-red-600">{order.total.toFixed(0)} FCFA</div>
                          <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                            <span className="mr-1">{getStatusIcon(order.status)}</span>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.name} x{item.quantity}</span>
                            <span>{(item.price * item.quantity).toFixed(0)} FCFA</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="border-t pt-4 flex justify-between items-center">
                        <button className="text-red-600 hover:text-red-800 transition-colors text-sm font-semibold">
                          View Details
                        </button>
                        {order.status === 'delivered' && (
                          <button
                            onClick={() => handleLeaveFeedback(order)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                          >
                            <FaComment />
                            Leave a Review
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="space-y-6">
                {/* Sort Controls */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Transaction History</h2>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                    >
                      <option value="date">Sort by Date</option>
                      <option value="amount">Sort by Amount</option>
                      <option value="status">Sort by Status</option>
                      <option value="id">Sort by ID</option>
                    </select>
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent flex items-center gap-2 text-sm"
                    >
                      {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
                      {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
                    </button>
                  </div>
                </div>

                {sortedTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No transactions found.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="divide-y">
                      {sortedTransactions.map((transaction, idx) => (
                        <div key={transaction.paymentId || idx} className="p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                          <div>
                            <div className="font-semibold text-gray-800">Payment ID: {transaction.paymentId}</div>
                            <div className="text-sm text-gray-600">Date: {formatTimestamp(transaction.date)}</div>
                            <div className="text-sm text-gray-600">Method: {transaction.paymentMethod}</div>
                            <div className="text-sm text-gray-600">Phone: {transaction.phoneNumber}</div>
                            <div className="text-sm text-gray-600">Status: {transaction.status}</div>
                            <div className="text-sm text-gray-600">Action: {transaction.action}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-red-600">
                              {transaction.amountPaid ? `${transaction.amountPaid.toFixed(0)} FCFA` : 'N/A'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Feedback Modal */}
            {showFeedbackForm && selectedOrder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Leave Feedback</h2>
                    <button
                      onClick={() => setShowFeedbackForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Order #{selectedOrder.id}</p>
                    <p className="text-sm text-gray-600">{formatTimestamp(selectedOrder.date)}</p>
                  </div>

                  <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={feedbackForm.name}
                        onChange={(e) => handleFeedbackChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                      <input
                        type="text"
                        value={feedbackForm.topic}
                        onChange={(e) => handleFeedbackChange('topic', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="e.g., Food Quality, Delivery Service, etc."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                      <textarea
                        value={feedbackForm.feedback}
                        onChange={(e) => handleFeedbackChange('feedback', e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Share your experience with this order..."
                        required
                      />
                    </div>

                    {feedbackMessage && (
                      <div className={`p-3 rounded-lg ${
                        feedbackMessage.includes('Thank you') 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {feedbackMessage}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowFeedbackForm(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submittingFeedback}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
