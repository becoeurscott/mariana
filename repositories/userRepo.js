import { prisma } from '@/lib/db';

export function listUsers({ limit = 200 } = {}) {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { _count: { select: { orders: true, memberships: true } } },
  });
}

export function findUserByEmail(email) { return prisma.user.findUnique({ where: { email } }); }
export function findUserById(id)       { return prisma.user.findUnique({ where: { id } }); }
export function createUser(data)       { return prisma.user.create({ data }); }
export function updateUser(id, data)   { return prisma.user.update({ where: { id }, data }); }
export function deleteUser(id)         { return prisma.user.delete({ where: { id } }); }

export function createGuest() {
  return prisma.user.create({ data: { isGuest: true } });
}
