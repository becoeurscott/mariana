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

/** Single item with full detail for the dish page — category name + option groups. */
export function findItemDetail(id) {
  return prisma.menuItem.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true } },
      optionGroups: { include: { options: true } },
    },
  });
}

/** Other available items from the same category, excluding this one. */
export function findRelatedItems({ restaurantId, categoryId, excludeId, take = 4 }) {
  return prisma.menuItem.findMany({
    where: { restaurantId, categoryId, available: true, id: { not: excludeId } },
    orderBy: { name: 'asc' },
    take,
  });
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
