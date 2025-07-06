import React from 'react';
import Button from '@/components/Button';

const Checkout = () => {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Checkout</h1>
      <form className="space-y-4 bg-white p-6 rounded shadow border border-red-100">
        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input type="text" className="w-full border border-red-300 rounded px-4 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Address</label>
          <input type="text" className="w-full border border-red-300 rounded px-4 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Phone</label>
          <input type="text" className="w-full border border-red-300 rounded px-4 py-2" />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input type="email" className="w-full border border-red-300 rounded px-4 py-2" />
        </div>
        <Button type="submit">Pay Now</Button>
      </form>
    </div>
  );
};

export default Checkout;
