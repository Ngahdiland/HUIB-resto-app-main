import React from 'react';
import Button from '@/components/Button';
import CartIcon from '@/components/CartIcon';

// Example cart items
const cartItems = [
  { name: 'Pizza Margherita', price: 12.99, image: '/assets/pizza.jpg', quantity: 2 },
  { name: 'Burger Deluxe', price: 9.99, image: '/assets/burger.jpg', quantity: 1 },
];

const Cart = () => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-red-600 mb-6 flex items-center gap-2">
        <CartIcon count={cartItems.length} /> Cart
      </h1>
      <div className="space-y-4 mb-8">
        {cartItems.map((item) => (
          <div key={item.name} className="flex items-center gap-4 bg-white p-4 rounded shadow border border-red-100">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <div className="font-semibold text-lg text-red-600">{item.name}</div>
              <div className="text-gray-700">${item.price.toFixed(2)}</div>
              <div className="flex items-center gap-2 mt-2">
                <span>Qty:</span>
                <input type="number" min={1} defaultValue={item.quantity} className="w-16 border border-red-300 rounded px-2 py-1" />
              </div>
            </div>
            <Button>Remove</Button>
          </div>
        ))}
      </div>
      <div className="text-right font-bold text-xl mb-4">Total: ${total.toFixed(2)}</div>
      <Button>Checkout</Button>
    </div>
  );
};

export default Cart;
