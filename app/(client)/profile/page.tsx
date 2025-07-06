import React from 'react';
import Button from '@/components/Button';

// Example user data (replace with real user data from context or API)
const user = { name: 'Jane Doe', email: 'jane@example.com' };
const orders = [
  { id: '12345', status: 'Pending', date: '2025-07-05', total: 32.97 },
  { id: '12344', status: 'Delivered', date: '2025-07-01', total: 19.99 },
];

const Profile = () => {
  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-red-600 mb-6">My Profile</h1>
      <div className="bg-white p-6 rounded shadow border border-red-100 mb-6">
        <div className="mb-2 font-semibold">
          Name:{' '}
          <span className="text-gray-700">{user.name}</span>
        </div>
        <div className="mb-4 font-semibold">
          Email:{' '}
          <span className="text-gray-700">{user.email}</span>
        </div>
        <Button>Edit Profile</Button>
      </div>
      <h2 className="text-xl font-bold text-red-600 mb-4">Order History</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-red-50 p-4 rounded border border-red-100 flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">Order #{order.id}</div>
              <div className="text-gray-700">{order.date}</div>
              <div className="text-sm font-bold text-red-600">
                {order.status}
              </div>
            </div>
            <div className="font-bold">${order.total.toFixed(2)}</div>
            <Button>View</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
