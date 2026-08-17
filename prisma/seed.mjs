import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const RESTAURANT = {
  slug: 'huff-and-puff',
  name: 'Huff & Puff',
  tagline: 'Ce n’est pas juste un repas, c’est une expérience.',
  brandPrimary: '#C88339',
  brandDark: '#13382C',
  currency: 'EUR',
  taxRate: 8.25,
  deliveryFee: 4.99,
  minOrder: 0,
  addressLine: '123 rue du Signal',
  city: 'Paris',
  postalCode: '75011',
  country: 'FR',
  phone: '+33 1 23 45 67 89',
  email: 'bonjour@huffandpuff.co',
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

const CATEGORIES = [
  { name: 'Entrées',   sortOrder: 1 },
  { name: 'Pâtes',     sortOrder: 2 },
  { name: 'Plats',     sortOrder: 3 },
  { name: 'Desserts',  sortOrder: 4 },
  { name: 'Boissons',  sortOrder: 5 },
  { name: 'Accompagnements', sortOrder: 6 },
];

const ITEMS = [
  { cat: 'Entrées', name: 'Bruschetta aux tomates anciennes', description: 'Pain de campagne toasté, basilic, huile d’olive extra vierge, balsamique vieilli.', price: 14.0, dietary: 'Vegetarian', image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=800&q=80' },
  { cat: 'Entrées', name: 'Burrata & Prosciutto', description: 'Burrata crémeuse, prosciutto de San Daniele, roquette, glaçage à la figue.', price: 18.0, dietary: null, image: 'https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb?auto=format&fit=crop&w=800&q=80' },

  { cat: 'Pâtes', name: 'Ravioli artisanaux à la truffe', description: 'Ravioli maison, crème de truffe, champignons sauvages, parmigiano.', price: 28.0, dietary: 'Vegetarian', image: 'https://images.unsplash.com/photo-1587740908075-9e245311f26d?auto=format&fit=crop&w=800&q=80' },
  { cat: 'Pâtes', name: 'Pappardelle al Ragù', description: 'Pappardelle taillées à la main, ragù de bœuf braisé longuement.', price: 26.0, dietary: null, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80' },
  { cat: 'Pâtes', name: 'Risotto aux champignons sauvages', description: 'Riz Carnaroli, cèpes, taleggio, copeaux de truffe noire.', price: 32.0, dietary: 'Gluten-Free', image: 'https://images.unsplash.com/photo-1673421162147-b3060eff6cd4?auto=format&fit=crop&w=800&q=80' },
  { cat: 'Pâtes', name: 'Ravioli poêlés à la truffe', description: 'Ravioli dorés, crème de safran, poudre de pistache.', price: 28.0, dietary: 'Vegetarian', image: 'https://images.unsplash.com/photo-1610614819513-58e34989848b?auto=format&fit=crop&w=800&q=80' },

  { cat: 'Plats', name: 'Burger Wagyu & frites', description: 'Wagyu A5, cheddar affiné, oignons confits, frites à la truffe.', price: 32.0, dietary: null, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80' },
  { cat: 'Plats', name: 'Saint-Jacques poêlées, beurre citron-câpres', description: 'Saint-Jacques de plongée, beurre citron-câpres, purée de chou-fleur.', price: 32.0, dietary: 'Gluten-Free', image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=800&q=80' },
  { cat: 'Plats', name: 'Entrecôte grillée', description: 'Entrecôte maturée 300 g, beurre de moelle, légumes de saison.', price: 46.0, dietary: 'Gluten-Free', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },

  { cat: 'Desserts', name: 'Tiramisu della Casa', description: 'Mascarpone, savoiardi imbibés de café, cacao, vin santo.', price: 12.0, dietary: 'Vegetarian', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80' },
  { cat: 'Desserts', name: 'Fondant au chocolat chaud', description: 'Chocolat noir coulant, gelato caramel salé, praliné aux noisettes.', price: 13.0, dietary: 'Vegetarian', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80' },

  { cat: 'Boissons', name: 'Vin rouge maison — Nebbiolo', description: 'Piémont, Italie — au verre. Pétales de rose, cerise, tanins subtils.', price: 14.0, dietary: null, image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=800&q=80' },
  { cat: 'Boissons', name: 'Spritz Aperol', description: 'Prosecco, Aperol, eau gazeuse, rondelle d’orange.', price: 12.0, dietary: null, image: 'https://images.unsplash.com/photo-1568644396922-5c3bfae12521?auto=format&fit=crop&w=800&q=80' },

  { cat: 'Accompagnements', name: 'Frites truffe & parmesan', description: 'Frites double-cuisson, parmesan affiné, huile de truffe noire.', price: 10.0, dietary: 'Vegetarian', image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80' },
  { cat: 'Accompagnements', name: 'Broccolini grillé', description: 'Broccolini au feu de bois, piment, citron, pecorino.', price: 11.0, dietary: 'Vegetarian', image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=800&q=80' },
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

  // Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@huffandpuff.local' },
    update: { role: 'ADMIN' },
    create: {
      email: 'admin@huffandpuff.local',
      passwordHash: await bcrypt.hash('admin123', 10),
      firstName: 'Super',
      lastName: 'Admin',
      role: 'ADMIN',
    },
  });
  const owner = await prisma.user.upsert({
    where: { email: 'owner@huffandpuff.local' },
    update: { role: 'OWNER' },
    create: {
      email: 'owner@huffandpuff.local',
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

  for (const it of ITEMS) {
    await prisma.menuItem.create({
      data: {
        restaurantId: restaurant.id,
        categoryId: catMap[it.cat],
        name: it.name,
        description: it.description,
        price: it.price,
        image: it.image,
        dietary: it.dietary,
      },
    });
  }

  const wagyu = await prisma.menuItem.findFirst({ where: { name: 'Burger Wagyu & frites' } });
  if (wagyu) {
    const grp = await prisma.menuItemOptionGroup.create({
      data: { menuItemId: wagyu.id, name: 'Suppléments', required: false, maxSelect: 3 },
    });
    await prisma.menuItemOption.createMany({
      data: [
        { optionGroupId: grp.id, name: 'Extra fromage', price: 2 },
        { optionGroupId: grp.id, name: 'Bacon', price: 3 },
        { optionGroupId: grp.id, name: 'Œuf au plat', price: 2 },
      ],
    });
  }

  console.log('Seed :', ITEMS.length, 'articles dans', CATEGORIES.length, 'catégories.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
