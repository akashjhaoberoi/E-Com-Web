import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const statusStyles = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderAPI.getMyOrders();
        setOrders(response.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load your orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Orders</h1>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white shadow rounded-xl p-8 text-center">
            <p className="text-gray-600 mb-4">You have not placed any orders yet.</p>
            <Link
              to="/"
              className="inline-block px-5 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white shadow rounded-xl p-5 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-mono text-sm text-gray-800">{order._id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Placed on</p>
                    <p className="font-semibold text-gray-800">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-lg font-bold text-primary">₹{Number(order.totalAmount || 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment</p>
                    <p className="font-semibold text-gray-800 uppercase">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[order.orderStatus] || 'bg-gray-100 text-gray-800'}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <p className="text-sm text-gray-600 mb-2 font-semibold">Items</p>
                  <div className="space-y-2">
                    {(order.items || []).map((item, idx) => (
                      <div key={`${order._id}-${idx}`} className="text-sm text-gray-700 flex justify-between">
                        <span>{item.product?.name || item.product || 'Product'} x {item.quantity}</span>
                        <span>₹{Number((item.price || 0) * (item.quantity || 0)).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
