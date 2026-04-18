import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getTotalPrice, token } = useCart();

  const handleCheckout = () => {
    if (!token) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-12 text-gray-900">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-xl mb-4">Your cart is empty</p>
            <Link
              to="/"
              className="inline-block px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                {cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 p-6 border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    {/* Product Image */}
                    <img
                      src={item.imageUrl || 'https://via.placeholder.com/100'}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded"
                    />

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                      <p className="text-primary font-bold text-lg mt-2">₹{item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity Control */}
                    <div className="flex flex-col items-center justify-center gap-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                      >
                        +
                      </button>
                      <span className="font-semibold text-lg">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                      >
                        -
                      </button>
                    </div>

                    {/* Subtotal & Remove */}
                    <div className="flex flex-col items-end justify-between min-w-[100px]">
                      <p className="font-semibold text-lg">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-danger hover:text-red-600 text-sm font-semibold transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-20">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">₹{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (0%)</span>
                    <span className="font-semibold">₹0</span>
                  </div>
                </div>

                <div className="border-t-2 border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-xl font-bold text-primary">
                      ₹{getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/"
                  className="block text-center mt-4 text-primary hover:text-blue-600 font-semibold transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
