import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';

const CartIcon = ({ count = 0 }: { count?: number }) => (
  <div className="relative">
    <FaShoppingCart size={22} />
    {count > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
        {count}
      </span>
    )}
  </div>
);

export default CartIcon;
