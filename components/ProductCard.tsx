import React from 'react';

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  description: string;
  rating: number;
  category: string;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, image, description, rating, category, onAddToCart }) => (
  <div className="bg-white rounded shadow p-4 flex flex-col items-center border border-red-100 hover:shadow-lg transition">
    <span className="mb-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full self-start">{category}</span>
    <img src={image} alt={name} className="w-32 h-32 object-cover rounded mb-2" />
    <div className="font-semibold text-lg mb-1 text-red-600">{name}</div>
    <div className="text-gray-600 text-sm mb-2 text-center">{description}</div>
    <div className="flex items-center mb-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}>★</span>
      ))}
      <span className="ml-2 text-sm text-gray-700 font-medium">{rating.toFixed(1)}</span>
    </div>
    <div className="w-full flex items-center justify-between mb-2">
      <div className="text-gray-700 text-lg font-bold">{price.toFixed(0)} FCFA</div>
      <button
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition-colors"
        onClick={onAddToCart}
      >
        Add to Cart
      </button>
    </div>
  </div>
);

export default ProductCard;
