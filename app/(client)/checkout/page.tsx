"use client";
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCreditCard, FaMapMarkerAlt, FaPhone, FaEnvelope, FaLock, FaCopy, FaCheckCircle, FaUpload } from 'react-icons/fa';
import { useCart } from '../../../context/CartContext';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const ORDERS_KEY = 'huib_orders';

const Checkout = () => {
  const [phase, setPhase] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState({
    name: '',
    address: '',
    phone: '',
  });
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [approvedOrder, setApprovedOrder] = useState<any | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { cart, clearCart } = useCart();
  const checkoutItems = Object.values(cart);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [copiedNumber, setCopiedNumber] = useState<string>('');
  const [paymentSettings, setPaymentSettings] = useState({ mtnEnabled: false, orangeEnabled: false, mtnName: '', mtnNumber: '', orangeName: '', orangeNumber: '' });

  useEffect(() => {
    // Fetch payment settings from API
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.payment) {
            setPaymentSettings(data.payment);
          }
        }
      } catch (err) {
        // fallback: do nothing
      }
    };
    fetchSettings();
  }, []);

  // Poll for order status if user has placed an order
  useEffect(() => {
    if (!orderId) return;
    const interval = setInterval(() => {
      const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      const myOrder = orders.find((o: any) => o.id === orderId);
      if (myOrder && myOrder.status === 'approved') {
        setApprovedOrder(myOrder);
        clearInterval(interval);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, [orderId]);

  // Admin: load pending orders
  useEffect(() => {
    if (isAdmin) {
      const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      setPendingOrders(orders.filter((o: any) => o.status === 'pending'));
    }
  }, [isAdmin, orderPlaced]);

  const getSubtotal = () => checkoutItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const getTax = () => getSubtotal() * 0.08;
  const getDeliveryFee = () => getSubtotal() > 50000 ? 0 : 599;
  const getTotal = () => getSubtotal() + getTax() + getDeliveryFee();

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setPhase(2);
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedNumber(text);
    setTimeout(() => setCopiedNumber(''), 1500);
  };

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceipt(e.target.files[0]);
      setReceiptPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Save order to backend
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert('You must be logged in to place an order.');
      return;
    }
    const order = {
      email: user.email,
      items: checkoutItems.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total: getTotal(),
    };
    // Save payment info
    const paymentInfo = {
      amountPaid: getTotal(),
      paymentId: 'PAY-' + Date.now(),
      userName: userInfo.name,
      paymentMethod,
      phoneNumber: userInfo.phone,
      status: 'pending',
      date: new Date().toISOString(),
      action: 'order',
      email: user.email,
    };
    await fetch('/api/payments/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentInfo),
    });
    // Save order
    const res = await fetch('/api/orders/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    if (res.status === 201) {
      setOrderPlaced(true);
      clearCart();
    } else {
      alert('Failed to place order.');
    }
  };

  // Admin: approve order
  const handleApproveOrder = (id: string) => {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const idx = orders.findIndex((o: any) => o.id === id);
    if (idx !== -1) {
      orders[idx].status = 'approved';
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
      setPendingOrders(orders.filter((o: any) => o.status === 'pending'));
    }
  };

  // Admin login (simple password: 'admin123')
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin123') {
      setIsAdmin(true);
    } else {
      alert('Incorrect password');
    }
  };

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Pending Orders</h1>
          {pendingOrders.length === 0 ? (
            <p className="text-gray-600">No pending orders.</p>
          ) : (
            pendingOrders.map((order) => (
              <div key={order.id} className="mb-8 border-b pb-4">
                <div className="mb-2 font-semibold">{order.userInfo.name} ({order.userInfo.phone})</div>
                <div className="mb-2 text-sm text-gray-600">{order.userInfo.address}</div>
                <div className="mb-2">Total: <span className="font-bold">{order.total.toFixed(0)} FCFA</span></div>
                <div className="mb-2">Items:
                  <ul className="list-disc ml-6">
                    {order.items.map((item: any) => (
                      <li key={item.product.id}>{item.product.name} x {item.quantity}</li>
                    ))}
                  </ul>
                </div>
                {order.receipt && (
                  <div className="mb-2">
                    <img src={order.receipt} alt="Receipt" className="h-24 rounded border" />
                  </div>
                )}
                <button
                  onClick={() => handleApproveOrder(order.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Approve Order
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  if (checkoutItems.length === 0 && !orderPlaced && !approvedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link 
            href="/menu" 
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-flex items-center gap-2"
          >
            <FaArrowLeft />
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  if (approvedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order is successfully placed, thanks!</h1>
          <p className="text-gray-600 mb-6">
            Your order has been approved. Estimated delivery time: 30-45 minutes.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/my-orders" 
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Track Order
            </Link>
            <Link 
              href="/" 
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Thanks, your order is being reviewed!</h1>
          <p className="text-gray-600 mb-6">
            We have received your payment receipt. Our team will review and approve your order soon.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/my-orders" 
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Track Order
            </Link>
            <Link 
              href="/" 
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Admin login form
  if (!isAdmin && typeof window !== 'undefined' && window.location.search.includes('admin')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <form onSubmit={handleAdminLogin} className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Login</h2>
          <input
            type="password"
            placeholder="Admin password"
            value={adminPassword}
            onChange={e => setAdminPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
          />
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/cart" 
              className="text-gray-600 hover:text-red-600 transition-colors"
            >
              <FaArrowLeft />
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
              <div className="divide-y">
                {checkoutItems.map((item) => (
                  <div key={item.product.id} className="py-4 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-800">{item.product.name}</div>
                      <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-semibold text-gray-800">
                      {(item.product.price * item.quantity).toFixed(0)} FCFA
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{getSubtotal().toFixed(0)} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-semibold">{getTax().toFixed(0)} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold">
                    {getDeliveryFee() === 0 ? 'Free' : `${getDeliveryFee().toFixed(0)} FCFA`}
                  </span>
                </div>
                {getDeliveryFee() > 0 && (
                  <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                    Add {(50000 - getSubtotal()).toFixed(0)} FCFA more for free delivery!
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-red-600">{getTotal().toFixed(0)} FCFA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Phase 1: User Info Form */}
          {phase === 1 && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Delivery Information</h2>
                <form onSubmit={handleContinue} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={userInfo.name}
                      onChange={handleUserInfoChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Address</label>
                    <input
                      type="text"
                      name="address"
                      value={userInfo.address}
                      onChange={handleUserInfoChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={userInfo.phone}
                      onChange={handleUserInfoChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            </div>
          )}
          {/* Phase 2: Payment Instructions & Upload Receipt */}
          {phase === 2 && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Instructions</h2>
                <div className="mb-4">
                  <label className="block font-semibold mb-1">Payment Method</label>
                  <select
                    className="w-full border rounded px-4 py-2"
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value)}
                    required
                  >
                    <option value="">Select payment method</option>
                    {paymentSettings.mtnEnabled && <option value="mtn">MTN Mobile Money</option>}
                    {paymentSettings.orangeEnabled && <option value="orange">Orange Money</option>}
                  </select>
                </div>
                {paymentMethod === 'mtn' && (
                  <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded flex items-center justify-between">
                    <div>
                      <b>MTN Name:</b> <span id="mtn-name">{paymentSettings.mtnName}</span><br />
                      <b>MTN Number:</b> <span id="mtn-number">{paymentSettings.mtnNumber}</span>
                    </div>
                    <button
                      className="ml-4 px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                      onClick={() => typeof paymentSettings.mtnNumber === 'string' && paymentSettings.mtnNumber !== '' && handleCopy(paymentSettings.mtnNumber)}
                      type="button"
                    >
                      {copiedNumber === (paymentSettings.mtnNumber || '') ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                )}
                {paymentMethod === 'orange' && (
                  <div className="mb-4 bg-orange-50 border-l-4 border-orange-400 p-3 rounded flex items-center justify-between">
                    <div>
                      <b>Orange Name:</b> <span id="orange-name">{paymentSettings.orangeName}</span><br />
                      <b>Orange Money Number:</b> <span id="orange-number">{paymentSettings.orangeNumber}</span>
                    </div>
                    <button
                      className="ml-4 px-2 py-1 bg-orange-400 text-white rounded hover:bg-orange-500"
                      onClick={() => typeof paymentSettings.orangeNumber === 'string' && paymentSettings.orangeNumber !== '' && handleCopy(paymentSettings.orangeNumber)}
                      type="button"
                    >
                      {copiedNumber === (paymentSettings.orangeNumber || '') ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                )}
                <form onSubmit={handleSubmitPayment} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Payment Receipt</label>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleReceiptChange}
                      className="w-full"
                      required
                    />
                    {receiptPreview && (
                      <div className="mt-2">
                        <img src={receiptPreview} alt="Receipt Preview" className="h-32 rounded border" />
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaUpload /> Submit Payment
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
