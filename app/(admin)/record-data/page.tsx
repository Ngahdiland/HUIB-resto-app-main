'use client';
import React, { useEffect, useState, useRef } from 'react';

const PRODUCTS_URL = '/api/products';
const ORDERS_API = '/api/recorded-data';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  buyer: string;
  items: OrderItem[];
  total: number;
  status: string;
  date: string;
}

const STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'canceled', label: 'Canceled' },
];

function fetcher(url: string) {
  return fetch(url).then(res => res.json());
}

const RecordDataPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [buyer, setBuyer] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [status, setStatus] = useState('paid');
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<{ buyer: string; status: string }>({ buyer: '', status: '' });
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const invoiceRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Fetch products
  useEffect(() => {
    fetcher(PRODUCTS_URL).then(setProducts);
  }, []);

  // Fetch orders
  const loadOrders = () => {
    fetcher(ORDERS_API).then(setOrders);
  };
  useEffect(() => {
    loadOrders();
  }, []);

  // Filter orders
  useEffect(() => {
    let filtered = orders;
    if (filter.buyer) {
      filtered = filtered.filter(o => o.buyer.toLowerCase().includes(filter.buyer.toLowerCase()));
    }
    if (filter.status) {
      filtered = filtered.filter(o => o.status === filter.status);
    }
    setFilteredOrders(filtered);
  }, [orders, filter]);

  // Calculate total price
  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Add item to order
  const handleAddItem = () => {
    if (!selectedProduct) return;
    const prod = products.find(p => p.id === selectedProduct);
    if (!prod) return;
    setOrderItems(prev => {
      // If already in list, increase quantity
      const existing = prev.find(i => i.id === prod.id);
      if (existing) {
        return prev.map(i => i.id === prod.id ? { ...i, quantity: i.quantity + itemQuantity } : i);
      }
      return [...prev, { id: prod.id, name: prod.name, price: prod.price, quantity: itemQuantity }];
    });
    setSelectedProduct('');
    setItemQuantity(1);
  };

  // Remove item from order
  const handleRemoveItem = (id: string) => {
    setOrderItems(prev => prev.filter(i => i.id !== id));
  };

  // Handle order submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyer || orderItems.length === 0) return;
    setSaving(true);
    const order: Order = {
      buyer,
      items: orderItems,
      total,
      status,
      date: new Date().toISOString(),
    };
    const res = await fetch(ORDERS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    setSaving(false);
    if (res.ok) {
      setBuyer('');
      setOrderItems([]);
      setStatus('paid');
      setShowModal(false);
      loadOrders();
    }
  };

  // Print invoice for a specific order
  const handlePrint = (idx: number) => {
    const ref = invoiceRefs.current[idx];
    if (ref) {
      const printContents = ref.innerHTML;
      const win = window.open('', '', 'height=600,width=800');
      if (!win) return;
      win.document.write('<html><head><title>Invoice</title></head><body>');
      win.document.write(printContents);
      win.document.write('</body></html>');
      win.document.close();
      win.print();
    }
  };

  // Print all orders
  const printAllRef = useRef<HTMLDivElement>(null);
  const handlePrintAll = () => {
    if (printAllRef.current) {
      const printContents = printAllRef.current.innerHTML;
      const win = window.open('', '', 'height=700,width=1000');
      if (!win) return;
      win.document.write('<html><head><title>All Orders</title></head><body>');
      win.document.write(printContents);
      win.document.write('</body></html>');
      win.document.close();
      win.print();
    }
  };

  // Export all orders as CSV
  const handleExport = () => {
    let csv = 'Date,Buyer,Status,Items,Total\n';
    filteredOrders.forEach(order => {
      const items = order.items.map(i => `${i.name} x${i.quantity} (FCFA ${i.price})`).join(' | ');
      csv += `"${new Date(order.date).toLocaleString()}","${order.buyer}","${order.status}","${items}","${order.total}"
`;
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

  // Table row zebra striping
  const getRowClass = (idx: number) => idx % 2 === 0 ? 'bg-white' : 'bg-gray-50';

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
            <p className="text-gray-600">View and manage all manually recorded orders</p>
          </div>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow flex items-center gap-2"
            onClick={() => setShowModal(true)}
          >
            Add Order
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter by buyer"
                  className="border rounded px-3 py-2 w-full pl-10"
                  value={filter.buyer}
                  onChange={e => setFilter(f => ({ ...f, buyer: e.target.value }))}
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85zm-5.242 1.106a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/></svg>
                </span>
              </div>
            </div>
            <div>
              <select
                className="border rounded px-3 py-2 w-full"
                value={filter.status}
                onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Print/Export Buttons */}
        <div className="flex justify-end gap-3 mb-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            onClick={handlePrintAll}
          >
            Print All
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
            onClick={handleExport}
          >
            Export
          </button>
        </div>
        {/* Orders Table */}
        <div className="overflow-x-auto rounded-lg shadow-md bg-white">
          <table className="w-full border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Buyer</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Items</th>
                <th className="p-2 border">Total</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-4">No orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((order, idx) => (
                  <tr key={idx} className={getRowClass(idx)}>
                    <td className="p-2 border">{new Date(order.date).toLocaleString()}</td>
                    <td className="p-2 border">{order.buyer}</td>
                    <td className="p-2 border">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </td>
                    <td className="p-2 border">
                      <ul>
                        {order.items.map((i, j) => (
                          <li key={j}>{i.name} x{i.quantity} (FCFA {i.price})</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-2 border font-semibold">FCFA {order.total}</td>
                    <td className="p-2 border">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => handlePrint(idx)}
                      >
                        Print
                      </button>
                      {/* Hidden invoice for printing */}
                      <div
                        ref={el => { invoiceRefs.current[idx] = el; }}
                        style={{ display: 'none' }}
                      >
                        <div className="p-4 min-w-[350px] max-w-[500px] mx-auto bg-white rounded shadow">
                          <div className="text-center mb-4">
                            <h2 className="text-2xl font-bold tracking-wide text-red-600 mb-1">CCF Rsto</h2>
                            <div className="text-sm text-gray-500">Cameroon Cuisine & Flavors Restaurant</div>
                            <div className="text-xs text-gray-400">Order Invoice</div>
                          </div>
                          <div className="flex justify-between mb-2 text-sm">
                            <span><span className="font-semibold">Date:</span> {new Date(order.date).toLocaleString()}</span>
                            <span><span className="font-semibold">Order #:</span> {order.date.replace(/\D/g, '').slice(-6)}</span>
                          </div>
                          <div className="mb-2 text-sm">
                            <span className="font-semibold">Buyer:</span> {order.buyer}
                          </div>
                          <div className="mb-4 text-sm">
                            <span className="font-semibold">Status:</span> <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                          </div>
                          <table className="w-full mb-4 rounded">
                            <thead>
                              <tr className="bg-gray-100 text-left">
                                <th className="p-2">Item</th>
                                <th className="p-2">Qty</th>
                                <th className="p-2">Unit Price</th>
                                <th className="p-2">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items.map((item, idx2) => (
                                <tr key={idx2}>
                                  <td className="p-2 align-top">{item.name}</td>
                                  <td className="p-2 align-top text-center">{item.quantity}</td>
                                  <td className="p-2 align-top text-right">FCFA {item.price}</td>
                                  <td className="p-2 align-top text-right">FCFA {item.price * item.quantity}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div className="flex justify-end mb-2">
                            <div className="text-lg font-bold">Total: FCFA {order.total}</div>
                          </div>
                          <div className="text-center text-sm text-gray-500 mt-6 border-t pt-2">Thank you for your order!<br/>For support, contact us at <span className="text-red-600">CCF Rsto</span>.</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Hidden print area for all orders */}
        <div style={{ display: 'none' }} ref={printAllRef}>
          <div className="p-6 min-w-[600px] max-w-3xl mx-auto bg-white rounded">
            <h2 className="text-2xl font-bold text-center mb-4">All Orders - CCF Rsto</h2>
            <table className="w-full mb-4">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">Date</th>
                  <th className="p-2">Buyer</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Items</th>
                  <th className="p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, idx) => (
                  <tr key={idx}>
                    <td className="p-2">{new Date(order.date).toLocaleString()}</td>
                    <td className="p-2">{order.buyer}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </td>
                    <td className="p-2">
                      <ul>
                        {order.items.map((i, j) => (
                          <li key={j}>{i.name} x{i.quantity} (FCFA {i.price})</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-2 font-semibold">FCFA {order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-center text-sm text-gray-500 mt-6 border-t pt-2">Thank you for your business!<br/>CCF Rsto</div>
          </div>
        </div>

        {/* Modal for Add Order */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded shadow-lg w-full max-w-lg p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                &times;
              </button>
              <h2 className="text-xl font-bold mb-4">Add Order</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Buyer Name</label>
                  <input
                    type="text"
                    className="border rounded px-3 py-2 w-full"
                    value={buyer}
                    onChange={e => setBuyer(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4 flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block mb-1 font-semibold">Product</label>
                    <select
                      className="border rounded px-3 py-2 w-full"
                      value={selectedProduct}
                      onChange={e => setSelectedProduct(e.target.value)}
                    >
                      <option value="">Select product</option>
                      {products.map(prod => (
                        <option key={prod.id} value={prod.id}>
                          {prod.name} (FCFA {prod.price})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block mb-1 font-semibold">Qty</label>
                    <input
                      type="number"
                      min={1}
                      className="border rounded px-3 py-2 w-full"
                      value={itemQuantity}
                      onChange={e => setItemQuantity(Number(e.target.value))}
                    />
                  </div>
                  <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={handleAddItem}
                    disabled={!selectedProduct}
                  >
                    Add Item
                  </button>
                </div>
                {/* List of items in order */}
                {orderItems.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Order Items</h3>
                    <ul className="divide-y divide-gray-200">
                      {orderItems.map((item, idx) => (
                        <li key={item.id} className="flex items-center justify-between py-2">
                          <span>{item.name} x{item.quantity} (FCFA {item.price})</span>
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mb-4">
                  <label className="block mb-1 font-semibold">Status</label>
                  <select
                    className="border rounded px-3 py-2 w-full"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <span className="font-semibold">Total: </span>
                  <span className="text-lg">FCFA {total}</span>
                </div>
                <button
                  type="submit"
                  className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Order'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordDataPage;
