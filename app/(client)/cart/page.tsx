"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaTrash, FaArrowLeft, FaCreditCard, FaShoppingBag } from 'react-icons/fa';
import { useCart } from '../../../context/CartContext';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  quantity: number;
}

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const cartItems = Object.values(cart);
  const router = useRouter();

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTax = () => {
    return getSubtotal() * 0.08; // 8% tax
  };

  const getDeliveryFee = () => {
    return getSubtotal() > 50000 ? 0 : 599;
  };

  const getTotal = () => {
    return getSubtotal() + getTax() + getDeliveryFee();
  };

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    console.log('Proceeding to checkout...');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaShoppingBag className="text-6xl text-gray-400 mx-auto mb-6" />
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/menu" 
                className="text-gray-600 hover:text-red-600 transition-colors"
              >
                <FaArrowLeft />
              </Link>
              <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>
            </div>
            <div className="text-sm text-gray-600">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Cart Items</h2>
              </div>
              <div className="divide-y">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="p-6 flex gap-4">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                          <p className="text-sm text-gray-600">{item.product.description}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-800">
                            {(item.product.price * item.quantity).toFixed(0)} FCFA
                          </div>
                          <div className="text-sm text-gray-600">
                            {item.product.price.toFixed(0)} FCFA each
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
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
                onClick={() => router.push('/checkout')}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <FaCreditCard />
                Proceed to Checkout
              </button>

              <div className="mt-4 text-center">
                <Link 
                  href="/menu" 
                  className="text-red-600 hover:text-red-800 transition-colors text-sm"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
