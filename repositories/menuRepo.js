import { prisma } from '@/lib/db';

/** All categories with their available items and option groups for a tenant. */
export function listMenuForRestaurant(restaurantId) {
  return prisma.menuCategory.findMany({
    where: { restaurantId, isActive: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      items: {
        where: { available: true },
        include: { optionGroups: { include: { options: true } } },
        orderBy: { name: 'asc' },
      },
    },
  });
}

/** Admin listing — includes inactive/unavailable, plus option counts. */
export function listAllForAdmin(restaurantId) {
  return prisma.menuCategory.findMany({
    where: { restaurantId },
    orderBy: { sortOrder: 'asc' },
    include: {
      items: {
        include: { optionGroups: { include: { options: true } } },
        orderBy: { name: 'asc' },
      },
    },
  });
}

export function findItemsByIds(ids) {
  return prisma.menuItem.findMany({ where: { id: { in: ids } } });
}

export function createItem(data)          { return prisma.menuItem.create({ data }); }
export function updateItem(id, data)      { return prisma.menuItem.update({ where: { id }, data }); }
export function deleteItem(id)            { return prisma.menuItem.delete({ where: { id } }); }

export function createCategory(data)      { return prisma.menuCategory.create({ data }); }
export function updateCategory(id, data)  { return prisma.menuCategory.update({ where: { id }, data }); }
export function deleteCategory(id)        { return prisma.menuCategory.delete({ where: { id } }); }

export function createOptionGroup(data)   { return prisma.menuItemOptionGroup.create({ data }); }
export function deleteOptionGroup(id)     { return prisma.menuItemOptionGroup.delete({ where: { id } }); }
export function createOption(data)        { return prisma.menuItemOption.create({ data }); }
export function deleteOption(id)          { return prisma.menuItemOption.delete({ where: { id } }); }
