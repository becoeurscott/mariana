import * as repo from '@/repositories/restaurantRepo';
import { parseOrThrow, restaurantUpdate } from '@/lib/validation';
import { getActiveRestaurantId } from '@/lib/tenant';

export async function getCurrentRestaurant() {
  const id = await getActiveRestaurantId();
  return repo.findRestaurantById(id);
}

export async function updateCurrent(input) {
  const id = await getActiveRestaurantId();
  const data = parseOrThrow(restaurantUpdate, input);
  return repo.updateRestaurant(id, data);
}

export async function updateRestaurantById(id, input) {
  const data = parseOrThrow(restaurantUpdate, input);
  return repo.updateRestaurant(id, data);
}
