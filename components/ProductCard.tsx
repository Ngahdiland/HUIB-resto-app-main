import React from 'react';

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, image, onAddToCart }) => (
  <div className="bg-white rounded shadow p-4 flex flex-col items-center border border-red-100 hover:shadow-lg transition">
    <img src={image} alt={name} className="w-32 h-32 object-cover rounded mb-2" />
    <div className="font-semibold text-lg mb-1 text-red-600">{name}</div>
    <div className="mb-2 text-gray-700">${price.toFixed(2)}</div>
    <button
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition-colors"
      onClick={onAddToCart}
    >
      Add to Cart
    </button>
  </div>
);

export default ProductCard;
