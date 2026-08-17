// Domain — pure business rules for Orders. No I/O, no HTTP, no Prisma.

export const ORDER_STATUSES = [
  'PENDING', 'PAID', 'ACCEPTED', 'PREPARING',
  'READY', 'DISPATCHED', 'DELIVERED', 'CANCELLED',
];

export const ORDER_FLOW = [
  'PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'DISPATCHED', 'DELIVERED',
];

export function isValidStatus(s) {
  return ORDER_STATUSES.includes(s);
}

export function canTransition(from, to) {
  if (to === 'CANCELLED') return from !== 'DELIVERED';
  const i = ORDER_FLOW.indexOf(from);
  const j = ORDER_FLOW.indexOf(to);
  return i !== -1 && j !== -1 && j >= i;
}

/** Pure pricing calculator. Feed already-resolved unit prices. */
export function computeTotals({ lines, taxRate = 0, tipAmount = 0, deliveryFee = 0 }) {
  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);
  const taxAmount = +(subtotal * (taxRate / 100)).toFixed(2);
  const total = +(subtotal + taxAmount + (tipAmount || 0) + (deliveryFee || 0)).toFixed(2);
  return { subtotal: +subtotal.toFixed(2), taxAmount, total };
}

/** Human-readable order number: HP-<time36>-<rand4> */
export function makeOrderNumber(prefix = 'HP') {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${t}-${r}`;
}
