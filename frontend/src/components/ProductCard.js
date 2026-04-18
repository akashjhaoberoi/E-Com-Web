import React from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      {/* Image */}
      <div className="bg-gray-200 h-48 rounded-t flex items-center justify-center overflow-hidden">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition duration-300"
        />
      </div>

      <div className="p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-800">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <span className="text-yellow-400">★</span>
          <span className="text-sm text-gray-600 ml-1">
            {product.rating} ({Math.floor(Math.random() * 500 + 10)} reviews)
          </span>
        </div>

        {/* Price & Stock */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-primary">
            ₹{product.price.toFixed(2)}
          </span>
          <span className={`text-xs font-semibold px-2 py-1 rounded ${
            product.stock > 0
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className={`w-full py-2 rounded font-semibold transition duration-200 ${
            product.stock > 0
              ? 'bg-primary text-white hover:bg-blue-600 active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.stock > 0 ? (added ? 'Added' : 'Add to Cart') : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
