"use client";
import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEye, FaReply, FaTrash, FaStar, FaDownload, FaPrint, FaThumbsUp, FaThumbsDown, FaComment, FaCheck, FaTimes } from 'react-icons/fa';

const Feedbacks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
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
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    
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
  };

  const getStatusColor = (feedback: any) => {
    if (feedback.approved) return 'bg-green-100 text-green-800';
    if (feedback.rejected) return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const getStatusText = (feedback: any) => {
    if (feedback.approved) return 'Approved';
    if (feedback.rejected) return 'Rejected';
    return 'Pending';
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.feedback.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'pending' && !feedback.approved && !feedback.rejected) ||
                         (statusFilter === 'approved' && feedback.approved) ||
                         (statusFilter === 'rejected' && feedback.rejected);
    return matchesSearch && matchesStatus;
  });

  const totalFeedbacks = feedbacks.length;
  const approvedFeedbacks = feedbacks.filter(f => f.approved).length;
  const pendingFeedbacks = feedbacks.filter(f => !f.approved && !f.rejected).length;
  const rejectedFeedbacks = feedbacks.filter(f => f.rejected).length;

  // Export feedbacks as CSV
  const handleExport = () => {
    let csv = 'id,name,topic,feedback,orderId,date,status\n';
    filteredFeedbacks.forEach(fb => {
      csv += `${fb.id},"${fb.name.replace(/"/g, '""')}","${fb.topic.replace(/"/g, '""')}","${fb.feedback.replace(/"/g, '""')}",${fb.orderId},${fb.date},"${getStatusText(fb)}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedbacks_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Print feedbacks list
  const handlePrint = () => {
    const printContents = document.getElementById('feedbacks-list-print')?.innerHTML;
    if (!printContents) return;
    const printWindow = window.open('', '', 'height=600,width=900');
    if (!printWindow) return;
    printWindow.document.write('<html><head><title>Print Feedbacks</title>');
    printWindow.document.write('<style>body{font-family:sans-serif;} .feedback-card{border:1px solid #eee;padding:16px;margin-bottom:16px;border-radius:8px;} .feedback-title{font-weight:bold;font-size:1.1em;} .feedback-meta{color:#555;font-size:0.95em;margin-bottom:8px;} .feedback-message{margin-bottom:8px;}</style>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredFeedbacks.length / feedbacksPerPage);
  const paginatedFeedbacks = filteredFeedbacks.slice((currentPage - 1) * feedbacksPerPage, currentPage * feedbacksPerPage);
  const startIdx = filteredFeedbacks.length === 0 ? 0 : (currentPage - 1) * feedbacksPerPage + 1;
  const endIdx = Math.min(currentPage * feedbacksPerPage, filteredFeedbacks.length);
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Feedback Management</h1>
          <p className="text-gray-600">Monitor and respond to customer feedback</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2" onClick={handleExport}>
            <FaDownload />
            Export
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2" onClick={handlePrint}>
            <FaPrint />
            Print
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <FaTimes className="text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-800">{rejectedFeedbacks}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaComment className="text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Feedbacks</p>
              <p className="text-2xl font-bold text-gray-800">{totalFeedbacks}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaComment className="text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-800">{pendingFeedbacks}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaCheck className="text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-800">{approvedFeedbacks}</p>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2" onClick={handleClearFilters}>
              <FaFilter />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Feedbacks List */}
      <div className="space-y-4" id="feedbacks-list-print">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-lg text-gray-600">Loading feedbacks...</div>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="text-center py-8">
            <FaComment className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No feedbacks found.</p>
          </div>
        ) : (
          filteredFeedbacks.map((feedback) => (
            <div key={feedback.id} className="bg-white rounded-lg shadow-md p-6 feedback-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <FaComment />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 feedback-title">{feedback.topic}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(feedback)}`}>
                        {getStatusText(feedback)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2 feedback-meta">
                      <span className="font-medium">{feedback.name}</span>
                      <span>Order: {feedback.orderId}</span>
                      <span>{new Date(feedback.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setSelectedFeedback(feedback)}
                    className="text-blue-600 hover:text-blue-900" 
                    title="View Details"
                  >
                    <FaEye />
                  </button>
                  {!feedback.approved && !feedback.rejected && (
                    <>
                      <button 
                        onClick={() => handleApproveFeedback(feedback.id)}
                        className="text-green-600 hover:text-green-900" 
                        title="Approve"
                      >
                        <FaCheck />
                      </button>
                      <button 
                        onClick={() => handleRejectFeedback(feedback.id)}
                        className="text-red-600 hover:text-red-900" 
                        title="Reject"
                      >
                        <FaTimes />
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => handleDeleteFeedback(feedback.id)}
                    className="text-gray-600 hover:text-gray-900" 
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="mb-4 feedback-message">
                <p className="text-gray-700 mb-3">{feedback.feedback}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg shadow-md px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{startIdx}</span> to <span className="font-medium">{endIdx}</span> of{' '}
            <span className="font-medium">{filteredFeedbacks.length}</span> results
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-3 py-1 text-sm rounded ${currentPage === i + 1 ? 'bg-red-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Detail Modal */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-4">
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
                <label className="block text-sm font-medium text-gray-700">Customer</label>
                <p className="text-gray-900">{selectedFeedback.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Topic</label>
                <p className="text-gray-900">{selectedFeedback.topic}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Order ID</label>
                <p className="text-gray-900">{selectedFeedback.orderId}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Feedback</label>
                <p className="text-gray-900">{selectedFeedback.feedback}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedFeedback)}`}>
                  {getStatusText(selectedFeedback)}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <p className="text-gray-900">{new Date(selectedFeedback.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedFeedback(null)}
                className="px-4 py-2 bg-gray-200 rounded mr-2"
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
