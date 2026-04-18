import React from 'react';
import { Link, useParams } from 'react-router-dom';

const OrderSuccessPage = () => {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-8 text-center border border-green-100">
        <div className="mx-auto mb-5 h-14 w-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-2xl font-bold">
          ✓
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Confirmed</h1>
        <p className="text-gray-600 mb-4">Thank you for shopping with us. Your order has been placed successfully.</p>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Order Reference</p>
          <p className="font-mono text-sm text-gray-800 break-all">{orderId}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/orders"
            className="px-4 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-blue-600 transition"
          >
            View My Orders
          </Link>
          <Link
            to="/"
            className="px-4 py-3 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
