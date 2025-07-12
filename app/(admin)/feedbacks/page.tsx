"use client";
import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEye, FaReply, FaTrash, FaStar, FaDownload, FaPrint, FaThumbsUp, FaThumbsDown, FaComment, FaCheck, FaTimes, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const Feedbacks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const feedbacksPerPage = 6;

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/feedbacks');
      if (response.ok) {
        const data = await response.json();
        setFeedbacks(data.feedbacks);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveFeedback = async (feedbackId: string) => {
    try {
      const response = await fetch(`/api/feedbacks/${feedbackId}/approve`, {
        method: 'PUT',
      });
      if (response.ok) {
        fetchFeedbacks(); // Refresh the list
      }
    } catch (error) {
      console.error('Error approving feedback:', error);
    }
  };

  const handleRejectFeedback = async (feedbackId: string) => {
    try {
      const response = await fetch(`/api/feedbacks/${feedbackId}/reject`, {
        method: 'PUT',
      });
      if (response.ok) {
        fetchFeedbacks(); // Refresh the list
      }
    } catch (error) {
      console.error('Error rejecting feedback:', error);
    }
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        const response = await fetch(`/api/feedbacks/${feedbackId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchFeedbacks(); // Refresh the list
        }
      } catch (error) {
        console.error('Error deleting feedback:', error);
      }
    }
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

  // Sort feedbacks based on selected criteria
  const sortFeedbacks = (feedbacks: any[]) => {
    return [...feedbacks].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date || a.createdAt || '');
          bValue = new Date(b.date || b.createdAt || '');
          break;
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'topic':
          aValue = a.topic || '';
          bValue = b.topic || '';
          break;
        default:
          aValue = new Date(a.date || a.createdAt || '');
          bValue = new Date(b.date || b.createdAt || '');
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

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortBy('date');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const filteredFeedbacks = sortFeedbacks(feedbacks.filter(feedback => {
    const matchesSearch = 
      (feedback.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (feedback.topic || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (feedback.feedback || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || feedback.status === statusFilter;
    return matchesSearch && matchesStatus;
  }));

  // Pagination logic
  const totalPages = Math.ceil(filteredFeedbacks.length / feedbacksPerPage);
  const paginatedFeedbacks = filteredFeedbacks.slice((currentPage - 1) * feedbacksPerPage, currentPage * feedbacksPerPage);
  const startIdx = filteredFeedbacks.length === 0 ? 0 : (currentPage - 1) * feedbacksPerPage + 1;
  const endIdx = Math.min(currentPage * feedbacksPerPage, filteredFeedbacks.length);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <div className="text-lg text-gray-600">Loading feedbacks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Feedbacks</h1>
          <p className="text-gray-600">Manage customer feedback and reviews</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search feedbacks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="status">Sort by Status</option>
              <option value="topic">Sort by Topic</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent flex items-center gap-2"
            >
              {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
              {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Feedbacks List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {filteredFeedbacks.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No feedbacks found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {paginatedFeedbacks.map((feedback) => (
              <div key={feedback.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{feedback.name}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(feedback.status)}`}>
                        {feedback.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Topic:</strong> {feedback.topic}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Date:</strong> {formatTimestamp(feedback.date || feedback.createdAt)}
                    </p>
                    {feedback.orderId && (
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Order ID:</strong> {feedback.orderId}
                      </p>
                    )}
                    <div className="mt-3">
                      <p className="text-gray-700">{feedback.feedback}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {feedback.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApproveFeedback(feedback.id)}
                          className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50"
                          title="Approve"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleRejectFeedback(feedback.id)}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                          title="Reject"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setSelectedFeedback(feedback)}
                      className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDeleteFeedback(feedback.id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIdx}</span> to <span className="font-medium">{endIdx}</span> of{' '}
                <span className="font-medium">{filteredFeedbacks.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? 'z-10 bg-red-50 border-red-500 text-red-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Detail Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Feedback Details</h2>
              <button
                onClick={() => setSelectedFeedback(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900 font-semibold">{selectedFeedback.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Topic</label>
                <p className="text-gray-900">{selectedFeedback.topic}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <p className="text-gray-900">{formatTimestamp(selectedFeedback.date || selectedFeedback.createdAt)}</p>
              </div>
              
              {selectedFeedback.orderId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Order ID</label>
                  <p className="text-gray-900">{selectedFeedback.orderId}</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedFeedback.status)}`}>
                  {selectedFeedback.status}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Feedback</label>
                <p className="text-gray-900 whitespace-pre-wrap">{selectedFeedback.feedback}</p>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              {selectedFeedback.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleApproveFeedback(selectedFeedback.id);
                      setSelectedFeedback(null);
                    }}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      handleRejectFeedback(selectedFeedback.id);
                      setSelectedFeedback(null);
                    }}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedFeedback(null)}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedbacks;
