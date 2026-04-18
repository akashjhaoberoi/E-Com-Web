import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { logout } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, token, getCartCount, logout: contextLogout } = useCart();
  const [query, setQuery] = React.useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/?q=${encodeURIComponent(query.trim())}`);
  };

  const handleLogout = () => {
    logout();
    contextLogout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            ShopHub
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 mx-8">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
          </form>

          {/* Right Menu */}
          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative flex items-center text-gray-700 hover:text-primary transition"
              title="Shopping Cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-danger text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Auth Links */}
            {token && user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-700 text-sm">Hi, {user.name}</span>

                <Link
                  to="/orders"
                  className="px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  My Orders
                </Link>
                
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-blue-50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
