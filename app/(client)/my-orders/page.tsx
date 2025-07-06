import React from 'react';
import Button from '@/components/Button';

// Example orders
const orders = [
  { id: '12345', status: 'Pending', date: '2025-07-05', total: 32.97 },
  { id: '12344', status: 'Delivered', date: '2025-07-01', total: 19.99 },
];

const MyOrdersPage = () => {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-red-600 mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-4 rounded shadow border border-red-100 flex justify-between items-center">
            <div>
              <div className="font-semibold">Order #{order.id}</div>
              <div className="text-gray-700">{order.date}</div>
              <div className="text-sm font-bold text-red-600">{order.status}</div>
            </div>
            <div className="font-bold">${order.total.toFixed(2)}</div>
            <Button>View</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrdersPage;
