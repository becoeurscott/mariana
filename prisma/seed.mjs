import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const RESTAURANT = {
  slug: 'marianafood',
  name: 'MariAnafood',
  tagline: 'Ce n’est pas juste un repas, c’est une expérience.',
  brandPrimary: '#C88339',
  brandDark: '#13382C',
  currency: 'USD',
  taxRate: 8.25,
  deliveryFee: 4.99,
  minOrder: 0,
  addressLine: '123 rue du Signal',
  city: 'Paris',
  postalCode: '75011',
  country: 'FR',
  phone: '+33 1 23 45 67 89',
  email: 'bonjour@marianafood.co',
  openingHours: JSON.stringify({
    mon: ['12:00-14:30', '18:30-22:30'],
    tue: ['12:00-14:30', '18:30-22:30'],
    wed: ['12:00-14:30', '18:30-22:30'],
    thu: ['12:00-14:30', '18:30-22:30'],
    fri: ['12:00-14:30', '18:30-23:00'],
    sat: ['12:00-23:00'],
    sun: ['closed'],
  }),
};

/* Starting small: one category, two signature dishes. */
const CATEGORIES = [
  { name: 'Nos plats', sortOrder: 1 },
];

const ITEMS = [
  {
    cat: 'Nos plats',
    name: 'Croque Monsieur',
    price: 14.0,
    dietary: null,
    description:
      'Pain de mie brioché, jambon blanc supérieur, béchamel maison et gruyère ' +
      'gratiné au four jusqu’à la dorure parfaite. Servi avec une salade verte.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1000&q=85',
  },
  {
    cat: 'Nos plats',
    name: 'Lasagne',
    price: 18.0,
    dietary: null,
    description:
      'Pâtes fraîches superposées, ragù de bœuf mijoté six heures, béchamel ' +
      'onctueuse et parmesan affiné. Gratinée à la commande, basilic frais.',
    image: 'https://images.unsplash.com/photo-1619895092538-128341789043?auto=format&fit=crop&w=1000&q=85',
  },
];

const OPTION_GROUPS = [
  {
    dish: 'Croque Monsieur',
    name: 'Accompagnement',
    required: true,
    maxSelect: 1,
    options: [
      { name: 'Salade verte', price: 0 },
      { name: 'Frites maison', price: 3 },
      { name: 'Soupe du jour', price: 4 },
    ],
  },
  {
    dish: 'Croque Monsieur',
    name: 'Suppléments',
    required: false,
    maxSelect: 3,
    options: [
      { name: 'Œuf au plat (Croque Madame)', price: 2 },
      { name: 'Double fromage', price: 3 },
      { name: 'Champignons', price: 2 },
    ],
  },
  {
    dish: 'Lasagne',
    name: 'Portion',
    required: true,
    maxSelect: 1,
    options: [
      { name: 'Individuelle', price: 0 },
      { name: 'Grande (2 personnes)', price: 12 },
    ],
  },
  {
    dish: 'Lasagne',
    name: 'Suppléments',
    required: false,
    maxSelect: 2,
    options: [
      { name: 'Parmesan supplémentaire', price: 2 },
      { name: 'Pain à l’ail', price: 4 },
    ],
  },
];

async function main() {
  console.log('Seed…');

  await prisma.orderItemOption.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.deliveryInfo.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItemOption.deleteMany();
  await prisma.menuItemOptionGroup.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.restaurant.deleteMany();

  const restaurant = await prisma.restaurant.create({ data: RESTAURANT });
  console.log('Restaurant :', restaurant.name, `(${restaurant.slug})`);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@marianafood.local' },
    update: { role: 'ADMIN' },
    create: {
      email: 'admin@marianafood.local',
      passwordHash: await bcrypt.hash('admin123', 10),
      firstName: 'Super',
      lastName: 'Admin',
      role: 'ADMIN',
    },
  });
  const owner = await prisma.user.upsert({
    where: { email: 'owner@marianafood.local' },
    update: { role: 'OWNER' },
    create: {
      email: 'owner@marianafood.local',
      passwordHash: await bcrypt.hash('owner123', 10),
      firstName: 'Marco',
      lastName: 'Propriétaire',
      role: 'OWNER',
    },
  });
  console.log('Admin       :', admin.email, '(mot de passe : admin123)');
  console.log('Propriétaire:', owner.email, '(mot de passe : owner123)');

  await prisma.membership.createMany({
    data: [
      { userId: admin.id, restaurantId: restaurant.id, role: 'OWNER' },
      { userId: owner.id, restaurantId: restaurant.id, role: 'OWNER' },
    ],
  });

  const catMap = {};
  for (const c of CATEGORIES) {
    const created = await prisma.menuCategory.create({
      data: { ...c, restaurantId: restaurant.id },
    });
    catMap[c.name] = created.id;
  }

  const itemMap = {};
  for (const it of ITEMS) {
    const created = await prisma.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: catMap[it.cat],
        name: it.name,
        description: it.description,
        price: it.price,
        image: it.image,
        dietary: it.dietary,
        featured: true,
      },
    });
    itemMap[it.name] = created.id;
  }

  for (const g of OPTION_GROUPS) {
    const menuItemId = itemMap[g.dish];
    if (!menuItemId) continue;
    const group = await prisma.menuItemOptionGroup.create({
      data: { menuItemId, name: g.name, required: g.required, maxSelect: g.maxSelect },
    });
    await prisma.menuItemOption.createMany({
      data: g.options.map((o) => ({ optionGroupId: group.id, name: o.name, price: o.price })),
    });
  }

  console.log('Seed :', ITEMS.length, 'articles dans', CATEGORIES.length, 'catégorie(s).');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
