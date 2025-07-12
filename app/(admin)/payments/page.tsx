"use client";
import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEye, FaDownload, FaPrint, FaDollarSign, FaCreditCard, FaPaypal, FaMoneyBillWave, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

interface Payment {
  id?: string;
  orderId?: string;
  customer?: { name?: string; email?: string };
  amount?: number;
  method?: string;
  status?: string;
  transactionId?: string;
  date?: string;
  processedDate?: string;
  gateway?: string;
  fee?: number;
  netAmount?: number;
  refundAmount?: number;
  currency?: string;
  description?: string;
  billingAddress?: string;
  last4?: string;
  // For new payment fields
  amountPaid?: number;
  paymentId?: string;
  userName?: string;
  paymentMethod?: string;
  phoneNumber?: string;
  action?: string;
  email?: string;
}

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsState, setPaymentsState] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const paymentsPerPage = 6;

  // Fetch payments data on component mount
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/payments/all');
        if (response.ok) {
          const data = await response.json();
          setPaymentsState(data.payments || []);
        } else {
          console.error('Failed to fetch payments');
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'credit_card': return 'bg-blue-100 text-blue-800';
      case 'paypal': return 'bg-yellow-100 text-yellow-800';
      case 'bank_transfer': return 'bg-green-100 text-green-800';
      case 'cash': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Sort payments based on selected criteria
  const sortPayments = (payments: Payment[]) => {
    return [...payments].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date || '');
          bValue = new Date(b.date || '');
          break;
        case 'amount':
          aValue = a.amount || a.amountPaid || 0;
          bValue = b.amount || b.amountPaid || 0;
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'method':
          aValue = a.method || a.paymentMethod || '';
          bValue = b.method || b.paymentMethod || '';
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

  const filteredPayments = sortPayments(paymentsState.filter(payment => {
    const matchesSearch = 
      (payment.paymentId || payment.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.userName || payment.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.email || payment.customer?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || 
      (payment.paymentMethod || payment.method || '').toLowerCase() === methodFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesMethod;
  }));

  // Pagination logic
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);
  const paginatedPayments = filteredPayments.slice((currentPage - 1) * paymentsPerPage, currentPage * paymentsPerPage);
  const startIdx = filteredPayments.length === 0 ? 0 : (currentPage - 1) * paymentsPerPage + 1;
  const endIdx = Math.min(currentPage * paymentsPerPage, filteredPayments.length);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setMethodFilter('all');
    setDateFilter('all');
    setSortBy('date');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  // Export payments as CSV
  const handleExport = () => {
    let csv = 'id,amount,method,status,date,customer,email,transactionId\n';
    filteredPayments.forEach(payment => {
      csv += `${payment.paymentId || payment.id},${payment.amountPaid || payment.amount},${payment.paymentMethod || payment.method},${payment.status},${payment.date},${payment.userName || payment.customer?.name},${payment.email || payment.customer?.email},${payment.transactionId}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Print payments table
  const handlePrint = () => {
    const printContents = document.getElementById('payments-table-print')?.innerHTML;
    if (!printContents) return;
    const printWindow = window.open('', '', 'height=600,width=900');
    if (!printWindow) return;
    printWindow.document.write('<html><head><title>Print Payments</title>');
    printWindow.document.write('<style>body{font-family:sans-serif;} table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ccc;padding:8px;}th{background:#f3f3f3;} .status-badge{padding:4px 8px;border-radius:4px;font-size:0.8em;}</style>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <div className="text-lg text-gray-600">Loading payments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Payments</h1>
          <p className="text-gray-600">View and manage all payment transactions</p>
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

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search payments..."
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
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Methods</option>
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="status">Sort by Status</option>
              <option value="method">Sort by Method</option>
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

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto" id="payments-table-print">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedPayments.map((payment) => (
              <tr key={payment.paymentId || payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{payment.paymentId || payment.id}</div>
                  {payment.transactionId && (
                    <div className="text-xs text-gray-500">TXN: {payment.transactionId}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{payment.userName || payment.customer?.name}</div>
                    <div className="text-sm text-gray-500">{payment.email || payment.customer?.email}</div>
                    {payment.phoneNumber && (
                      <div className="text-sm text-gray-500">{payment.phoneNumber}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {(payment.amountPaid || payment.amount || 0).toFixed(2)} FCFA
                  </div>
                  {payment.fee && (
                    <div className="text-xs text-gray-500">Fee: {payment.fee.toFixed(2)} FCFA</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMethodColor(payment.paymentMethod || payment.method || '')}`}>
                      {(payment.paymentMethod || payment.method || '').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  {payment.last4 && (
                    <div className="text-xs text-gray-500 mt-1">**** {payment.last4}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {payment.status === 'pending' ? (
                    <select
                      className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(payment.status)} ${updatingStatus === (payment.paymentId || payment.id) ? 'opacity-50' : ''}`}
                      value={payment.status}
                      disabled={updatingStatus === (payment.paymentId || payment.id)}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        const paymentId = payment.paymentId || payment.id;
                        
                        if (!paymentId) {
                          console.error('Payment ID not found');
                          return;
                        }
                        
                        setUpdatingStatus(paymentId);
                        
                        try {
                          const response = await fetch('/api/payments/update-status', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ paymentId, newStatus }),
                          });
                          
                          if (response.ok) {
                            setPaymentsState(prev => 
                              prev.map(p => 
                                (p.paymentId || p.id) === paymentId 
                                  ? { ...p, status: newStatus }
                                  : p
                              )
                            );
                          } else {
                            console.error('Failed to update payment status');
                          }
                        } catch (error) {
                          console.error('Error updating payment status:', error);
                        } finally {
                          setUpdatingStatus(null);
                        }
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status || '')}`}>
                      {payment.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatTimestamp(payment.date || '')}
                  </div>
                  {payment.processedDate && (
                    <div className="text-xs text-gray-500">
                      Processed: {formatTimestamp(payment.processedDate)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {/* Handle view payment details */}}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FaEye />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                <span className="font-medium">{filteredPayments.length}</span> results
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
    </div>
  );
};

export default Payments;
