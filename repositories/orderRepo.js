import { prisma } from '@/lib/db';

export function createOrder(data) {
  return prisma.order.create({
    data,
    include: { items: { include: { selectedOptions: true } }, deliveryInfo: true },
  });
}

export function findOrderById(id) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { selectedOptions: true, menuItem: true } },
      deliveryInfo: true,
      payment: true,
      statusHistory: { orderBy: { createdAt: 'asc' } },
      restaurant: { select: { name: true, slug: true, currency: true } },
    },
  });
}

export function listOrders({ restaurantId, status, limit = 100 } = {}) {
  return prisma.order.findMany({
    where: {
      ...(restaurantId ? { restaurantId } : {}),
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: 'desc' },
    include: { items: true, deliveryInfo: true, payment: true },
    take: limit,
  });
}

export function updateStatus(id, status, note = null) {
  return prisma.$transaction([
    prisma.order.update({ where: { id }, data: { status } }),
    prisma.orderStatusHistory.create({ data: { orderId: id, status, note } }),
  ]).then(([o]) => o);
}
