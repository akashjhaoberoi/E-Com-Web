import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { orderAPI } from '../utils/api';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart, token } = useCart();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [shippingData, setShippingData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
    if (cart.length === 0) {
      navigate('/cart');
    }
    // Load Razorpay script once for online payment option.
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [token, cart, navigate]);

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({ ...prev, [name]: value }));
  };

  const validateShippingData = () => {
    const { name, email, phone, address, city, state, zipCode } = shippingData;
    if (!name || !email || !phone || !address || !city || !state || !zipCode) {
      setError('Please fill in all shipping details');
      return false;
    }
    return true;
  };

  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    if (!validateShippingData()) return;
    setError('');
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');

    try {
      // Create order on backend
      const orderResponse = await orderAPI.create({
        items: cart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: shippingData,
        paymentMethod
      });

      if (!orderResponse.data.success) {
        throw new Error('Failed to create order');
      }

      const { order } = orderResponse.data;

      if (!order.requiresPayment) {
        clearCart();
        navigate(`/order-success/${order.id}`);
        return;
      }

      const razorpayOrderId = order.razorpayOrderId;
      const totalAmount = order.amount;

      if (!process.env.REACT_APP_RAZORPAY_KEY_ID || !window.Razorpay || !razorpayOrderId) {
        throw new Error('Online payment is unavailable right now. Please choose Cash on Delivery.');
      }

      // Razorpay payment options
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: totalAmount * 100,
        currency: 'INR',
        order_id: razorpayOrderId,
        name: 'ShopHub',
        description: 'E-commerce Purchase',
        image: 'https://via.placeholder.com/100',
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await orderAPI.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            });

            if (verifyResponse.data.success) {
              clearCart();
              navigate(`/order-success/${order.id}`);
            }
          } catch (err) {
            setError('Payment verification failed. Please contact support.');
            console.error(err);
          }
        },
        prefill: {
          name: shippingData.name,
          email: shippingData.email,
          contact: shippingData.phone
        },
        theme: {
          color: '#3B82F6'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Order processing failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12">Checkout</h1>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information */}
            <div className={`bg-white rounded-lg shadow p-8 mb-8 ${step === 1 ? '' : 'opacity-50'}`}>
              <div className="flex items-center mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  step >= 1 ? 'bg-primary' : 'bg-gray-300'
                }`}>
                  1
                </div>
                <h2 className="text-2xl font-bold ml-4">Shipping Information</h2>
              </div>

              {step === 1 && (
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  {/* Name & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={shippingData.name}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={shippingData.email}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingData.phone}
                      onChange={handleShippingChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingData.address}
                      onChange={handleShippingChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* City, State, ZIP */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingData.city}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={shippingData.state}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingData.zipCode}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
                  >
                    Continue to Payment
                  </button>
                </form>
              )}
            </div>

            {/* Step 2: Payment Information */}
            <div className={`bg-white rounded-lg shadow p-8 ${step === 2 ? '' : 'opacity-50'}`}>
              <div className="flex items-center mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  step >= 2 ? 'bg-primary' : 'bg-gray-300'
                }`}>
                  2
                </div>
                <h2 className="text-2xl font-bold ml-4">Payment</h2>
              </div>

              {step === 2 && (
                <div>
                  <p className="text-gray-600 mb-4">Choose your payment method.</p>

                  <div className="space-y-3 mb-6">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span className="font-semibold">Cash on Delivery</span>
                    </label>
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={paymentMethod === 'razorpay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span className="font-semibold">Pay Online (Razorpay)</span>
                    </label>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition disabled:bg-gray-400"
                  >
                    {loading ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order' : 'Pay with Razorpay'}
                  </button>
                  <button
                    onClick={() => setStep(1)}
                    className="w-full mt-4 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                  >
                    Back to Shipping
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-20">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm border-b pb-2">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-3 mt-3">
                  <span>Total</span>
                  <span className="text-primary">₹{getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
