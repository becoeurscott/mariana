'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function OrderSummary() {
  const { items, updateQty, subtotal, lineTotal } = useCart();

  return (
    <aside className="order-summary">
      <h3 className="serif order-summary__title">VOTRE<br />COMMANDE</h3>

      <div className="order-summary__body">
        {items.length === 0 ? (
          <p className="order-summary__empty">
            Rien encore — choisissez un plat dans le menu pour commencer.
          </p>
        ) : (
          items.map((l) => (
            <div key={l.key} className="order-summary__line">
              {l.image && <img src={l.image} alt={l.name} className="order-summary__thumb" />}
              <div className="order-summary__line-info">
                <div className="order-summary__line-name">{l.quantity}× {l.name}</div>
                <div className="order-summary__line-row">
                  <div className="stepper stepper-dark">
                    <button onClick={() => updateQty(l.key, -1)}>−</button>
                    <span>{l.quantity}</span>
                    <button onClick={() => updateQty(l.key, +1)}>+</button>
                  </div>
                  <div className="order-summary__line-price">{lineTotal(l).toFixed(2)} €</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="order-summary__foot">
        <div className="order-summary__subtotal">
          <span>Sous-total</span>
          <span>{subtotal.toFixed(2)} €</span>
        </div>
        <Link
          href="/checkout"
          className="order-summary__checkout-btn"
          style={{
            pointerEvents: items.length === 0 ? 'none' : 'auto',
            opacity: items.length === 0 ? 0.5 : 1,
          }}
        >
          PASSER COMMANDE
        </Link>
      </div>
    </aside>
  );
}
