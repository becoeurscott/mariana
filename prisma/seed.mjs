import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const RESTAURANT = {
  slug: 'huff-and-puff',
  name: 'Huff & Puff',
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
  { name: 'Entrées',         sortOrder: 1 },
  { name: 'Plats',           sortOrder: 2 },
  { name: 'Grillades',       sortOrder: 3 },
  { name: 'Accompagnements', sortOrder: 4 },
  { name: 'Desserts',        sortOrder: 5 },
  { name: 'Boissons',        sortOrder: 6 },
];

const ITEMS = [
  /* ---------------- Entrées ---------------- */
  {
    cat: 'Entrées', name: 'Accras de morue', price: 11.0, dietary: null,
    description: 'Beignets croustillants de morue épicée, sauce pimentée maison — un classique ouest-africain.',
    image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&w=800&q=80',
  },
  {
    cat: 'Entrées', name: 'Samoussas au bœuf', price: 10.0, dietary: null,
    description: 'Triangles dorés farcis au bœuf haché, oignons et épices, servis avec un chutney de mangue.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
  },
  {
    cat: 'Entrées', name: 'Salade d’avocat & mangue', price: 12.0, dietary: 'Vegan',
    description: 'Avocat, mangue mûre, oignon rouge, coriandre et jus de citron vert.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  },

  /* ---------------- Plats ---------------- */
  {
    cat: 'Plats', name: 'Jollof Rice au poulet', price: 24.0, dietary: 'Gluten-Free',
    description: 'Riz jollof mijoté à la tomate et au poivron, poulet mariné aux épices, plantain frit.',
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=800&q=80',
  },
  {
    cat: 'Plats', name: 'Poulet Yassa', price: 23.0, dietary: 'Gluten-Free',
    description: 'Poulet sénégalais mariné au citron et oignons confits, servi avec du riz parfumé.',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80',
  },
  {
    cat: 'Plats', name: 'Thieboudienne', price: 26.0, dietary: 'Gluten-Free',
    description: 'Le plat national du Sénégal — poisson farci, riz à la tomate, légumes racines mijotés.',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
  },
  {
    cat: 'Plats', name: 'Mafé de bœuf', price: 25.0, dietary: 'Gluten-Free',
    description: 'Ragoût de bœuf à la pâte d’arachide, patate douce et carottes, riz blanc.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
  },
  {
    cat: 'Plats', name: 'Egusi & Pounded Yam', price: 24.0, dietary: 'Gluten-Free',
    description: 'Ragoût nigérian de graines de melon et épinards, accompagné d’igname pilée.',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80',
  },
  {
    cat: 'Plats', name: 'Tagine d’agneau aux abricots', price: 28.0, dietary: 'Gluten-Free',
    description: 'Agneau marocain mijoté lentement, abricots secs, amandes grillées, semoule.',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
  },
  {
    cat: 'Plats', name: 'Doro Wat éthiopien', price: 25.0, dietary: 'Gluten-Free',
    description: 'Poulet mijoté au berbéré et beurre épicé, œuf mollet, servi sur injera.',
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
  },
  {
    cat: 'Plats', name: 'Curry de légumes & arachide', price: 20.0, dietary: 'Vegan',
    description: 'Patate douce, épinards et pois chiches au lait de coco et arachide, riz complet.',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80',
  },

  /* ---------------- Grillades ---------------- */
  {
    cat: 'Grillades', name: 'Suya de bœuf', price: 22.0, dietary: 'Gluten-Free',
    description: 'Brochettes de bœuf nigérianes au yaji (mélange d’arachide et piment), oignons frais.',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80',
  },
  {
    cat: 'Grillades', name: 'Poisson braisé entier', price: 29.0, dietary: 'Gluten-Free',
    description: 'Dorade entière marinée aux épices, grillée au feu de bois, sauce tomate-piment.',
    image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=800&q=80',
  },
  {
    cat: 'Grillades', name: 'Poulet braisé à la kedjenou', price: 24.0, dietary: 'Gluten-Free',
    description: 'Poulet ivoirien mijoté à l’étouffée avec tomates, gingembre et piment vert.',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80',
  },

  /* ---------------- Accompagnements ---------------- */
  {
    cat: 'Accompagnements', name: 'Plantains frits (Alloco)', price: 9.0, dietary: 'Vegan',
    description: 'Bananes plantains mûres frites, sauce tomate-oignon pimentée.',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
  },
  {
    cat: 'Accompagnements', name: 'Attiéké', price: 8.0, dietary: 'Vegan',
    description: 'Semoule de manioc fermentée de Côte d’Ivoire, oignons et tomates frais.',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80',
  },
  {
    cat: 'Accompagnements', name: 'Fufu', price: 8.0, dietary: 'Vegan',
    description: 'Pâte lisse d’igname et plantain, parfaite pour accompagner les ragoûts.',
    image: 'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?auto=format&fit=crop&w=800&q=80',
  },
  {
    cat: 'Accompagnements', name: 'Riz jollof (portion)', price: 9.0, dietary: 'Vegan',
    description: 'Riz long grain mijoté à la tomate, poivron et épices ouest-africaines.',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
  },

  /* ---------------- Desserts ---------------- */
  {
    cat: 'Desserts', name: 'Thiakry', price: 10.0, dietary: 'Vegetarian',
    description: 'Couscous de mil sucré au lait fermenté, vanille et fleur d’oranger.',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
  },
  {
    cat: 'Desserts', name: 'Puff-puff', price: 8.0, dietary: 'Vegetarian',
    description: 'Beignets moelleux ouest-africains, sucre vanillé et coulis de mangue.',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80',
  },
  {
    cat: 'Desserts', name: 'Salade de fruits tropicaux', price: 9.0, dietary: 'Vegan',
    description: 'Mangue, ananas, papaye et fruit de la passion, menthe fraîche et citron vert.',
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&w=800&q=80',
  },

  /* ---------------- Boissons ---------------- */
  {
    cat: 'Boissons', name: 'Bissap (hibiscus)', price: 7.0, dietary: 'Vegan',
    description: 'Infusion glacée de fleurs d’hibiscus, gingembre et menthe.',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80',
  },
  {
    cat: 'Boissons', name: 'Jus de gingembre', price: 7.0, dietary: 'Vegan',
    description: 'Gingembre frais pressé, citron vert et un soupçon de sucre de canne.',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80',
  },
  {
    cat: 'Boissons', name: 'Thé à la menthe marocain', price: 6.0, dietary: 'Vegan',
    description: 'Thé vert gunpowder, menthe fraîche généreuse, servi à la traditionnelle.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
  },
];

/** Option groups keyed by dish name. */
const OPTION_GROUPS = [
  {
    dish: 'Jollof Rice au poulet',
    name: 'Niveau de piment',
    required: true,
    maxSelect: 1,
    options: [
      { name: 'Doux', price: 0 },
      { name: 'Moyen', price: 0 },
      { name: 'Fort', price: 0 },
    ],
  },
  {
    dish: 'Suya de bœuf',
    name: 'Suppléments',
    required: false,
    maxSelect: 3,
    options: [
      { name: 'Extra yaji (épices arachide)', price: 2 },
      { name: 'Plantains frits', price: 4 },
      { name: 'Oignons marinés', price: 2 },
    ],
  },
  {
    dish: 'Poisson braisé entier',
    name: 'Accompagnement',
    required: true,
    maxSelect: 1,
    options: [
      { name: 'Attiéké', price: 0 },
      { name: 'Riz jollof', price: 2 },
      { name: 'Plantains frits', price: 3 },
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

  console.log('Seed :', ITEMS.length, 'articles dans', CATEGORIES.length, 'catégories.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
