'use client';
import { useCart } from '@/context/CartContext';

export default function MobileCartCTA() {
  const { itemCount, subtotal, openCart } = useCart();
  if (itemCount === 0) return null;

  return (
    <button className="mobile-cart-cta" onClick={openCart}>
      <span>
        <span className="mobile-cart-cta__badge">{itemCount}</span>
        {' '}Voir la commande
      </span>
      <span>${subtotal.toFixed(2)}</span>
    </button>
  );
}
