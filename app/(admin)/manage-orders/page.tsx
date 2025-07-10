"use client";
import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaDownload, FaPrint, FaLock } from 'react-icons/fa';

// Add Order type
interface Order {
  id: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  name?: string;
  email?: string;
  phone?: string;
  items?: Array<{ name: string; quantity: number; price: number }>;
  total?: number;
  status: string;
  paymentStatus?: string;
  paymentMethod?: string;
  orderDate?: string;
  deliveryDate?: string | null;
  deliveryAddress?: string;
  notes?: string;
}

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
  const [ordersState, setOrdersState] = useState<Order[]>([]);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [deleteOrder, setDeleteOrder] = useState<Order | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const ordersPerPage = 6;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/orders/all');
        if (response.ok) {
          const data = await response.json();
          if (data.orders) setOrdersState(data.orders);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
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
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(orderId);
      const res = await fetch('/api/orders/update-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, newStatus }),
      });
      const data = await res.json();
      if (res.status === 200 && data.order) {
        setOrdersState(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      } else {
        alert(data.error || 'Failed to update order status.');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status.');
    } finally {
      setUpdatingStatus(null);
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
  const paginatedOrders: Order[] = filteredOrders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage);
  const startIdx = filteredOrders.length === 0 ? 0 : (currentPage - 1) * ordersPerPage + 1;
  const endIdx = Math.min(currentPage * ordersPerPage, filteredOrders.length);
  const handlePageChange = (page: number) => {
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
    printWindow.document.write('<style>body{font-family:sans-serif;} table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ccc;padding:8px;}th{background:#f3f3f3;} .status-badge{padding:4px 8px;border-radius:4px;font-size:0.8em;}</style>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleEditSave = async (updatedOrder: Order) => {
    try {
      const res = await fetch('/api/orders/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOrder),
      });
      if (res.status === 200) {
        setOrdersState(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
        setEditOrder(null);
      } else {
        alert('Failed to update order.');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order.');
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteOrder) return;
    setOrdersState(prev => prev.filter(o => o.id !== deleteOrder.id));
    setDeleteOrder(null);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <div className="text-lg text-gray-600">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Orders</h1>
          <p className="text-gray-600">View and manage all customer orders</p>
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
                placeholder="Search orders..."
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
              <option value="preparing">Preparing</option>
              <option value="delivering">Delivering</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear
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
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
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
            {paginatedOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{order.customer?.name || order.name}</div>
                    <div className="text-sm text-gray-500">{order.customer?.email || order.email}</div>
                    <div className="text-sm text-gray-500">{order.customer?.phone || order.phone}</div>
                    {order.notes && <div className="text-sm text-gray-500">{order.notes}</div>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {order.items?.slice(0, 2).map((item, index) => (
                      <div key={index}>
                        {item.name} x{item.quantity}
                      </div>
                    ))}
                    {order.items && order.items.length > 2 && (
                      <div className="text-gray-500">+{order.items.length - 2} more</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.total?.toFixed(2)} FCFA</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {(order.status === 'pending' || order.status === 'preparing' || order.status === 'delivering') ? (
                      <select
                        value={order.status}
                        onChange={e => handleStatusUpdate(order.id, e.target.value)}
                        className={`px-2 py-1 text-xs font-semibold rounded-full border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent ${getStatusColor(order.status)}`}
                        disabled={updatingStatus === order.id}
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="delivering">Delivering</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                        <FaLock className="ml-2 text-gray-400" title="Order cannot be edited" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus || '')}`}>
                    {order.paymentStatus || ''}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setViewOrder(order)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FaEye />
                    </button>
                    {order.status !== 'delivered' && order.status !== 'cancelled' && (
                      <button
                        onClick={() => setEditOrder(order)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <FaEdit />
                      </button>
                    )}
                    <button
                      onClick={() => setDeleteOrder(order)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
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
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {startIdx} to {endIdx} of {filteredOrders.length} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm font-medium rounded-lg ${
                  currentPage === page
                    ? 'text-white bg-red-600'
                    : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {viewOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Order Details</h3>
              <button
                onClick={() => setViewOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <strong>Order ID:</strong> {viewOrder.id}
              </div>
              <div>
                <strong>Customer:</strong> {viewOrder.customer?.name || viewOrder.name}
              </div>
              <div>
                <strong>Email:</strong> {viewOrder.customer?.email || viewOrder.email}
              </div>
              <div>
                <strong>Phone:</strong> {viewOrder.customer?.phone || viewOrder.phone}
              </div>
              <div>
                <strong>Address:</strong> {viewOrder.deliveryAddress}
              </div>
              <div>
                <strong>Items:</strong>
                <ul className="list-disc list-inside mt-1">
                  {viewOrder.items?.map((item, index) => (
                    <li key={index}>
                      {item.name} x{item.quantity} - {item.price} FCFA
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Total:</strong> {viewOrder.total} FCFA
              </div>
              <div>
                <strong>Status:</strong> {viewOrder.status}
              </div>
              <div>
                <strong>Payment Status:</strong> {viewOrder.paymentStatus || ''}
              </div>
              <div>
                <strong>Order Date:</strong> {viewOrder.orderDate ? viewOrder.orderDate : ''}
              </div>
              {viewOrder.notes && (
                <div>
                  <strong>Notes:</strong> {viewOrder.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Order</h3>
              <button
                onClick={() => setEditOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editOrder.status}
                  onChange={(e) => setEditOrder({ ...editOrder, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={editOrder.status === 'delivered' || editOrder.status === 'cancelled'}
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="delivering">Delivering</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                <select
                  value={editOrder.paymentStatus}
                  onChange={(e) => setEditOrder({ ...editOrder, paymentStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={editOrder.notes || ''}
                  onChange={(e) => setEditOrder({ ...editOrder, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setEditOrder(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleEditSave(editOrder)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Delete Order</h3>
              <button
                onClick={() => setDeleteOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete order {deleteOrder.id}? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteOrder(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
