import React from 'react';
import ProductCard from '@/components/ProductCard';

// Example products (replace with fetch from API in production)
const products = [
  { name: 'Pizza Margherita', price: 12.99, image: '/assets/pizza.jpg' },
  { name: 'Burger Deluxe', price: 9.99, image: '/assets/burger.jpg' },
  { name: 'Sushi Platter', price: 19.99, image: '/assets/sushi.jpg' },
  { name: 'Pasta Carbonara', price: 11.99, image: '/assets/pasta.jpg' },
  { name: 'Salad Bowl', price: 7.99, image: '/assets/salad.jpg' },
];

const Menu = () => {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-red-600 mb-6">Menu</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <ProductCard key={p.name} {...p} onAddToCart={() => {}} />
        ))}
      </div>
    </div>
  );
};

export default Menu;
