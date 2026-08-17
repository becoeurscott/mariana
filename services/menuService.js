import * as repo from '@/repositories/menuRepo';
import { getActiveRestaurantId } from '@/lib/tenant';
import { parseOrThrow, menuItemUpsert, menuCategoryUpsert } from '@/lib/validation';

export async function getPublicMenu() {
  const rid = await getActiveRestaurantId();
  return { categories: await repo.listMenuForRestaurant(rid) };
}

export async function getAdminMenu() {
  const rid = await getActiveRestaurantId();
  return { categories: await repo.listAllForAdmin(rid) };
}

export async function createMenuItem(input) {
  const rid = await getActiveRestaurantId();
  const data = parseOrThrow(menuItemUpsert, input);
  return repo.createItem({ ...data, restaurantId: rid, dietary: data.dietary || null });
}

export async function updateMenuItem(id, input) {
  const data = parseOrThrow(menuItemUpsert.partial(), input);
  return repo.updateItem(id, data);
}

export async function deleteMenuItem(id) { return repo.deleteItem(id); }

export async function createMenuCategory(input) {
  const rid = await getActiveRestaurantId();
  const data = parseOrThrow(menuCategoryUpsert, input);
  return repo.createCategory({ ...data, restaurantId: rid });
}

export async function updateMenuCategory(id, input) {
  const data = parseOrThrow(menuCategoryUpsert.partial(), input);
  return repo.updateCategory(id, data);
}

export async function deleteMenuCategory(id) { return repo.deleteCategory(id); }
