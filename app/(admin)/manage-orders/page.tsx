"use client";
import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaDownload, FaPrint } from 'react-icons/fa';

// Sample orders data
const orders = [
  {
    id: 'ORD-001',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890'
    },
    items: [
      { name: 'Pizza Margherita', quantity: 2, price: 15.99 },
      { name: 'Coke', quantity: 1, price: 2.99 }
    ],
    total: 34.97,
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    orderDate: '2024-01-15 14:30',
    deliveryDate: '2024-01-15 16:45',
    deliveryAddress: '123 Main St, City, State 12345',
    notes: 'Extra cheese please'
  },
  {
    id: 'ORD-002',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891'
    },
    items: [
      { name: 'Burger Deluxe', quantity: 1, price: 12.99 },
      { name: 'French Fries', quantity: 1, price: 4.99 }
    ],
    total: 17.98,
    status: 'preparing',
    paymentStatus: 'paid',
    paymentMethod: 'paypal',
    orderDate: '2024-01-15 13:45',
    deliveryDate: null,
    deliveryAddress: '456 Oak Ave, City, State 12345',
    notes: ''
  },
  {
    id: 'ORD-003',
    customer: {
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+1234567892'
    },
    items: [
      { name: 'Sushi Platter', quantity: 1, price: 25.99 },
      { name: 'Green Tea', quantity: 2, price: 3.99 }
    ],
    total: 33.97,
    status: 'pending',
    paymentStatus: 'pending',
    paymentMethod: 'cash',
    orderDate: '2024-01-15 13:20',
    deliveryDate: null,
    deliveryAddress: '789 Pine St, City, State 12345',
    notes: 'No wasabi'
  },
  {
    id: 'ORD-004',
    customer: {
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+1234567893'
    },
    items: [
      { name: 'Pasta Carbonara', quantity: 1, price: 18.99 }
    ],
    total: 18.99,
    status: 'delivering',
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    orderDate: '2024-01-15 12:55',
    deliveryDate: null,
    deliveryAddress: '321 Elm St, City, State 12345',
    notes: ''
  }
];

const ManageOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [ordersState, setOrdersState] = useState([]);
  const [viewOrder, setViewOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [deleteOrder, setDeleteOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  useEffect(() => {
    fetch('/api/orders/all')
      .then(res => res.json())
      .then(data => {
        if (data.orders) setOrdersState(data.orders);
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'delivering': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Add this function to update order status
  const handleStatusUpdate = async (orderId, newStatus) => {
    const res = await fetch('/api/orders/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status: newStatus }),
    });
    const data = await res.json();
    if (res.status === 200 && data.order) {
      setOrdersState(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } else {
      alert(data.error || 'Failed to update order status.');
    }
  };

  const filteredOrders = ordersState.filter(order => {
    const matchesSearch = order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (order.email?.toLowerCase().includes(searchTerm.toLowerCase()) || '');
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);
  const startIdx = filteredOrders.length === 0 ? 0 : (currentPage - 1) * ordersPerPage + 1;
  const endIdx = Math.min(currentPage * ordersPerPage, filteredOrders.length);
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  // Export orders as CSV
  const handleExport = () => {
    let csv = 'id,customer_name,customer_email,customer_phone,items,total,status,paymentStatus,paymentMethod,orderDate,deliveryDate,deliveryAddress,notes\n';
    filteredOrders.forEach(order => {
      const itemsStr = order.items.map(i => `${i.name} x${i.quantity} @${i.price}`).join('|');
      csv += `${order.id},${order.customer.name},${order.customer.email},${order.customer.phone},${itemsStr},${order.total},${order.status},${order.paymentStatus},${order.paymentMethod},${order.orderDate},${order.deliveryDate || ''},${order.deliveryAddress},${order.notes.replace(/,/g, ' ')}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Print orders table
  const handlePrint = () => {
    const printContents = document.getElementById('orders-table-print')?.innerHTML;
    if (!printContents) return;
    const printWindow = window.open('', '', 'height=600,width=900');
    if (!printWindow) return;
    printWindow.document.write('<html><head><title>Print Orders</title>');
    printWindow.document.write('<style>table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ccc;padding:8px;}th{background:#f3f3f3;}</style>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // Handle edit order save
  const handleEditSave = (updatedOrder) => {
    setOrdersState(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    setEditOrder(null);
  };

  // Handle delete order confirm
  const handleDeleteConfirm = () => {
    setOrdersState(prev => prev.filter(o => o.id !== deleteOrder.id));
    setDeleteOrder(null);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Orders</h1>
          <p className="text-gray-600">View and manage all customer orders</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2" onClick={handleExport}>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
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
              <option value="preparing">Preparing</option>
              <option value="delivering">Delivering</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
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

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">
              {selectedOrders.length} order(s) selected
            </span>
            <div className="flex gap-2">
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                Update Status
              </button>
              <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                Cancel Orders
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto" id="orders-table-print">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                  onChange={e => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedOrders.map((order) => (
              <tr key={order.id} className={selectedOrders.includes(order.id) ? 'bg-red-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={e => handleSelectOrder(order.id, e.target.checked)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-800">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-900">{order.customer?.name || order.email || 'N/A'}</div>
                  <div className="text-xs text-gray-500">{order.customer?.email || order.email || 'N/A'}</div>
                  <div className="text-xs text-gray-400">{order.customer?.phone || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-xs text-gray-700">
                      {item.name} x{item.quantity} <span className="text-gray-400">@{item.price}</span>
                    </div>
                  ))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-bold text-red-600">{order.total} FCFA</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {['pending','preparing','delivering'].includes(order.status) ? (
                    <select
                      value={order.status}
                      onChange={e => handleStatusUpdate(order.id, e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="delivering">Delivering</option>
                    </select>
                  ) : (
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'N/A'}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus ? order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1) : 'N/A'}
                  </span>
                  <div className="text-xs text-gray-400">{order.paymentMethod ? order.paymentMethod.replace('_', ' ') : 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{order.orderDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{order.deliveryDate || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors mr-2" onClick={() => setViewOrder(order)}>
                    <FaEye />
                  </button>
                  <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors mr-2" onClick={() => setEditOrder(order)}>
                    <FaEdit />
                  </button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors" onClick={() => setDeleteOrder(order)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-lg shadow-md px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{startIdx}</span> to <span className="font-medium">{endIdx}</span> of{' '}
            <span className="font-medium">{filteredOrders.length}</span> results
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

      {/* View Order Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <div className="mb-2"><b>ID:</b> {viewOrder.id}</div>
            <div className="mb-2"><b>Customer:</b> {viewOrder.customer?.name || viewOrder.email || 'N/A'} ({viewOrder.customer?.email || viewOrder.email || 'N/A'}, {viewOrder.customer?.phone || 'N/A'})</div>
            <div className="mb-2"><b>Address:</b> {viewOrder.deliveryAddress}</div>
            <div className="mb-2"><b>Items:</b>
              <ul className="list-disc ml-6">
                {viewOrder.items.map((item, idx) => (
                  <li key={idx}>{item.name} x{item.quantity} @ {item.price} FCFA</li>
                ))}
              </ul>
            </div>
            <div className="mb-2"><b>Total:</b> {viewOrder.total} FCFA</div>
            <div className="mb-2"><b>Status:</b> {viewOrder.status}</div>
            <div className="mb-2"><b>Payment:</b> {viewOrder.paymentStatus} ({viewOrder.paymentMethod})</div>
            <div className="mb-2"><b>Order Date:</b> {viewOrder.orderDate}</div>
            <div className="mb-2"><b>Delivery Date:</b> {viewOrder.deliveryDate || '-'}</div>
            <div className="mb-2"><b>Notes:</b> {viewOrder.notes}</div>
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 bg-gray-200 rounded mr-2" onClick={() => setViewOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Order</h2>
            <form onSubmit={e => {e.preventDefault(); handleEditSave(editOrder);}}>
              <div className="mb-2">
                <label className="block text-sm font-medium">Status</label>
                <select className="w-full border rounded px-2 py-1" value={editOrder.status} onChange={e => setEditOrder({...editOrder, status: e.target.value})}>
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="delivering">Delivering</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium">Payment Status</label>
                <select className="w-full border rounded px-2 py-1" value={editOrder.paymentStatus} onChange={e => setEditOrder({...editOrder, paymentStatus: e.target.value})}>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div className="mb-2">
                <label className="block text-sm font-medium">Delivery Date</label>
                <input type="text" className="w-full border rounded px-2 py-1" value={editOrder.deliveryDate || ''} onChange={e => setEditOrder({...editOrder, deliveryDate: e.target.value})} />
              </div>
              <div className="flex justify-end mt-4">
                <button type="button" className="px-4 py-2 bg-gray-200 rounded mr-2" onClick={() => setEditOrder(null)}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-600">Delete Order</h2>
            <p>Are you sure you want to delete order <b>{deleteOrder.id}</b>? This action cannot be undone.</p>
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 bg-gray-200 rounded mr-2" onClick={() => setDeleteOrder(null)}>Cancel</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleDeleteConfirm}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
