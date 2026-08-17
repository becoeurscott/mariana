import { z } from 'zod';

/* ------------------------- Menu ------------------------- */

export const menuItemUpsert = z.object({
  restaurantId: z.string().uuid().optional(),
  categoryId:   z.string().uuid(),
  name:         z.string().min(1).max(120),
  description:  z.string().max(2000).optional().nullable(),
  price:        z.number().nonnegative(),
  image:        z.string().url().optional().nullable(),
  available:    z.boolean().optional(),
  featured:     z.boolean().optional(),
  dietary:      z.enum(['Vegetarian', 'Gluten-Free', 'Vegan', '']).optional().nullable(),
});

export const menuCategoryUpsert = z.object({
  restaurantId: z.string().uuid().optional(),
  name:         z.string().min(1).max(60),
  sortOrder:    z.number().int().optional(),
  isActive:     z.boolean().optional(),
});

/* ------------------------- Orders ------------------------- */

export const orderLine = z.object({
  menuItemId:   z.string().uuid(),
  quantity:     z.number().int().min(1).max(100),
  selectedOptions: z.array(z.object({
    groupName:  z.string().optional(),
    name:       z.string(),
    price:      z.number().nonnegative(),
  })).optional().default([]),
  instructions: z.string().max(500).optional(),
});

export const orderCreate = z.object({
  restaurantId: z.string().uuid().optional(),
  type:         z.enum(['DELIVERY', 'PICKUP']).default('DELIVERY'),
  tipAmount:    z.number().nonnegative().optional().default(0),
  customerName:  z.string().min(1).optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  specialInstructions: z.string().max(1000).optional(),
  deliveryAddress: z.string().optional(),
  deliveryCity:    z.string().optional(),
  deliveryState:   z.string().optional(),
  deliveryZip:     z.string().optional(),
  items:        z.array(orderLine).min(1),
});

export const orderStatusPatch = z.object({
  status: z.enum([
    'PENDING', 'PAID', 'ACCEPTED', 'PREPARING',
    'READY', 'DISPATCHED', 'DELIVERED', 'CANCELLED',
  ]),
  note:   z.string().max(500).optional(),
});

/* ------------------------- Restaurant ------------------------- */

export const restaurantUpdate = z.object({
  name:         z.string().min(1).max(120).optional(),
  tagline:      z.string().max(240).optional().nullable(),
  logoUrl:      z.string().url().optional().nullable(),
  brandPrimary: z.string().regex(/^#?[0-9a-fA-F]{6}$/).optional().nullable(),
  brandDark:    z.string().regex(/^#?[0-9a-fA-F]{6}$/).optional().nullable(),
  currency:     z.string().length(3).optional(),
  taxRate:      z.number().min(0).max(100).optional(),
  deliveryFee:  z.number().nonnegative().optional(),
  minOrder:     z.number().nonnegative().optional(),
  addressLine:  z.string().optional().nullable(),
  city:         z.string().optional().nullable(),
  postalCode:   z.string().optional().nullable(),
  country:      z.string().optional().nullable(),
  phone:        z.string().optional().nullable(),
  email:        z.string().email().optional().nullable(),
  openingHours: z.string().optional().nullable(),
  isActive:     z.boolean().optional(),
});

/* ------------------------- Auth ------------------------- */

export const registerInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
});

export const loginInput = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/* ------------------------- Helper ------------------------- */

/** Parse or throw HttpError(400). */
export function parseOrThrow(schema, input) {
  const r = schema.safeParse(input);
  if (!r.success) {
    const msg = r.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    const err = new Error(`Invalid input — ${msg}`);
    err.status = 400;
    throw err;
  }
  return r.data;
}
