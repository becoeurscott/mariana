import * as orderRepo from '@/repositories/orderRepo';
import * as menuRepo  from '@/repositories/menuRepo';
import * as restaurantRepo from '@/repositories/restaurantRepo';
import { getActiveRestaurant, getActiveRestaurantId } from '@/lib/tenant';
import { parseOrThrow, orderCreate, orderStatusPatch } from '@/lib/validation';
import { httpError } from '@/lib/http';
import { canTransition, computeTotals, makeOrderNumber } from '@/domain/order';

export async function placeOrder(input) {
  const data = parseOrThrow(orderCreate, input);
  const restaurant = await getActiveRestaurant();

  const dbItems = await menuRepo.findItemsByIds(data.items.map((l) => l.menuItemId));
  const priceMap = new Map(dbItems.map((i) => [i.id, i]));

  const orderItemsData = [];
  const lines = [];

  for (const l of data.items) {
    const db = priceMap.get(l.menuItemId);
    if (!db) throw httpError(400, `Article introuvable : ${l.menuItemId}`);
    const optSum = (l.selectedOptions || []).reduce((s, o) => s + (o.price || 0), 0);
    const unit = db.price + optSum;
    lines.push({ unitPrice: unit, quantity: l.quantity });

    orderItemsData.push({
      menuItemId: db.id,
      itemName: db.name,
      itemPrice: db.price,
      quantity: l.quantity,
      specialInstructions: l.instructions || null,
      selectedOptions: {
        create: (l.selectedOptions || []).map((o) => ({
          groupName:  o.groupName || '',
          optionName: o.name,
          price:      o.price || 0,
        })),
      },
    });
  }

  const deliveryFee = data.type === 'DELIVERY' ? restaurant.deliveryFee : 0;
  const totals = computeTotals({
    lines,
    taxRate: restaurant.taxRate,
    tipAmount: data.tipAmount,
    deliveryFee,
  });

  const order = await orderRepo.createOrder({
    orderNumber: makeOrderNumber(),
    restaurantId: restaurant.id,
    type: data.type,
    status: 'PENDING',
    subtotal: totals.subtotal,
    taxRate: restaurant.taxRate,
    taxAmount: totals.taxAmount,
    tipAmount: data.tipAmount || 0,
    deliveryFee,
    total: totals.total,
    specialInstructions: data.specialInstructions || null,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    items: { create: orderItemsData },
    ...(data.type === 'DELIVERY' && data.deliveryAddress
      ? {
          deliveryInfo: {
            create: {
              provider: 'DOORDASH',
              deliveryAddress: data.deliveryAddress,
              deliveryCity:    data.deliveryCity || '',
              deliveryState:   data.deliveryState || '',
              deliveryZip:     data.deliveryZip   || '',
            },
          },
        }
      : {}),
    statusHistory: { create: [{ status: 'PENDING', note: 'Commande passée' }] },
  });

  return order;
}

export async function getOrder(id) {
  const order = await orderRepo.findOrderById(id);
  if (!order) throw httpError(404, 'Commande introuvable');
  return order;
}

export async function listAdminOrders({ status } = {}) {
  const restaurantId = await getActiveRestaurantId();
  return orderRepo.listOrders({ restaurantId, status });
}

export async function changeStatus(id, input) {
  const { status, note } = parseOrThrow(orderStatusPatch, input);
  const current = await orderRepo.findOrderById(id);
  if (!current) throw httpError(404, 'Commande introuvable');
  if (!canTransition(current.status, status)) {
    throw httpError(400, `Transition invalide : ${current.status} → ${status}`);
  }
  return orderRepo.updateStatus(id, status, note);
}
