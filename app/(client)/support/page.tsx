import React from 'react';
import Button from '@/components/Button';

export default function SupportPage() {
  return (
    <div className="max-w-lg mx-auto py-8">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Support</h1>
      <form className="space-y-4 bg-white p-6 rounded shadow border border-red-100 mb-8">
        <div>
          <label className="block mb-1 font-semibold">Your Message</label>
          <textarea className="w-full border border-red-300 rounded px-4 py-2" rows={4} />
        </div>
        <Button type="submit">Send</Button>
      </form>
      <h2 className="text-xl font-bold text-red-600 mb-4">Previous Messages</h2>
      <div className="space-y-2">
        <div className="bg-red-50 p-3 rounded border border-red-100">
          <div className="font-semibold">You: I need help with my order.</div>
          <div className="text-sm text-gray-700">Admin: We are looking into it!</div>
        </div>
      </div>
    </div>
  );
}
