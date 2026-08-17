import { prisma } from '@/lib/db';

export function listRestaurants()             { return prisma.restaurant.findMany({ orderBy: { createdAt: 'asc' } }); }
export function findRestaurantById(id)        { return prisma.restaurant.findUnique({ where: { id } }); }
export function updateRestaurant(id, data)    { return prisma.restaurant.update({ where: { id }, data }); }
export function createRestaurant(data)        { return prisma.restaurant.create({ data }); }
