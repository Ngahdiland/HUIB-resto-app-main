"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCreditCard, FaMapMarkerAlt, FaPhone, FaEnvelope, FaLock } from 'react-icons/fa';
import { useCart } from '../../../context/CartContext';

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const Checkout = () => {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { cart, clearCart } = useCart();
  const checkoutItems = Object.values(cart);

  const getSubtotal = () => {
    return checkoutItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTax = () => {
    return getSubtotal() * 0.08;
  };

  const getDeliveryFee = () => {
    return getSubtotal() > 50000 ? 0 : 599;
  };

  const getTotal = () => {
    return getSubtotal() + getTax() + getDeliveryFee();
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
  };

  if (checkoutItems.length === 0 && !orderPlaced) {
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
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
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
              <button
                onClick={handlePlaceOrder}
                className="w-full mt-8 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Place Order
              </button>
            </div>
          </div>
          <div className="lg:col-span-1">
            {/* You can add additional info or a summary here if needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
