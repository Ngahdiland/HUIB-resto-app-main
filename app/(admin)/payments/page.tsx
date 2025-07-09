"use client";
import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEye, FaDownload, FaPrint, FaDollarSign, FaCreditCard, FaPaypal, FaMoneyBillWave } from 'react-icons/fa';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsState, setPaymentsState] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
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

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodIcon = (method: string | undefined) => {
    if (!method) return <FaDollarSign className="text-gray-600" />;
    switch (method) {
      case 'credit_card': return <FaCreditCard className="text-blue-600" />;
      case 'mtn': return <span className="text-yellow-600 font-bold">MTN</span>;
      case 'orange': return <span className="text-orange-500 font-bold">OM</span>;
      case 'mtn_momo': return <span className="text-yellow-600 font-bold">MTN</span>;
      case 'orange_money': return <span className="text-orange-500 font-bold">OM</span>;
      case 'cash_on_delivery': return <FaMoneyBillWave className="text-green-600" />;
      default: return <FaDollarSign className="text-gray-600" />;
    }
  };

  const getMethodColor = (method: string | undefined) => {
    if (!method) return 'bg-gray-100 text-gray-800';
    switch (method) {
      case 'credit_card': return 'bg-blue-100 text-blue-800';
      case 'mtn': return 'bg-yellow-100 text-yellow-800';
      case 'orange': return 'bg-orange-100 text-orange-800';
      case 'mtn_momo': return 'bg-yellow-100 text-yellow-800';
      case 'orange_money': return 'bg-orange-100 text-orange-800';
      case 'cash_on_delivery': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPayments = paymentsState.filter(payment => {
    const matchesSearch = (payment.paymentId || payment.id || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.userName || payment.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.email || payment.customer?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.phoneNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.paymentMethod === methodFilter || payment.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalRevenue = paymentsState.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amountPaid || p.amount || 0), 0);
  const totalFees = paymentsState.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.fee || 0), 0);
  const pendingAmount = paymentsState.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amountPaid || p.amount || 0), 0);
  const failedAmount = paymentsState.filter(p => p.status === 'failed').reduce((sum, p) => sum + (p.amountPaid || p.amount || 0), 0);

  const safeString = (val: any) => (typeof val === 'string' ? val : '');

  const safeReplaceAll = (val: any, searchValue: string | RegExp, replaceValue: string): string => {
    if (typeof val !== 'string') return '';
    if (typeof val.replaceAll === 'function') {
      return val.replaceAll(searchValue, replaceValue);
    }
    if (typeof searchValue === 'string') {
      return val.split(searchValue).join(replaceValue);
    }
    return val.replace(searchValue, replaceValue);
  };

  // Export payments as CSV
  const handleExport = () => {
    let csv = 'paymentId,userName,email,phoneNumber,amountPaid,paymentMethod,status,date,action\n';
    filteredPayments.forEach(p => {
      if (!p) return;
      csv += `${safeReplaceAll(p.paymentId || p.id, '"', '""')},${safeReplaceAll(p.userName || p.customer?.name, '"', '""')},${safeReplaceAll(p.email || p.customer?.email, '"', '""')},${safeReplaceAll(p.phoneNumber, '"', '""')},${safeReplaceAll(p.amountPaid || p.amount, '"', '""')},${safeReplaceAll(p.paymentMethod || p.method, '"', '""')},${safeReplaceAll(p.status, '"', '""')},${safeReplaceAll(p.date, '"', '""')},${safeReplaceAll(p.action, '"', '""')}\n`;
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

  // Export general analysis as CSV
  const handleExportAnalysis = () => {
    let csv = 'Payment Analysis\n';
    csv += `Total Revenue,${totalRevenue.toFixed(0)} FCFA\n`;
    csv += `Total Fees,${totalFees.toFixed(0)} FCFA\n`;
    csv += `Pending Amount,${pendingAmount.toFixed(0)} FCFA\n`;
    csv += `Failed Amount,${failedAmount.toFixed(0)} FCFA\n`;
    csv += '\nBreakdown by Method\nMethod,Count,Total Amount\n';
    const methodMap: Record<string, { count: number; total: number }> = {};
    paymentsState.forEach(p => {
      const method = p.paymentMethod || p.method || 'unknown';
      if (!methodMap[method]) methodMap[method] = { count: 0, total: 0 };
      methodMap[method].count++;
      methodMap[method].total += (p.amountPaid || p.amount || 0);
    });
    Object.entries(methodMap).forEach(([method, data]) => {
      const d = data as { count: number; total: number };
      csv += `${method},${d.count},${d.total}\n`;
    });
    csv += '\nBreakdown by Status\nStatus,Count,Total Amount\n';
    const statusMap: Record<string, { count: number; total: number }> = {};
    paymentsState.forEach(p => {
      const status = p.status || 'unknown';
      if (!statusMap[status]) statusMap[status] = { count: 0, total: 0 };
      statusMap[status].count++;
      statusMap[status].total += (p.amountPaid || p.amount || 0);
    });
    Object.entries(statusMap).forEach(([status, data]) => {
      const d = data as { count: number; total: number };
      csv += `${status},${d.count},${d.total}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_analysis_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Print payments table and stats
  const handlePrint = () => {
    const printContents = document.getElementById('payments-print-section')?.innerHTML;
    if (!printContents) return;
    const printWindow = window.open('', '', 'height=700,width=1000');
    if (!printWindow) return;
    printWindow.document.write('<html><head><title>Print Payments</title>');
    printWindow.document.write('<style>body{font-family:sans-serif;} table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ccc;padding:8px;}th{background:#f3f3f3;} .stats-cards{display:flex;gap:16px;margin-bottom:24px;} .stat-card{background:#f9fafb;padding:16px;border-radius:8px;flex:1;text-align:center;} .stat-title{color:#666;font-size:1em;} .stat-value{font-size:1.5em;font-weight:bold;}</style>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setMethodFilter('all');
    setDateFilter('all');
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);
  const paginatedPayments = filteredPayments.slice((currentPage - 1) * paymentsPerPage, currentPage * paymentsPerPage);
  const startIdx = filteredPayments.length === 0 ? 0 : (currentPage - 1) * paymentsPerPage + 1;
  const endIdx = Math.min(currentPage * paymentsPerPage, filteredPayments.length);
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading payments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Payment Management</h1>
          <p className="text-gray-600">Track and manage all payment transactions</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2" onClick={handleExport}>
            <FaDownload />
            Export
          </button>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2" onClick={handleExportAnalysis}>
            <FaDownload />
            Export Analysis
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2" onClick={handlePrint}>
            <FaPrint />
            Print
          </button>
        </div>
      </div>

      {/* Stats Cards + Payments Table Print Section */}
      <div id="payments-print-section">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 stats-cards">
          <div className="bg-white rounded-lg shadow-md p-6 stat-card">
            <div className="stat-title">Total Revenue</div>
            <div className="stat-value">{totalRevenue.toFixed(0)} FCFA</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 stat-card">
            <div className="stat-title">Total Fees</div>
            <div className="stat-value">{totalFees.toFixed(0)} FCFA</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 stat-card">
            <div className="stat-title">Pending Amount</div>
            <div className="stat-value">{pendingAmount.toFixed(0)} FCFA</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 stat-card">
            <div className="stat-title">Failed Amount</div>
            <div className="stat-value">{failedAmount.toFixed(0)} FCFA</div>
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
                placeholder="Search payments..."
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
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Method</label>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Methods</option>
              <option value="mtn">MTN MoMo</option>
              <option value="orange">Orange Money</option>
              <option value="credit_card">Credit Card</option>
              <option value="cash_on_delivery">Cash on Delivery</option>
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

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
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
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
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
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.paymentId || payment.id}</div>
                        <div className="text-sm text-gray-500">Action: {payment.action || 'order'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.userName || payment.customer?.name || ''}</div>
                        <div className="text-sm text-gray-500">{payment.email || payment.customer?.email || ''}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{(payment.amountPaid || payment.amount || 0).toFixed(0)} FCFA</div>
                        {(payment.fee || 0) > 0 && (
                          <div className="text-xs text-gray-500">Fee: {(payment.fee || 0).toFixed(0)} FCFA</div>
                        )}
                        {(payment.refundAmount || 0) > 0 && (
                          <div className="text-xs text-red-500">Refunded: {(payment.refundAmount || 0).toFixed(0)} FCFA</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getMethodIcon(payment.paymentMethod || payment.method)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMethodColor(payment.paymentMethod || payment.method)}`}>
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
                          className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(payment.status)}`}
                          value={payment.status}
                          onChange={e => {
                            const newStatus = e.target.value;
                            setPaymentsState(prev => prev.map(p => (p.paymentId || p.id) === (payment.paymentId || payment.id) ? { ...p, status: newStatus } : p));
                          }}
                        >
                          <option value="completed">Completed</option>
                          <option value="pending">Pending</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1) : 'Unknown'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="text-sm text-gray-900">{payment.phoneNumber || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>{payment.date ? new Date(payment.date).toLocaleDateString() : 'N/A'}</div>
                        {payment.processedDate && (
                          <div className="text-xs text-gray-500">Processed: {payment.processedDate}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-900" title="View Details">
                          <FaEye />
                        </button>
                        {payment.status === 'completed' && (
                          <button className="text-green-600 hover:text-green-900" title="Refund">
                            Refund
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg shadow-md px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{startIdx}</span> to <span className="font-medium">{endIdx}</span> of{' '}
            <span className="font-medium">{filteredPayments.length}</span> results
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
    </div>
  );
};

export default Payments;
