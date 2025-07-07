"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCreditCard, FaMapMarkerAlt, FaPhone, FaEnvelope, FaLock } from 'react-icons/fa';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Sample checkout data
  const checkoutItems: CheckoutItem[] = [
    { id: '1', name: 'Pizza Margherita', price: 12.99, quantity: 2 },
    { id: '2', name: 'Burger Deluxe', price: 9.99, quantity: 1 },
    { id: '3', name: 'Sushi Platter', price: 19.99, quantity: 1 }
  ];

  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    deliveryInstructions: ''
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    method: ''
  });

  const getSubtotal = () => {
    return checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTax = () => {
    return getSubtotal() * 0.08;
  };

  const getDeliveryFee = () => {
    return getSubtotal() > 50 ? 0 : 5.99;
  };

  const getTotal = () => {
    return getSubtotal() + getTax() + getDeliveryFee();
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setOrderPlaced(true);
    }, 2000);
  };

  const handlePlaceOrder = () => {
    // TODO: Implement actual order placement
    console.log('Order placed:', { deliveryInfo, paymentInfo, items: checkoutItems });
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Your order has been confirmed and is being prepared. You'll receive an email confirmation shortly.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-semibold">Order #HUIB-2024-001</p>
            <p className="text-green-600 text-sm">Estimated delivery: 30-45 minutes</p>
          </div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/cart" 
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <FaArrowLeft />
              </Link>
              <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
            </div>
            <div className="flex gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-red-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= 1 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <span className="hidden sm:inline">Delivery</span>
              </div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-red-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= 2 ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
                <span className="hidden sm:inline">Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {step === 1 ? (
                <form onSubmit={handleDeliverySubmit}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FaMapMarkerAlt />
                    Delivery Information
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={deliveryInfo.firstName}
                        onChange={(e) => setDeliveryInfo(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={deliveryInfo.lastName}
                        onChange={(e) => setDeliveryInfo(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={deliveryInfo.email}
                        onChange={(e) => setDeliveryInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={deliveryInfo.phone}
                        onChange={(e) => setDeliveryInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Address</label>
                    <input
                      type="text"
                      value={deliveryInfo.address}
                      onChange={(e) => setDeliveryInfo(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Street address, apartment, suite, etc."
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={deliveryInfo.city}
                        onChange={(e) => setDeliveryInfo(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        value={deliveryInfo.zipCode}
                        onChange={(e) => setDeliveryInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Instructions (Optional)</label>
                    <textarea
                      value={deliveryInfo.deliveryInstructions}
                      onChange={(e) => setDeliveryInfo(prev => ({ ...prev, deliveryInstructions: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows={3}
                      placeholder="Any special instructions for delivery..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Continue to Payment
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePaymentSubmit}>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FaCreditCard />
                    Payment Information
                  </h2>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <select
                      value={paymentInfo.method}
                      onChange={e => setPaymentInfo(prev => ({ ...prev, method: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a payment method</option>
                      <option value="mtn_momo">MTN MoMo</option>
                      <option value="orange_money">Orange Money</option>
                      <option value="credit_card">Credit Card</option>
                      <option value="cash_on_delivery">Cash on Delivery</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number</label>
                    <input
                      type="text"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      value={paymentInfo.cardName}
                      onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardName: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => setPaymentInfo(prev => ({ ...prev, expiryDate: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">CVV</label>
                      <input
                        type="text"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-6 p-4 bg-gray-50 rounded-lg">
                    <FaLock className="text-green-600" />
                    <span className="text-sm text-gray-600">
                      Your payment information is secure and encrypted
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400"
                    >
                      {loading ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-800">{item.name}</div>
                      <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-semibold text-gray-800">
                      {(item.price * item.quantity).toFixed(0)} FCFA
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
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
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-red-600">{getTotal().toFixed(0)} FCFA</span>
                  </div>
                </div>
              </div>

              {getDeliveryFee() > 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    Add {(50000 - getSubtotal()).toFixed(0)} FCFA more for free delivery!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
