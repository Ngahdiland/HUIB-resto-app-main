"use client";
import React, { useState } from 'react';
import { FaSearch, FaFilter, FaEye, FaDownload, FaPrint, FaDollarSign, FaCreditCard, FaPaypal, FaMoneyBillWave } from 'react-icons/fa';

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Sample payments data
  const payments = [
    {
      id: 'PAY-001',
      orderId: 'ORD-001',
      customer: {
        name: 'John Doe',
        email: 'john@example.com'
      },
      amount: 34970,
      method: 'credit_card',
      status: 'completed',
      transactionId: 'TXN-123456789',
      date: '2024-01-15 14:30',
      processedDate: '2024-01-15 14:32',
      gateway: 'Credit Card',
      fee: 1050,
      netAmount: 33920,
      refundAmount: 0,
      currency: 'FCFA',
      description: 'Payment for order ORD-001',
      billingAddress: '123 Main St, Yaoundé',
      last4: '4242'
    },
    {
      id: 'PAY-002',
      orderId: 'ORD-002',
      customer: {
        name: 'Jane Smith',
        email: 'jane@example.com'
      },
      amount: 17980,
      method: 'mtn_momo',
      status: 'completed',
      transactionId: 'MTN-987654321',
      date: '2024-01-15 13:45',
      processedDate: '2024-01-15 13:47',
      gateway: 'MTN MoMo',
      fee: 500,
      netAmount: 17480,
      refundAmount: 0,
      currency: 'FCFA',
      description: 'Payment for order ORD-002',
      billingAddress: '456 Oak Ave, Douala',
      last4: null
    },
    {
      id: 'PAY-003',
      orderId: 'ORD-003',
      customer: {
        name: 'Mike Johnson',
        email: 'mike@example.com'
      },
      amount: 33970,
      method: 'cash_on_delivery',
      status: 'pending',
      transactionId: null,
      date: '2024-01-15 13:20',
      processedDate: null,
      gateway: 'Cash on Delivery',
      fee: 0,
      netAmount: 33970,
      refundAmount: 0,
      currency: 'FCFA',
      description: 'Cash payment for order ORD-003',
      billingAddress: '789 Pine St, Bamenda',
      last4: null
    },
    {
      id: 'PAY-004',
      orderId: 'ORD-004',
      customer: {
        name: 'Sarah Wilson',
        email: 'sarah@example.com'
      },
      amount: 18990,
      method: 'orange_money',
      status: 'failed',
      transactionId: 'OM-456789123',
      date: '2024-01-15 12:55',
      processedDate: null,
      gateway: 'Orange Money',
      fee: 0,
      netAmount: 0,
      refundAmount: 0,
      currency: 'FCFA',
      description: 'Payment for order ORD-004',
      billingAddress: '321 Elm St, Bafoussam',
      last4: null
    },
    {
      id: 'PAY-005',
      orderId: 'ORD-005',
      customer: {
        name: 'David Brown',
        email: 'david@example.com'
      },
      amount: 45500,
      method: 'credit_card',
      status: 'refunded',
      transactionId: 'TXN-789123456',
      date: '2024-01-15 11:30',
      processedDate: '2024-01-15 11:32',
      gateway: 'Credit Card',
      fee: 1370,
      netAmount: 44130,
      refundAmount: 45500,
      currency: 'FCFA',
      description: 'Payment for order ORD-005',
      billingAddress: '654 Maple Dr, Garoua',
      last4: '5555'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card': return <FaCreditCard className="text-blue-600" />;
      case 'mtn_momo': return <span className="text-yellow-600 font-bold">MTN</span>;
      case 'orange_money': return <span className="text-orange-500 font-bold">OM</span>;
      case 'cash_on_delivery': return <FaMoneyBillWave className="text-green-600" />;
      default: return <FaDollarSign className="text-gray-600" />;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'credit_card': return 'bg-blue-100 text-blue-800';
      case 'mtn_momo': return 'bg-yellow-100 text-yellow-800';
      case 'orange_money': return 'bg-orange-100 text-orange-800';
      case 'cash_on_delivery': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.netAmount, 0);
  const totalFees = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.fee, 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const failedAmount = payments.filter(p => p.status === 'failed').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Payment Management</h1>
          <p className="text-gray-600">Track and manage all payment transactions</p>
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
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaDollarSign className="text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">{totalRevenue.toFixed(0)} FCFA</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <FaDollarSign className="text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Fees</p>
              <p className="text-2xl font-bold text-gray-800">{totalFees.toFixed(0)} FCFA</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaDollarSign className="text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Amount</p>
              <p className="text-2xl font-bold text-gray-800">{pendingAmount.toFixed(0)} FCFA</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <FaDollarSign className="text-2xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Failed Amount</p>
              <p className="text-2xl font-bold text-gray-800">{failedAmount.toFixed(0)} FCFA</p>
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
              <option value="credit_card">Credit Card</option>
              <option value="mtn_momo">MTN MoMo</option>
              <option value="orange_money">Orange Money</option>
              <option value="cash_on_delivery">Cash on Delivery</option>
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
                  Transaction
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
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                      <div className="text-sm text-gray-500">Order: {payment.orderId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payment.customer.name}</div>
                      <div className="text-sm text-gray-500">{payment.customer.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{payment.amount.toFixed(0)} FCFA</div>
                      {payment.fee > 0 && (
                        <div className="text-xs text-gray-500">Fee: {payment.fee.toFixed(0)} FCFA</div>
                      )}
                      {payment.refundAmount > 0 && (
                        <div className="text-xs text-red-500">Refunded: {payment.refundAmount.toFixed(0)} FCFA</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getMethodIcon(payment.method)}
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMethodColor(payment.method)}`}>
                        {payment.method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                    {payment.last4 && (
                      <div className="text-xs text-gray-500 mt-1">**** {payment.last4}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="text-sm text-gray-900">{payment.gateway}</div>
                      {payment.transactionId && (
                        <div className="text-xs text-gray-500">{payment.transactionId}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div>{payment.date}</div>
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

      {/* Pagination */}
      <div className="bg-white rounded-lg shadow-md px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
            <span className="font-medium">{filteredPayments.length}</span> results
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

export default Payments;
